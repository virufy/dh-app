import json
import boto3
import base64
import uuid
import datetime
import os

# Use environment variables set by Terraform
S3_BUCKET = os.environ['S3_BUCKET']
DYNAMO_TABLE = os.environ['DYNAMO_TABLE']

# Initialize AWS clients
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(DYNAMO_TABLE)

def build_response(status_code, message):
    """Helper function to build HTTP responses with CORS headers"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  # Allow all origins, change to your frontend domain if needed
            'Access-Control-Allow-Credentials': True
        },
        'body': json.dumps({'message': message})
    }

def lambda_handler(event, context):
    """Main Lambda handler function"""

    http_method = event.get('httpMethod')
    path = event.get('path')

    # Handle OPTIONS preflight request for CORS
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Credentials': True
            },
            'body': ''
        }

    # Health check endpoint
    if http_method == 'GET' and path == '/status':
        return build_response(200, 'Service is operational')

    # Upload audio endpoint
    elif http_method == 'POST' and path == '/upload':
        try:
            # Parse JSON body from request
            body = json.loads(event.get('body', '{}'))

            # Extract required fields
            patient_id = body['patientId']                 # Unique patient identifier
            audio_type = body.get('audioType', 'unknown') # Type of audio (cough, speech, breath)
            audio_base64 = body['audioBase64']             # Base64 encoded audio data (updated key)
            filename = body.get('filename', 'unknown.wav') # Filename sent from frontend (optional)
            metadata = body.get('metadata', {})            # Optional metadata

            # Generate unique audio ID and timestamp
            audio_id = str(uuid.uuid4())
            timestamp = datetime.datetime.utcnow().isoformat()

            # Decode base64 audio to binary
            audio_bytes = base64.b64decode(audio_base64)

            # Define S3 object key with audio type folder
            s3_key = f"{patient_id}/{audio_type}/{audio_id}.wav"

            # Upload to S3
            s3.put_object(Bucket=S3_BUCKET, Key=s3_key, Body=audio_bytes)

            # Save metadata to DynamoDB
            item = {
                'patientId': patient_id,
                'audioId': audio_id,
                'audioType': audio_type,
                'timestamp': timestamp,
                's3Path': s3_key,
                'filename': filename,
                'metadata': metadata
            }

            table.put_item(Item=item)

            return build_response(200, 'Audio file uploaded and metadata saved successfully.')

        except Exception as e:
            print(f"Error: {e}")
            return build_response(400, f"Error processing request: {str(e)}")

    # Handle any other route
    else:
        return build_response(404, '404 Not Found')
