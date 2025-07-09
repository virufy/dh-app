import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  padding: 1.5rem 1rem;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  background-color: transparent;
  font-size: 14px;
`;

export const Wrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  position: relative;
`;

export const Header = styled.div`
  position: relative;
  margin-top: 1.25rem;
  margin-bottom: 1.75rem;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

export const HeaderText = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  color: #3578de;
`;

export const Title = styled.h3`
  font-size: 32px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 2rem;
`;

export const StepContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const StepNumber = styled.div`
  min-width: 28px;
  height: 28px;
  background-color: #dde9ff;
  border-radius: 50%;
  text-align: center;
  line-height: 28px;
  font-weight: bold;
  color: #3578de;
  font-size: 20px;
`;

export const StepText = styled.div`
  flex: 1;
  font-size: 20px;
`;

export const StepImage = styled.img`
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const Timer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.75rem;
  margin-top: 3.5rem;
`;

export const TimerBox = styled.div`
  border: 1px solid #3578de;
  color: #3578de;
  padding: 0.6rem 1.5rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 20px;
`;

export const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
`;

export const RoundButton = styled.button<{ bg: string }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ bg }) => bg};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const ButtonLabel = styled.div`
  font-size: 18px;
  margin-top: 0.5rem;
  color: #666;
  text-align: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const ContinueButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 1.5rem;
  border-radius: 15px;
  font-weight: bold;
  cursor: pointer;
`;

export const UploadButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const UploadLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

export const Footer = styled.div`
  text-align: center;
`;

export const FooterLink = styled.a`
  font-size: 0.8rem;
  font-weight: bold;
  color: #3578de;
  text-decoration: underline;
`;
