import React from 'react';

const GlowingButtonStatic = ({
  children,
  onClick,
  width,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  width?: string;
}) => {
  return (
    <div className="button-wrapper">
      <div className="button-background">
        <div onClick={onClick} className="button-content">
          {children}
        </div>
      </div>
      <style jsx>{`
        .button-wrapper {
          border-radius: 64px;
          background-color: #34333d;
          display: flex;
          ${width
            ? `
          width: ${width};
          max-width: ${width};`
            : 'max-width: 200px;'}
          flex-direction: column;
          justify-content: center;
          font-size: 16px;
          color: #fff;
          font-weight: 400;
          text-align: center;
          letter-spacing: -0.16px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1); /* Add this line */
        }
        .button-content:hover {
          background-color: #34333d; /* Add this line */
          cursor: pointer; /* Add this line */
        }
        .button-background {
          border-radius: 64px;
          background: radial-gradient(41.36% 43.62% at 50% 0%, #fc6eff 0%, rgba(0, 0, 0, 0) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 1px 1px;
        }
        .button-content {
          font-family: 'BDO Grotesk', sans-serif;
          border-radius: 64px;
          background-color: #030204;
          justify-content: center;
          padding: 12px 47px;
          text-wrap: nowrap;
        }
      `}</style>
    </div>
  );
};

export default GlowingButtonStatic;
