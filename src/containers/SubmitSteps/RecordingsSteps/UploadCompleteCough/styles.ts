import styled from 'styled-components';

export const PageWrapper = styled.div`
  min-height: 94vh;
  padding: 1.5rem 1rem;
  display: flex;
  justify-content: center;
  background-color: transparent;
  font-family: 'Source Sans Pro', sans-serif;
  overflow: auto;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

export const HeaderTitle = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  color: #3578de;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: #333;
`;

export const Subtitle = styled.p`
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0.8rem;
  color: #393939;
`;

export const FileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 0.4rem;
`;

export const Slider = styled.input`
  width: 100%;
  height: 6px;
  appearance: none;
  background-color: #dde9ff;
  border-radius: 4px;
  outline: none;
  margin-bottom: 0.2rem;
`;

export const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  color: #888;
  margin-bottom: 1.5rem;
`;

export const PlayButton = styled.button`
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  background-color: #dde9ff;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 auto 1.5rem;
`;

export const RetakeButton = styled.button`
  width: 100%;
  padding: 1.5rem;
  border: 3.5px solid #3578de;
  border-radius: 15px;
  font-weight: bold;
  color: #3578de;
  background-color: transparent;
  margin-bottom: 2.5rem;
  cursor: pointer;
  font-size: 16px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1.5rem;
  background-color: #3578de;
  border: none;
  border-radius: 15px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  margin-bottom: 0.5rem;
  font-size: 16px;
`;

export const Footer = styled.div`
  text-align: center;
`;

export const ErrorLink = styled.a`
  font-size: 0.8rem;
  font-weight: bold;
  color: #3578de;
  text-decoration: underline;
`;
