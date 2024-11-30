import React from 'react';

const LoadingAnimation = () => {
    return (
        <>
            <div className="loading">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <style jsx>{
                `.loading {
                display: flex;
                justify-content: center;
                align-items: center;
              }
              
              .loading div {
                width: 6px;
                height: 6px;
                margin: 0 3px;
                border-radius: 50%;
                background: white;
                animation: loading 1.2s infinite ease-in-out;
              }
              
              .loading div:nth-child(2) {
                animation-delay: 0.3s;
              }
              
              .loading div:nth-child(3) {
                animation-delay: 0.7s;
              }
              
              @keyframes loading {
                0%, 80%, 100% {
                  transform: scale(0);
                }
                40% {
                  transform: scale(1);
                }
              }`
            } </style>
        </>

    );
};

export default LoadingAnimation;