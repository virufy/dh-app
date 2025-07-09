import styled from 'styled-components';

export const Container = styled.div`
  font-family: "source sans pro", sans-serif;
  background-color: transparent;
  //width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  //box-sizing: border-box;
  //padding: 0;
  //margin: 0;
`;

export const InnerWrapper = styled.div`
  //width: 100%;
  max-width: 1000px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const Logo = styled.img`
  width: 10rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
`;

export const Title = styled.h2`
  font-family: 'Open Sans', Arial, sans-serif;
  font-size: 3rem;
  font-weight: bold;
  color: #393939;
  margin-bottom: 4rem;
  line-height: 1.4;
`;

export const ButtonStyled = styled.button`
  background-color: #3578de;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  max-width: 280px;
  margin-bottom: 1.5rem;
`;

export const ErrorLink = styled.a`
  font-size: 0.8rem;
  color: #3578de;
  text-decoration: underline;
  font-weight: 510;
`;