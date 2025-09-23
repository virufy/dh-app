import styled from 'styled-components';

export const Container = styled.div`
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 0.5rem;
    box-sizing: border-box;
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 14px;
   
`;

export const Content = styled.div`
    width: 100%;
    max-width: 700px;
    margin: 0 auto;

    @media (min-width: 768px) {
        max-width: 500px;
        width: 100%;
    }
`;

export const Header = styled.div`
    position: relative;
    margin-top: 0.05rem;
    text-align: center;
`;

export const BackButton = styled.button<{ isArabic?: boolean }>`
    position: absolute;
    top: 0;
    background: none;
    border: none;
    cursor: pointer;
    ${({ isArabic }) => (isArabic ? 'right: -10px;' : 'left: -10px;')};
    @media (min-width: 768px) {
        ${({ isArabic }) => (isArabic ? 'right: -30px;' : 'left: -30px;')}


`;

export const HeaderText = styled.div`
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    color: #3578de;
    margin-top: 0.5rem;
`;

export const StepWrapper = styled.div<{ isArabic?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: ${({ isArabic }) => (isArabic ? 'row-reverse' : 'row')};
  gap: 0.75rem;
  margin-bottom: 2rem;
  width: 100%;
`;

export const StepCircle = styled.div`
  width: 28px;
  height: 28px;
  background-color: #DDE9FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #3578de;
  font-size: 14px;
  flex-shrink: 0;
`;







export const InstructionText = styled.div`
    flex: 1;
    font-size: 14px;
    max-width: 400px;
    margin: 0 auto 0 0;

    
    [dir="rtl"] & {
        direction: rtl;
        text-align: right;
        unicode-bidi: isolate;
        margin: 0 0 0 auto; /* Flip margin for RTL */
    }
    @media(min-width:768px ) {
        max-width: 550px;
        margin-bottom: 1.5rem;
        margin-top: 1.5rem;
        text-align: left;

    }
`;

export const Image = styled.img`
  width: 190px;
  height: 127px;
  margin: 0 auto 2rem;
  display: block;
   
`;

export const Timer = styled.div`
    display: flex;
    justify-content: center;
    margin: 3.5rem 0 1.75rem;
`;

export const TimerBox = styled.div`
    border: 1px solid #3578de;
    color: #3578de;
    padding: 0.6rem 1.5rem;
    border-radius: 12px;
    font-weight: bold;
    font-size: 20px;
`;

export const ButtonRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2.5rem;
`;

export const CircleButton = styled.button<{ bg: string }>`
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
    font-size: 14px;
    margin-top: 0.5rem;
    color: #666;
`;


// export const CheckboxRow = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     background-color: #f7f7f7;
//     border: 1px solid #f7f7f7;
//     border-radius: 12px;
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

export const ActionButtons = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2.5rem;

    & > button:first-child {
        background-color: #3578de;
        color: white;
        border: none;
        padding: 1.25rem 1.5rem;
        border-radius: 15px;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        max-width: 450px;
        text-align: center;
        
    }
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

export const UploadText = styled.span`
    font-size: 13px;
    font-weight: 600;
    color: #000000;
    margin: 0 ;
`;

export const HiddenFileInput = styled.input`
    display: none;
`;
export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); // dim background
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
`;
export const ModalContainer = styled.div`
    background-color: #fff;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    width: 90%;
    max-width: 400px;

    @media (max-width: 480px) {
        padding: 1.5rem 1rem;
        border-radius: 0.75rem;
    }
`;

export const ModalTitle = styled.h2`
    font-size: 24px;
    margin-bottom: 1rem;
    color: #222;

    @media (max-width: 480px) {
        font-size: 20px;
    }
`;
export const ModalText = styled.p`
    font-size: 14px; // already mobile-friendly
    margin-bottom: 2rem;

    @media (max-width: 480px) {
        margin-bottom: 1.5rem;
    }
`;

export const ModalButton = styled.button`
    background-color: #3578de;
    color: #fff;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    width: 100%; // makes it mobile-friendly for touch

    &:hover {
        background-color: #2e66c7;
    }

    @media (max-width: 480px) {
        font-size: 14px;
        padding: 0.6rem 1.5rem;
    }
`;
export const FooterLink = styled.a`
    font-size: 14px;
    font-weight: bold;
    color: #3578de;
    text-decoration: underline;
    text-align: center;
    display: block;
`;
