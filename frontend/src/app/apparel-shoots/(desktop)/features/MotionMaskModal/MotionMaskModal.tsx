import { TextArea } from '@lobehub/ui';
import { Slider } from 'antd';
import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import {
  BgImageSVG,
  BrushSVG,
  EraserSVG,
  ForegroundImageSVG,
  MotionBrushSVG,
  RedoSVG,
  UndoSVG,
} from '@/components/IconSvg';
import useApparel from '@/app/apparel-shoots/provider/useApparel';

type CanvasRef = React.RefObject<HTMLCanvasElement>;

export default function MotionMaskModal({
  isMaskLoading,
  imageFile,
  productMaskDescription,
  handleCreateMask,
  setProductMaskDescription,
  setAgentInputComponent,
  previewImage,
  toggleMotionEdit,
  maskImage,
  setMaskImage,
  setMaskImageFile,
  setBlendedImageFile,
  setIsMaskLoading,
}: any) {
  const containerRef = useRef(null);
  const canvasRef1 = useRef(null);
  const canvasRef2: CanvasRef = React.useRef(null);
  const [isCustomMode, setIsCustomMode] = React.useState(false);
  const [isEraserMode, setIsEraserMode] = React.useState(false);

  const { pinkMaskData, setPinkMaskData } = useApparel();

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
    setProductMaskDescription('');
  }, [imageFile]);

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
      // img2.src = 'http://172.188.64.75:5000/file?filename=q05f4ksqr192p57zimqp6g_00001'; // replace with your mask image path
      img2.src = pinkMaskData ? pinkMaskData : maskImage; // replace with your mask image path
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
      if (pinkMaskData === null) {
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
      } else {
        // console.log("inside data change")
        // let data = imageData.data;
        // for (let i = 0; i < data.length; i += 4) {
        //   let red = data[i];
        //   let green = data[i + 1];
        //   let blue = data[i + 2];
        //   // If white, make transparent
        //   if (red >= 50 && blue > 50) {

        //   }
        //   // If any other color, make transparent
        //   else {
        //     data[i + 3] = 0;
        //   }
        // }
      }
      ctx2.putImageData(imageData, 0, 0);
    };
  }, [maskImage, pinkMaskData]);

  const createImageData = (canvasRef: CanvasRef) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let imageData: ImageData | null = null;

    //canvas base64 image
    setPinkMaskData(canvas?.toDataURL('image/png'));

    if (canvas && ctx) {
      ctx.save(); // Save the current context state
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 0;
        } else if (data[i] >= 125 && data[i + 2] >= 125) {
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

  // const cropImage = () => {
  //   // Get the contexts of both canvases
  //   const canvas1: any = canvasRef1.current;
  //   const canvas2: any = canvasRef2.current;

  //   const ctx1 = canvas1.getContext('2d');
  //   const ctx2 = canvas2.getContext('2d');

  //   // Get the image data from both canvases
  //   const imgData1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
  //   const imgData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);

  //   // Create a new ImageData object for the result
  //   const resultData = ctx1.createImageData(canvas1.width, canvas1.height);

  //   // Loop over each pixel
  //   for (let i = 0; i < imgData1.data.length; i += 4) {
  //     // If the pixel in imgData2 is black...
  //     if (imgData2.data[i] >= 125 && imgData2.data[i + 2] >= 125) {
  //       // Copy the pixel from imgData1 to resultData
  //       resultData.data[i] = imgData1.data[i];     // Red channel
  //       resultData.data[i + 1] = imgData1.data[i + 1]; // Green channel
  //       resultData.data[i + 2] = imgData1.data[i + 2]; // Blue channel
  //       resultData.data[i + 3] = imgData1.data[i + 3]; // Alpha channel
  //     } else {
  //       // Set the pixel to black
  //       resultData.data[i] = 0;     // Red channel
  //       resultData.data[i + 1] = 0; // Green channel
  //       resultData.data[i + 2] = 0; // Blue channel
  //       resultData.data[i + 3] = 255; // Alpha channel (fully opaque)
  //     }
  //   }

  //   const dataCanvas = document.createElement('canvas');
  //   dataCanvas.width = canvas1.width;
  //   dataCanvas.height = canvas1.height;

  //   // Draw the image data onto the data canvas
  //   const dataCtx: any = dataCanvas.getContext('2d');
  //   dataCtx.putImageData(resultData, 0, 0);

  //   // Draw the result onto a new canvas
  //   const resultCanvas = document.createElement('canvas');
  //   resultCanvas.width = canvas1.width;
  //   resultCanvas.height = canvas1.height;

  //   const resultCtx: any = resultCanvas.getContext('2d');
  //   resultCtx.fillStyle = 'black';

  //   // Fill the entire canvas
  //   resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);

  //   // Draw the data canvas onto the result canvas
  //   resultCtx.drawImage(dataCanvas, 0, 0);
  //   return resultCanvas.toDataURL('image/jpeg', 1);
  // }

  // const saveMaskImage = async () => {
  //   const canvas2: any = canvasRef2.current;
  //   const ctx2 = canvas2.getContext('2d');

  //   // Get the image data from the canvas
  //   let imageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
  //   let data = imageData.data;

  //   for (let i = 0; i < data.length; i += 4) {
  //     // If the pixel is transparent, make it white
  //     if (data[i + 3] === 0) {
  //       data[i] = 255; // Red
  //       data[i + 1] = 255; // Green
  //       data[i + 2] = 255; // Blue
  //       data[i + 3] = 255; // Alpha
  //     }
  //     // If the pixel is purple, make it black
  //     else if (data[i] >= 125 && data[i + 2] >= 125) {
  //       data[i] = 0; // Red
  //       data[i + 1] = 0; // Green
  //       data[i + 2] = 0; // Blue
  //       data[i + 3] = 255; // Blue
  //     }
  //   }
  //   // let imageData = createImageData(canvasRef2);
  //   let tempCanvas: any = imageData ? createTempCanvas(imageData, canvasRef2) : null;
  //   let dataUrl = tempCanvas?.toDataURL('image/jpeg');

  //   let blob = dataURLToBlob(dataUrl);
  //   let file = new File([blob], 'filename.jpg', { type: 'image/jpeg' });

  //   // let blendedDataUrl = createBlendedImage(img, tempCanvas, 0.8);
  //   let blendedDataUrl = cropImage();
  //   let blendedBlob = dataURLToBlob(blendedDataUrl);
  //   let blendedFile = new File([blendedBlob], 'blended.jpg', { type: 'image/jpeg' });

  //   downloadImage(file, 'mask.jpg')
  //   downloadImage(blendedFile, 'blended.jpg');

  //   // let maskUrl = await resizeImage(URL.createObjectURL(file))
  //   // let maskResize = dataURLToBlob(maskUrl);
  //   // let maskResizeFile = new File([maskResize], 'blended.jpg', { type: 'image/jpeg' });
  //   // downloadImage(maskResizeFile, 'maskresize.jpg')

  //   // let bUrl = await resizeImage(URL.createObjectURL(blendedFile))
  //   // let bResize = dataURLToBlob(bUrl);
  //   // let bResizeFile = new File([bResize], 'blended.jpg', { type: 'image/jpeg' });
  //   // downloadImage(bResizeFile, 'b_resize.jpg')

  //   setMaskImageFile(file);
  //   setMaskImage(dataUrl);
  //   setBlendedImageFile(blendedFile);
  //   toggleMotionEdit();
  //   setAgentInputComponent('templates');
  // };

  // const resizeImage = (imgSrc: string): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     // Create a new Image object
  //     const img = new Image();

  //     // When the image has loaded, resize it
  //     img.onload = function () {
  //       // Get the dimensions of the image
  //       const width = img.width;
  //       const height = img.height;

  //       // Calculate the new dimensions
  //       let newWidth;
  //       let newHeight;

  //       if (width > height) {
  //         // If the image is wider than it is tall
  //         newWidth = 1024;
  //         newHeight = (height / width) * 1024;
  //       } else {
  //         // If the image is taller than it is wide
  //         newHeight = 1024;
  //         newWidth = (width / height) * 1024;
  //       }

  //       // Create a new canvas
  //       const canvas = document.createElement('canvas');
  //       canvas.width = newWidth;
  //       canvas.height = newHeight;

  //       // Draw the image onto the canvas
  //       const ctx: any = canvas.getContext('2d');
  //       ctx.drawImage(img, 0, 0, newWidth, newHeight);

  //       // Get the data URL of the canvas
  //       const dataUrl = canvas.toDataURL();

  //       // Resolve the promise with the data URL
  //       resolve(dataUrl);
  //     };

  //     // If there's an error loading the image, reject the promise
  //     img.onerror = function () {
  //       reject(new Error('Could not load image'));
  //     };

  //     // Set the source of the image
  //     img.src = imgSrc;
  //   });
  // };

  const saveMaskImageCopy = () => {
    if (isMaskLoading) return;
    let imageData = createImageData(canvasRef2);
    let tempCanvas = imageData ? createTempCanvas(imageData, canvasRef2) : null;
    let dataUrl = tempCanvas?.toDataURL('image/jpeg');

    let blob = dataURLToBlob(dataUrl);
    let file = new File([blob], 'filename.jpg', { type: 'image/jpeg' });

    let img = new Image();
    img.onload = function () {
      if (tempCanvas) {
        let blendedDataUrl = createBlendedImage(img, tempCanvas, 1.1);
        let blendedBlob = dataURLToBlob(blendedDataUrl);
        let blendedFile = new File([blendedBlob], 'blended.jpg', { type: 'image/jpeg' });
        setBlendedImageFile(blendedFile);
        // downloadImage(blendedFile, 'blended.jpg');

        let whiteMaskDataUrl = createWhiteMaskImage(tempCanvas, 2);
        let whiteMaskBlob = dataURLToBlob(whiteMaskDataUrl);
        let whiteMaskFile = new File([whiteMaskBlob], 'white-mask.jpg', { type: 'image/jpeg' });
        setMaskImageFile(whiteMaskFile);
        setMaskImage(whiteMaskDataUrl);
        // downloadImage(whiteMaskFile, 'white-mask.jpg');
      }
    };
    let inputImageUrl = URL.createObjectURL(imageFile);
    img.src = inputImageUrl;

    // downloadImage(file, 'mask.jpg');

    // setMaskImageFile(file);
    // setMaskImage(dataUrl);
    toggleMotionEdit();
    setAgentInputComponent('templates');
  };

  // Helper function to download an image
  const downloadImage = (file: File, filename: string) => {
    // Create a URL for the file
    let url = URL.createObjectURL(file);

    // Create a temporary download link
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Append the link to the body
    document.body.appendChild(a);

    // Programmatically click the link to start the download
    a.click();

    // Clean up by removing the link
    document.body.removeChild(a);
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
            <MotionBrushSVG />
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
              Mask Brush
            </span>
            {/* <div
              style={{
                border: 'none',
                backgroundColor: 'rgba(14,14,14,1)',
                fontSize: '11.5px',
                fontWeight: '500',
                textTransform: 'uppercase',
                color: 'rgba(244,173,255,1)',
                minWidth: '61px',
                height: '25px',
                width: '61px',
                cursor: 'pointer',
                display: 'flex',
                boxSizing: 'border-box',
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: 'auto',
                marginLeft: '3.5px',
                borderRadius: '8px',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
              }}
            >
              Beta
            </div> */}
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
              toggleMotionEdit();
              // setProductMaskDescription('');
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

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
        Don't see what you expect? Describe the product
        <TextArea
          style={{
            width: '50%',
            height: 'auto',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(58,58,58,1)',
            color: 'white',
            marginLeft: 'auto',
          }}
          autoFocus
          onChange={(e) => setProductMaskDescription(e?.target.value)}
          showCount={false}
          size="small"
          value={productMaskDescription}
          className="textarea"
          type={'pure'}
          autoSize={{ minRows: 1, maxRows: 1 }}
        />
        <button
          onClick={() => handleCreateMask(imageFile)}
          disabled={productMaskDescription ? false : true}
          style={{
            border: '1px solid #2a2a2a',
            backgroundColor: productMaskDescription ? 'white' : 'rgba(31,31,31,1)',
            fontSize: '14px',
            fontWeight: '500',
            color: productMaskDescription ? 'black' : 'rgba(192,192,192,1)',
            cursor: productMaskDescription ? 'pointer' : 'not-allowed',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            borderRadius: '8px',
            borderColor: 'rgba(42,42,42,1)',
            padding: '8px',
            gap: '10px',
            marginLeft: 20,
          }}
        >
          {isMaskLoading ? 'Loading..' : 'Regenerate Mask'}
        </button>
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
          {!isCustomMode ? (
            <>
              <div
                style={{
                  backgroundColor: 'rgba(58,58,58,1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: '2px',
                  height: '33px',
                  boxSizing: 'border-box',
                  paddingLeft: '26.5px',
                  paddingRight: '26px',
                  borderRadius: '8px',
                }}
                onClick={() => setIsCustomMode(true)}
              >
                <BrushSVG />
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '500',
                    color: 'rgba(192,192,192,1)',
                    textAlign: 'center',
                    whiteSpace: 'pre-wrap',
                    flexGrow: '0',
                    flexShrink: '0',
                    flexBasis: 'auto',
                    margin: '0',
                    cursor: 'pointer',
                  }}
                >
                  Custom
                </span>
              </div>
              {/* <div
                            style={{
                                backgroundColor: "rgba(58,58,58,1)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                gap: "2px",
                                height: "33px",
                                boxSizing: "border-box",
                                paddingLeft: "26.5px",
                                paddingRight: "26px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                margin: "0 8px"
                            }}
                        >
                            <BgImageSVG />
                            <p
                                style={{
                                    fontSize: "11.5px",
                                    fontWeight: "500",
                                    color: "rgba(192,192,192,1)",
                                    textAlign: "center",
                                    whiteSpace: "pre-wrap",
                                    flexGrow: "0",
                                    flexShrink: "0",
                                    flexBasis: "auto",
                                    margin: "0",
                                }}
                            >
                                Background
                            </p>
                        </div>
                        <div
                            style={{
                                backgroundColor: "rgba(58,58,58,1)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                gap: "2px",
                                height: "33px",
                                boxSizing: "border-box",
                                paddingLeft: "26.5px",
                                paddingRight: "26px",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            <ForegroundImageSVG />
                            <p
                                style={{
                                    fontSize: "11.5px",
                                    fontWeight: "500",
                                    color: "rgba(192,192,192,1)",
                                    textAlign: "center",
                                    whiteSpace: "pre-wrap",
                                    flexGrow: "0",
                                    flexShrink: "0",
                                    flexBasis: "auto",
                                    margin: "0",
                                }}
                            >
                                Foreground
                            </p>
                        </div> */}
            </>
          ) : (
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
          )}
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
              // setProductMaskDescription('');
              toggleMotionEdit();
              setIsMaskLoading(false);
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
            >
              Cancel
            </span>
          </div>
          <div
            style={{
              backgroundColor: isMaskLoading ? '#3a3a3a' : 'white',
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
              cursor: isMaskLoading ? 'not-allowed' : 'pointer',
              // pointerEvents: isMaskLoading ? 'none' : 'auto',
              minWidth: '65px',
            }}
            onClick={saveMaskImageCopy}
          >
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '500',
                color: isMaskLoading ? '#9998a3' : 'black',
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
