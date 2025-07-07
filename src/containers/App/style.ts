import { CSSProperties } from 'react';

export const pageContainer: CSSProperties = {
  padding: '40px 20px',
  maxWidth: '500px',
  margin: '0 auto',
  fontFamily: "'Source Sans Pro', sans-serif",
};

export const title: CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,  // <-- changed to bold
  fontFamily: "'Abel', sans-serif",
  color: '#3578DE',
  marginBottom: '30px',
  lineHeight: 1.4,
  textAlign: 'center',
};

export const fieldLabel: CSSProperties = {
  display: 'block',
  marginTop: '20px',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: 700,
  fontFamily: "'Source Sans Pro', sans-serif",
  color: '#393939',
};

export const fieldInput: CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #ccc',
  fontSize: '14px',
  boxSizing: 'border-box',
  backgroundColor: '#F5F8FD',
};

export const dropdown: CSSProperties = {
  ...fieldInput,
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='%23393939'><polygon points='7,11 3,5 11,5'/></svg>")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '14px',
  paddingRight: '40px',
};


export const buttonContainer: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '80px',
  paddingRight: '20px',
};

export const buttonCircle: CSSProperties = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#edf3ff',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

export const arrowIcon: CSSProperties = {
  color: '#3578DE',
  fontSize: '30px',
};
