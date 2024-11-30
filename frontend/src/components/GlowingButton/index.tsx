import React from 'react';

const GlowingButton = ({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: any;
}) => {
  return (
    <div className="button-wrapper" style={style} onClick={onClick}>
      <div onClick={onClick} className="">
        {children}
      </div>
      {/* <div className="button-background">
      </div> */}
      <style jsx>{`
        .button-wrapper {
          padding: 12px 47px;
          border-radius: 10rem;
          background-color: transparent;
          font-size: 16px;
          color: #fff;
          text-align: center;
          border: none;
          position: relative;
          overflow: hidden;
        }

        .button-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: #f4adff;
          transform: translate(-50%, -50%);
          animation: glowing 2s infinite;
          animation-timing-function: linear;
          filter: blur(12px);
        }

        .button-wrapper::after {
          content: '${children}';
          position: absolute;
          top: 2%;
          left: 1%;
          width: 98%;
          height: 96%;
          background-color: #111111;
          border-radius: inherit;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .button-wrapper:hover::after {
          background-color: linear-gradient(to top, #f4adff, #fc6eff);
        }

        @keyframes glowing {
          0% {
            left: 0;
            top: 0;
          }
          25% {
            left: 100%;
            top: 0;
          }
          50% {
            left: 100%;
            top: 100%;
          }
          75% {
            left: 0;
            top: 100%;
          }
          100% {
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default GlowingButton;
