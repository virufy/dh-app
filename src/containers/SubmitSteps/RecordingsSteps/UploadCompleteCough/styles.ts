// styles.ts
import styled from 'styled-components';

export const Container = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f8f8f8;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const Content = styled.div`
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
`;

export const Header = styled.div`
  position: relative;
  text-align: center;
  padding: 20px;
  h3 {
    color: #3578de;
    margin-bottom: 0.5rem;
  }
`;

export const BackButton = styled.button`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
`;

export const Filename = styled.div`
  margin-bottom: 1rem;
  font-weight: bold;
`;

export const PlayButton = styled.button`
  width: 108px;
  height: 108px;
  border-radius: 50%;
  border: none;
  background-color: #e0f0ff;
  color: #3578de;
  font-size: 46px;
  cursor: pointer;
  margin-bottom: 1rem;
`;

export const DurationText = styled.div`
  margin-bottom: 1.5rem;
`;

export const RetakeButton = styled.button`
  margin-right: 1rem;
  border: 2px solid #3578de;
  padding: 0.5rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  color: #3578de;
  background-color: transparent;
  font-weight: bold;
  font-size: 16px;
  width: 100%;
  margin-bottom: 0.5rem;
`;

export const SubmitButton = styled.button`
  margin-right: 1rem;
  border: 2px solid #3578de;
  background-color: #3578de;
  color: #fff;
  padding: 0.5rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  width: 100%;
`;

export const ErrorLink = styled.div`
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #007bff;
  text-decoration: underline;

  a {
    color: #007bff;
    text-decoration: underline;
  }
`;
