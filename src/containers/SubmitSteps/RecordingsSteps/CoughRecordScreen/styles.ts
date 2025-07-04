import styled from 'styled-components';

export const Container = styled.div`
  background-color: #f8f8f8;
  min-height: 100vh;
  padding: 2rem;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const Content = styled.div`
  padding: 2rem;
  max-width: 700px;
  width: 100%;
`;

export const Header = styled.div`
  position: relative;
  text-align: center;
  margin: 0;
  padding: 20px;

  h2 {
    color: #3578DE;
    margin-bottom: 1rem;
  }
`;

export const BackButton = styled.button`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;

  img {
    width: 25px;
    height: 35px;
  }
`;

export const Paragraph = styled.p`
  margin-bottom: 1rem;
`;

export const Image = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

export const Timer = styled.div`
  text-align: center;
  background-color: #f0f4ff;
  padding: 0.75rem;
  border-radius: 20px;
  font-size: 24px;
  font-weight: bold;
  width: 10%;
  margin: 0 auto 1.5rem auto;
  border: 2px solid #3578DE;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const RecordButton = styled.button`
  background-color: #e6f0ff;
  border: none;
  border-radius: 999px;
  padding: 1rem 1.5rem;
  font-size: 16px;
  font-weight: bold;
  color: #007bff;
  cursor: pointer;
`;

export const StopButton = styled.button`
  background-color: #ffe6e6;
  border: none;
  border-radius: 999px;
  padding: 1rem 1.5rem;
  font-size: 16px;
  font-weight: bold;
  color: #cc0000;
  cursor: pointer;
`;

export const CheckboxRow = styled.div`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const ContinueButton = styled.button`
  background-color: #3578DE;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
`;

export const UploadButton = styled.button`
  background-color: #f8f8f8;
  border: none;
  padding: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;

  img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
    margin-bottom: -2px;
  }
`;

export const Footer = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: #3578DE;
  text-decoration: underline;

  a {
    color: #007bff;
  }
`;
