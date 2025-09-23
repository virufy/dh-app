import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 94vh;
  padding: 1.5rem 1rem;
  display: flex;
  justify-content: center;
  background-color: #fff;
  font-family: "Source Sans Pro", sans-serif;
  overflow: auto;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ControlsWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  width: 100%;
  max-width: 500px; 
  margin: 0 auto; 
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const BackButton = styled.button<{ isArabic?: boolean }>`
  position: absolute;
  top: 0;
  ${({ isArabic }) => (isArabic ? "right: 0;" : "left: 0;")}
  background: none;
  border: none;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }
`;

export const HeaderTitle = styled.div`
  text-align: center;
  font-size: 18px;
  color: #3578de;
  font-weight: 600;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #000000;
`;

export const Subtitle = styled.p`
  text-align: left;
  font-size: 1.2rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 1.5rem;

  [dir="rtl"] & {
    text-align: right;
  }  
`;

export const FileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 0.8rem;
  width: 100%;
`;

export const Slider = styled.input`
  width: 100%;
  margin: 0.5rem auto;
  height: 6px;
  appearance: none;
  background-color: #dde9ff;
  border-radius: 4px;
  outline: none;

  &::-webkit-slider-thumb {
    width: 15px;
    height: 15px;
    background-color: #3578de;
    border-radius: 50%;
    cursor: pointer;
    appearance: none;
  }
`;

export const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #888;
  margin-bottom: 2rem;
  width: 100%;
`;

export const PlayButton = styled.button`
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 50%;
  background-color: #dde9ff;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 1.5rem auto 3rem;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const RetakeButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: 3px solid #3578de;
  border-radius: 15px;
  font-weight: bold;
  color: #3578de;
  background-color: transparent;
  margin-bottom: 1rem;
  cursor: pointer;
  font-size: 16px;
  max-width: 500px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: #3578de;
  border: none;
  border-radius: 15px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  margin-bottom: 0.5rem;
  font-size: 16px;
  max-width: 500px;
`;

export const Footer = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

export const ErrorLink = styled.a`
  font-size: 0.8rem;
  font-weight: bold;
  color: #3578de;
  text-decoration: underline;
`;
// export const CheckboxRow = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
    
//     padding: 0.75rem 1rem;
//     margin: 2rem auto;

//     width: 100%;
//     max-width: 450px;
//     box-sizing: border-box;
// `;
// export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
//   width: 24px;
//   height: 24px;
//   appearance: none;
//   -webkit-appearance: none;
//   background-color: white;
//   border: 3px solid #c4c4c4;
//   border-radius: 6px;
//   cursor: pointer;
//   display: inline-block;
//   position: relative;

//   &:checked {
//     background-color: #007bff;
//     border-color: #007bff;
//   }

//   &:checked::after {
//     content: '';
//     position: absolute;
//     left: 6px;
//     top: 1px;
//     width: 6px;
//     height: 12px;
//     border: solid white;
//     border-width: 0 2px 2px 0;
//     transform: rotate(45deg);
//   }
// `;

// export const Label = styled.label`
//     font-size: 1rem;
//     color: #393939;
// `;
export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  margin-right: 0.75rem;
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #3578de;
  margin-right: 0.5rem;
`;
