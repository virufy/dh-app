# Configure the AWS Provider (set your AWS region here)
provider "aws" {
  region = "us-east-1"
}

# S3 Bucket to store raw audio files
resource "aws_s3_bucket" "audio_bucket" {
  bucket = "karamah-audio-uploads-2025"

  tags = {
    Name        = "KaramahAudioUploadsBucket"
    Environment = "Development"
    Project     = "SehaDubaiAudioApp"
  }
}

# DynamoDB Table to store audio metadata
resource "aws_dynamodb_table" "audio_metadata" {
  name         = "SehaDubaiAudioMetadata"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "patientId"
  range_key    = "audioId"

  attribute {
    name = "patientId"
    type = "S"
  }

  attribute {
    name = "audioId"
    type = "S"
  }

  tags = {
    Environment = "Development"
    Project     = "SehaDubaiAudioApp"
  }
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_exec_role" {
  name = "sehadubai-lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach AWSLambdaBasicExecutionRole policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# IAM policy to allow S3 PutObject
resource "aws_iam_role_policy" "lambda_s3_put_policy" {
  name = "lambda_s3_put_policy"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:PutObject"]
      Resource = "arn:aws:s3:::karamah-audio-uploads-2025/*"
    }]
  })
}

# IAM policy to allow DynamoDB PutItem
resource "aws_iam_role_policy" "lambda_dynamodb_policy" {
  name = "lambda_dynamodb_put_policy"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["dynamodb:PutItem"]
      Resource = aws_dynamodb_table.audio_metadata.arn
    }]
  })
}

# Lambda function
resource "aws_lambda_function" "audio_data_ingestion_function" {
  function_name = "sehadubai-audio-data-ingestion"

  filename         = "lambda_function_payload.zip"
  source_code_hash = filebase64sha256("lambda_function_payload.zip")

  handler = "lambda_function.lambda_handler"
  runtime = "python3.9"
  role    = aws_iam_role.lambda_exec_role.arn

  environment {
    variables = {
      S3_BUCKET    = aws_s3_bucket.audio_bucket.bucket
      DYNAMO_TABLE = aws_dynamodb_table.audio_metadata.name
    }
  }
}

# API Gateway REST API
resource "aws_api_gateway_rest_api" "audio_api" {
  name        = "SehaDubaiAudioAPI"
  description = "API Gateway for audio upload and ingestion"
}

# Resource for /upload
resource "aws_api_gateway_resource" "upload_resource" {
  rest_api_id = aws_api_gateway_rest_api.audio_api.id
  parent_id   = aws_api_gateway_rest_api.audio_api.root_resource_id
  path_part   = "upload"
}

# POST method for /upload
resource "aws_api_gateway_method" "post_method" {
  rest_api_id   = aws_api_gateway_rest_api.audio_api.id
  resource_id   = aws_api_gateway_resource.upload_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# Integration with Lambda for POST /upload
resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.audio_api.id
  resource_id             = aws_api_gateway_resource.upload_resource.id
  http_method             = aws_api_gateway_method.post_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.audio_data_ingestion_function.invoke_arn
}

# OPTIONS method for /upload (CORS preflight)
resource "aws_api_gateway_method" "options_method" {
  rest_api_id   = aws_api_gateway_rest_api.audio_api.id
  resource_id   = aws_api_gateway_resource.upload_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# Mock integration for OPTIONS method to respond with CORS headers
resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id             = aws_api_gateway_rest_api.audio_api.id
  resource_id             = aws_api_gateway_resource.upload_resource.id
  http_method             = aws_api_gateway_method.options_method.http_method
  type                    = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

# Method response for OPTIONS with CORS headers
resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id = aws_api_gateway_rest_api.audio_api.id
  resource_id = aws_api_gateway_resource.upload_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Headers" = true
  }
}

# Integration response to set CORS headers
resource "aws_api_gateway_integration_response" "options_200" {
  rest_api_id       = aws_api_gateway_rest_api.audio_api.id
  resource_id       = aws_api_gateway_resource.upload_resource.id
  http_method       = aws_api_gateway_method.options_method.http_method
  status_code       = aws_api_gateway_method_response.options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }
}

# Resource for /status
resource "aws_api_gateway_resource" "status_resource" {
  rest_api_id = aws_api_gateway_rest_api.audio_api.id
  parent_id   = aws_api_gateway_rest_api.audio_api.root_resource_id
  path_part   = "status"
}

# GET method for /status
resource "aws_api_gateway_method" "get_status_method" {
  rest_api_id   = aws_api_gateway_rest_api.audio_api.id
  resource_id   = aws_api_gateway_resource.status_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

# Integration for GET /status
resource "aws_api_gateway_integration" "lambda_status_integration" {
  rest_api_id             = aws_api_gateway_rest_api.audio_api.id
  resource_id             = aws_api_gateway_resource.status_resource.id
  http_method             = aws_api_gateway_method.get_status_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.audio_data_ingestion_function.invoke_arn
}

# Permission for API Gateway to invoke Lambda
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.audio_data_ingestion_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.audio_api.execution_arn}/*/*"
}

# Deployment of API Gateway
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_method.post_method,
    aws_api_gateway_method.options_method,
    aws_api_gateway_method.get_status_method,
    aws_api_gateway_integration.lambda_integration,
    aws_api_gateway_integration.options_integration,
    aws_api_gateway_integration.lambda_status_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.audio_api.id
}

# Stage for deployment
resource "aws_api_gateway_stage" "prod_stage" {
  rest_api_id   = aws_api_gateway_rest_api.audio_api.id
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  stage_name    = "prod"
}
