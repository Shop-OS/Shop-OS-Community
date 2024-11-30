import React, { useEffect, useRef, useState } from 'react';

const CanvasEditor = ({ imageFile, canvasRef }: any) => {
  let image = new Image();
  let ctx: any = null;
  let scale = 1;
  let scaleStep = 0.1;
  let pos = { draggable: false, x: 0, y: 0, lastX: 0, lastY: 0 };

  const handleWheel = (e: any) => {
    if (e.deltaY < 0) {
      // Zoom in
      scale += scaleStep;
    } else {
      // Zoom out
      scale = Math.max(scale - scaleStep, 0.1); // Prevent scale from becoming negative
    }

    // Redraw the image with the new scale
    draw();
  };

  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Calculate the position to center the image
    const x = (ctx.canvas.width - image.width * scale) / 2 + pos.x;
    const y = (ctx.canvas.height - image.height * scale) / 2 + pos.y;

    ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
  };

  const handleMouseDown = (e: any) => {
    pos = { ...pos, draggable: true, lastX: e.clientX, lastY: e.clientY };
  };

  const handleMouseMove = (e: any) => {
    if (pos.draggable) {
      pos.x += e.clientX - pos.lastX;
      pos.y += e.clientY - pos.lastY;
      pos.lastX = e.clientX;
      pos.lastY = e.clientY;
      draw();
    }
  };

  const handleMouseUp = () => {
    pos.draggable = false;
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    ctx = canvas.getContext('2d');

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        image.src = (event.target as FileReader).result as string;
        image.onload = () => {
          scale = Math.min(canvas.width / image.width, canvas.height / image.height);
          draw();
        };
      };
      reader.readAsDataURL(imageFile);
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [imageFile]);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="editorCanvas"
        width="518"
        height="518"
        className="canvas"
        style={{ backgroundColor: '#1f1f1f', borderRadius: 10 }}
      ></canvas>
      {/* <button onClick={takeScreenshot}>Take Screenshot</button> */}
    </>
  );
};

export default CanvasEditor;
