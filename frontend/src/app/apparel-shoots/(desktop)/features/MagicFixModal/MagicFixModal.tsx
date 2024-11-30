import { CloseOutlined } from '@ant-design/icons';
import { Slider } from 'antd';
import { Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { EraserSVG, MotionBrushSVG } from '@/components/IconSvg';

type CanvasRef = React.RefObject<HTMLCanvasElement>;

export default function MagicFixModal({
  idx,
  imageSrc,
  previewImage,
  toggleModal,
  // maskImage,
  // setMaskImage,
  setMagicMaskImageFile,
  magicFix,
}: any) {
  const containerRef = useRef(null);
  const canvasRef1 = useRef(null);
  const canvasRef2: CanvasRef = React.useRef(null);
  const [isCustomMode, setIsCustomMode] = React.useState(true);
  const [isEraserMode, setIsEraserMode] = React.useState(false);

  const [brushSize, setBrushSize] = useState(5);

  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const onBrashChange = (newValue: number) => {
    setBrushSize(newValue);
  };

  const handleMouseDown = (e: any) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setLastPos({ x: offsetX, y: offsetY });
    setDrawing(true);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleMouseMove = (e: any) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas: any = canvasRef2.current;
    const ctx = canvas.getContext('2d');
    //clear the canvas
    if (isEraserMode) {
      ctx.clearRect(offsetX - brushSize / 2, offsetY - brushSize / 2, brushSize, brushSize);
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(offsetX, offsetY);
      ctx.strokeStyle = 'rgba(128,0,128,1)';
      ctx.lineWidth = brushSize;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    setLastPos({ x: offsetX, y: offsetY });
  };

  useEffect(() => {
    const container: any = containerRef.current;
    const canvas1: any = canvasRef1.current;
    const ctx1 = canvas1.getContext('2d');

    const canvas2: any = canvasRef2.current;
    const ctx2 = canvas2.getContext('2d');

    let img1 = new Image();
    img1.src = previewImage; // replace with your reference image path
    let img2 = new Image();

    img1.onload = function () {
      // Calculate the aspect ratio of the image
      let aspectRatio = img1.width / img1.height;

      // Set the canvas size to match the container while maintaining the aspect ratio
      let canvasWidth = container.offsetWidth;
      let canvasHeight = container.offsetWidth / aspectRatio;

      // If the calculated height is greater than the container's height, adjust the width instead
      if (canvasHeight > container.offsetHeight) {
        canvasHeight = container.offsetHeight;
        canvasWidth = container.offsetHeight * aspectRatio;
      }

      canvas1.width = canvasWidth;
      canvas1.height = canvasHeight;
      ctx1.drawImage(img1, 0, 0, canvas1.width, canvas1.height);
      canvas2.width = canvas1.width;
      canvas2.height = canvas1.height;
      // Start loading image2
      // img2.src = maskImage; // replace with your mask image path
    };

    img2.onload = function () {
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      // Calculate the aspect ratio of the image
      let aspectRatio = img2.width / img2.height;

      // Set the canvas size to match the container while maintaining the aspect ratio
      let canvasWidth = container.offsetWidth;
      let canvasHeight = container.offsetWidth / aspectRatio;

      // If the calculated height is greater than the container's height, adjust the width instead
      if (canvasHeight > container.offsetHeight) {
        canvasHeight = container.offsetHeight;
        canvasWidth = container.offsetHeight * aspectRatio;
      }

      // canvas2.width = canvasWidth;
      // canvas2.height = canvasHeight;
      ctx2.drawImage(img2, 0, 0, canvas2.width, canvas2.height);

      let imageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
      let data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        // If white, make transparent
        if (red === 255 && green === 255 && blue === 255) {
          data[i + 3] = 0;
        }
        // If black, make semi-opaque purple
        else if (red === 0 && green === 0 && blue === 0) {
          data[i] = 128; // Red
          data[i + 1] = 0; // Green
          data[i + 2] = 128; // Blue
          data[i + 3] = 255; // Alpha
        }
        // If any other color, make transparent
        else {
          data[i + 3] = 0;
        }
      }
      ctx2.putImageData(imageData, 0, 0);
    };
  }, [previewImage]);

  const createImageData = (canvasRef: CanvasRef) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let imageData: ImageData | null = null;

    if (canvas && ctx) {
      ctx.save(); // Save the current context state
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i] >= 125 && data[i + 2] >= 125) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 0;
        } else if (data[i + 3] === 0) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 255;
        }
      }
      ctx.restore(); // Restore the context state
    }

    return imageData;
  };

  const createTempCanvas = (imageData: ImageData, canvasRef: CanvasRef) => {
    const canvas = canvasRef.current;
    let tempCanvas = document.createElement('canvas');
    if (canvas) {
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      let tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.putImageData(imageData, 0, 0);
      }
    }
    return tempCanvas;
  };

  const createBlendedImage = (
    img: HTMLImageElement,
    tempCanvas: HTMLCanvasElement,
    scaleFactor: number = 1,
  ) => {
    let blendCanvas = document.createElement('canvas');
    blendCanvas.width = img.width * scaleFactor;
    blendCanvas.height = img.height * scaleFactor;
    let blendCtx = blendCanvas.getContext('2d');

    if (blendCtx) {
      blendCtx.save(); // Save the current context state
      blendCtx.drawImage(img, 0, 0, blendCanvas.width, blendCanvas.height);
      blendCtx.globalCompositeOperation = 'destination-in';
      blendCtx.drawImage(tempCanvas, 0, 0, blendCanvas.width, blendCanvas.height);

      // Create a new canvas, fill it with black
      let blackCanvas = document.createElement('canvas');
      blackCanvas.width = blendCanvas.width;
      blackCanvas.height = blendCanvas.height;
      let blackCtx = blackCanvas.getContext('2d');
      if (blackCtx) {
        blackCtx.fillStyle = 'black';
        blackCtx.fillRect(0, 0, blackCanvas.width, blackCanvas.height);
      }

      // Draw the black canvas behind the original image
      blendCtx.globalCompositeOperation = 'destination-over';
      blendCtx.drawImage(blackCanvas, 0, 0, blendCanvas.width, blendCanvas.height);

      blendCtx.restore(); // Restore the context state
    }

    return blendCanvas.toDataURL('image/jpeg');
  };

  const createWhiteMaskImage = (tempCanvas: HTMLCanvasElement, scaleFactor: number = 1) => {
    let whiteMaskCanvas = document.createElement('canvas');
    whiteMaskCanvas.width = tempCanvas.width * scaleFactor;
    whiteMaskCanvas.height = tempCanvas.height * scaleFactor;
    let whiteMaskCtx = whiteMaskCanvas.getContext('2d');

    if (whiteMaskCtx) {
      whiteMaskCtx.save(); // Save the current context state
      whiteMaskCtx.drawImage(tempCanvas, 0, 0, whiteMaskCanvas.width, whiteMaskCanvas.height);
      whiteMaskCtx.globalCompositeOperation = 'destination-over';
      whiteMaskCtx.fillStyle = 'white';
      whiteMaskCtx.fillRect(0, 0, whiteMaskCanvas.width, whiteMaskCanvas.height);
      whiteMaskCtx.globalCompositeOperation = 'source-over';
      whiteMaskCtx.restore(); // Restore the context state
    }

    return whiteMaskCanvas.toDataURL('image/jpeg');
  };

  const saveMaskImageCopy = () => {
    let imageData = createImageData(canvasRef2);
    let tempCanvas = imageData ? createTempCanvas(imageData, canvasRef2) : null;

    let dataUrl = tempCanvas?.toDataURL('image/jpeg');
    let blob = dataURLToBlob(dataUrl);
    let file = new File([blob], 'filename.jpg', { type: 'image/jpeg' });

    let img = new Image();
    img.onload = function () {
      if (tempCanvas) {
        let whiteMaskDataUrl = createWhiteMaskImage(tempCanvas, 2);
        let whiteMaskBlob = dataURLToBlob(whiteMaskDataUrl);
        let whiteMaskFile = new File([whiteMaskBlob], 'white-mask.jpg', { type: 'image/jpeg' });
        setMagicMaskImageFile(whiteMaskFile);
        magicFix(idx, whiteMaskFile);
      }
    };
    img.src = imageSrc;

    toggleModal();
  };

  // Helper function to convert a data URL to a Blob
  function dataURLToBlob(dataUrl: any) {
    let arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  return (
    <div
      style={{
        backgroundColor: 'rgba(31,31,31,1)',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'stretch',
        flexDirection: 'column',
        gap: '11px',
        padding: '11px',
        paddingRight: '3.5px',
        paddingTop: '11px',
        paddingBottom: '3.5px',
        borderRadius: '8px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          gap: '2px',
          flexGrow: '0',
          flexShrink: '0',
          flexBasis: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            flexDirection: 'row',
            flexGrow: '0',
            flexShrink: '0',
            flexBasis: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(14,14,14,1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              width: '34px',
              height: '34px',
              flexGrow: '0',
              flexShrink: '0',
              flexBasis: 'auto',
              borderRadius: '8px ',
              marginRight: '4px',
            }}
          >
            <Sparkles />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              flexDirection: 'row',
              flexGrow: '0',
              flexShrink: '0',
              flexBasis: 'auto',
              marginLeft: '11px',
            }}
          >
            <span
              style={{
                fontSize: '13.5px',
                fontWeight: '500',
                color: 'white',
                whiteSpace: 'pre-wrap',
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: 'auto',
                marginRight: '3.5px',
              }}
            >
              Magic Fix
            </span>
          </div>
        </div>
        <div
          style={{
            flexGrow: '0',
            flexShrink: '0',
            flexBasis: 'auto',
          }}
        ></div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          {/* <div
                        style={{
                            backgroundColor: "rgba(14,14,14,1)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            width: "34px",
                            height: "34px",
                            flexGrow: "0",
                            flexShrink: "0",
                            flexBasis: "auto",
                            borderRadius: "8px ",
                            marginRight: "8px",
                            cursor: "pointer"
                        }}
                    >
                        <RedoSVG />
                    </div>
                    <div
                        style={{
                            backgroundColor: "rgba(14,14,14,1)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            width: "34px",
                            height: "34px",
                            flexGrow: "0",
                            flexShrink: "0",
                            flexBasis: "auto",
                            borderRadius: "8px ",
                            marginRight: "8px",
                            cursor: "pointer"
                        }}
                    >
                        <UndoSVG />
                    </div> */}
          <div
            style={{
              backgroundColor: 'rgba(14,14,14,1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              width: '34px',
              height: '34px',
              flexGrow: '0',
              flexShrink: '0',
              flexBasis: 'auto',
              borderRadius: '8px ',
              marginRight: '8px',
              cursor: 'pointer',
            }}
            onClick={() => {
              toggleModal();
            }}
          >
            <X color="white" size={18} />
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '600px',
          maxHeight: '600px',
          position: 'relative',
        }}
      >
        <canvas ref={canvasRef1} style={{ position: 'absolute', zIndex: '1' }}></canvas>
        <canvas
          ref={canvasRef2}
          style={{
            position: 'absolute',
            zIndex: '2',
            opacity: '0.5',
            cursor: isCustomMode
              ? isEraserMode
                ? 'url("cursor/eraser.cur"), auto'
                : 'url("cursor/pencil1.cur"), auto'
              : 'default',
          }}
          onMouseDown={
            isCustomMode
              ? handleMouseDown
              : (e: any) => {
                e.preventDefault();
              }
          }
          onMouseUp={
            isCustomMode
              ? handleMouseUp
              : (e: any) => {
                e.preventDefault();
              }
          }
          onMouseOut={
            isCustomMode
              ? handleMouseUp
              : (e: any) => {
                e.preventDefault();
              }
          }
          onMouseMove={
            isCustomMode
              ? handleMouseMove
              : (e: any) => {
                e.preventDefault();
              }
          }
        ></canvas>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          flexDirection: 'row',
          gap: '2px',
          height: '33px',
          flexGrow: '0',
          flexShrink: '0',
          flexBasis: 'auto',
          boxSizing: 'border-box',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'stretch',
            flexDirection: 'row',
            gap: '1px',
            flexGrow: '0',
            flexShrink: '0',
            boxSizing: 'border-box',
          }}
        >
          <>
            <div
              style={{
                backgroundColor: isEraserMode ? 'rgba(58,58,58,1)' : 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                gap: '2px',
                height: '33px',
                boxSizing: 'border-box',
                padding: '0 13px',
                marginRight: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => setIsEraserMode(false)}
            >
              <MotionBrushSVG style={{ stroke: isEraserMode ? '#AEAEAE' : 'black' }} />
            </div>
            <div
              style={{
                backgroundColor: !isEraserMode ? 'rgba(58,58,58,1)' : 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                gap: '2px',
                height: '33px',
                boxSizing: 'border-box',
                padding: '0 13px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => setIsEraserMode(true)}
            >
              <EraserSVG style={{ stroke: !isEraserMode ? '#AEAEAE' : 'black' }} />
            </div>
            <div style={{ padding: '0 8px', minWidth: '100px' }}>
              <Slider
                min={1}
                max={30}
                onChange={onBrashChange}
                value={typeof brushSize === 'number' ? brushSize : 0}
              />
            </div>
          </>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'stretch',
            flexDirection: 'row',
            flexGrow: '0',
            flexShrink: '0',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(58,58,58,1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',
              flexDirection: 'column',
              flexGrow: '0',
              flexShrink: '0',
              flexBasis: 'auto',
              padding: '0 13px',
              marginRight: '8px',
              borderRadius: '5px',
              boxSizing: 'border-box',
              minWidth: '65px',
            }}
            onClick={() => {
              toggleModal();
            }}
          >
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '500',
                color: 'rgba(192,192,192,1)',
                whiteSpace: 'pre-wrap',
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: 'auto',
                cursor: 'pointer',
              }}
              onClick={() => {
                toggleModal();
              }}
            >
              Cancel
            </span>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',
              flexDirection: 'column',
              flexGrow: '0',
              flexShrink: '0',
              flexBasis: 'auto',
              marginLeft: '3px',
              padding: '0 13px',
              borderRadius: '5px',
              boxSizing: 'border-box',
              cursor: 'pointer',
              minWidth: '65px',
            }}
            onClick={saveMaskImageCopy}
          >
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '500',
                color: 'black',
                textAlign: 'center',
                whiteSpace: 'pre-wrap',
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: 'auto',
                margin: '0',
              }}
            >
              Continue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
