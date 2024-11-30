import { Resizable } from 're-resizable';
import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

import useImageStore from '../store/ImageStore';

const Canvas = ({ canvasRef }) => {
  const { logoFile, productFile, copyText, backgroundImage } = useImageStore();

  const [dragging, setDragging] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e, data, element) => {
    const offsetX = e.clientX - element.getBoundingClientRect().left;
    const offsetY = e.clientY - element.getBoundingClientRect().top;

    setDragging(true);
    setSelectedElement(element);
    setDragOffset({ x: offsetX, y: offsetY });

    // Bring the dragged element to the front
    element.style.zIndex = 1000;
  };

  const handleDrag = (e, data) => {
    if (selectedElement && dragging) {
      const x = data.x - dragOffset.x;
      const y = data.y - dragOffset.y;

      // Apply new position to the dragged element
      selectedElement.style.left = `${x}px`;
      selectedElement.style.top = `${y}px`;
    }
  };

  const handleDragStop = () => {
    if (selectedElement) {
      // Reset z-index after dragging ends
      selectedElement.style.zIndex = 'auto';
    }

    setDragging(false);
    setSelectedElement(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 'auto',
        width: 'fit-content',
        marginRight: 20,
        marginLeft: 20,
      }}
    >
      <div
        ref={canvasRef}
        style={{
          backgroundImage:
            'linear-gradient(to right, #111111 1px, transparent 1px), linear-gradient(to bottom, #111111 1px, transparent 1px)',
          backgroundSize: '5px 5px',
          border: '1px dashed #2E2E2E',
          borderRadius: '12px',
          height: '400px',
          marginBottom: '10px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '10px',
          position: 'relative',
          width: '700px',
          overflow: 'hidden', // Prevent elements from sticking out
        }}
      >
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Background"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              pointerEvents: 'none', // Disable pointer events for the background
            }}
          />
        )}

        {logoFile && (
          <Draggable
            bounds="parent"
            // onStart={(e, data) => handleDragStart(e, data, e.target)}
            // onDrag={handleDrag}
            // onStop={handleDragStop}
          >
            <Resizable
              style={{
                position: 'absolute',
                left: logoFile.x || 20,
                top: logoFile.y || 20,
                border: '1px solid #2E2E2E',
                cursor: 'grab',
              }}
              defaultSize={{ width: 50, height: 50 }} // Set the default size
            >
              <img
                src={URL.createObjectURL(logoFile)}
                alt="Logo"
                style={{
                  // cursor: 'grab',
                  // position: 'absolute',
                  // left: logoFile.x || 20,
                  // top: logoFile.y || 20,
                  // width: '50px',
                  // height: '50px',
                  width: '100%',
                  height: '100%',
                }}
              />
            </Resizable>
          </Draggable>
        )}

        {productFile && (
          <Draggable
            bounds="parent"
            // onStart={(e, data) => handleDragStart(e, data, e.target)}
            // onDrag={handleDrag}
            // onStop={handleDragStop}
          >
            <Resizable
              style={{
                position: 'absolute',
                left: productFile.x || 'calc(100% - 10px - 300px)',
                top: productFile.y || 20,
                border: '1px solid #2E2E2E',
                cursor: 'grab',
              }}
              defaultSize={{ width: 450, height: 400 }} // Set the default size
            >
              <img
                src={URL.createObjectURL(productFile)}
                alt="Product"
                style={{
                  // position: 'absolute',
                  // left: productFile.x || 'calc(100% - 10px - 300px)',
                  // top: productFile.y || 20,
                  width: '100%',
                  height: '100%',
                  // cursor: 'grab',
                  // userSelect: 'none', // Avoid text selection during dragging
                }}
              />
            </Resizable>
          </Draggable>
        )}

        {copyText && (
          <Draggable
            bounds="parent"
            onStart={(e, data) => handleDragStart(e, data, e.target)}
            onDrag={handleDrag}
            onStop={handleDragStop}
          >
            <div
              style={{
                color: 'white',
                fontSize: '42px',
                left: '10px',
                position: 'absolute',
                top: '40px',
                cursor: 'pointer',
              }}
            >
              {copyText}
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
};

export default Canvas;
