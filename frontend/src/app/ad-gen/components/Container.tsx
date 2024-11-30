import React from 'react';

const inputContainer: React.CSSProperties = {
  borderRadius: 'var(--geist-border-radius)',

  // backgroundColor: "var(--background)",
  display: 'flex',

  flexDirection: 'column',
  // border: "1px solid var(--unfocused-border-color)",
  paddingTop: '5px',
  width: '85%',
};

export const InputContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div style={inputContainer}>{children}</div>;
};
