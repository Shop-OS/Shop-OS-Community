import {
  CloseOutlined,
  EditOutlined,
  FileImageOutlined,
  FormatPainterOutlined,
  RedoOutlined,
  ScanOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Slider } from 'antd';
import axios from 'axios';
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
import AxiosProvider from '@/utils/axios';

import bg_rem_workflow from './workflow/workflow_api_product_mask_to_rem_bg_1_1.json';

export default function MotionMaskModal({
  setProductMaskDescription,
  setCanvasImageFile,
  previewImage,
  previewImageFile,
  toggleMotionEdit,
  maskImage,
  setMaskImage,
  setMaskImageFile,
}: any) {
  const containerRef = useRef(null);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const [isCustomMode, setIsCustomMode] = React.useState(false);
  const [isEraserMode, setIsEraserMode] = React.useState(false);
  const [isRemovedBgLoading, setIsRemovedBgLoading] = React.useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const removedBgFileNameRef = useRef<string>('');
  const originalBgFileNameRef = useRef<string>('');
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [removedBgImageShouldFetch, setRemovedBgImageShouldFetch] = useState(false);
  const fetchQueueRef = useRef<string[]>([]);

  const handleMouseDown = (e: any) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setLastPos({ x: offsetX, y: offsetY });
    setDrawing(true);
  };

  const onBrashChange = (newValue: number) => {
    setBrushSize(newValue);
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
      img2.src = maskImage; // replace with your mask image path
      // img2.src = 'http://172.188.64.75:5000/file?filename=q05f4ksqr192p57zimqp6g_00001'; // replace with your mask image path
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
        if (red === 0 && green === 0 && blue === 0) {
          data[i] = 128; // Red
          data[i + 1] = 0; // Green
          data[i + 2] = 128; // Blue
          data[i + 3] = 255; // Alpha
        }
      }
      ctx2.putImageData(imageData, 0, 0);
    };
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  const handleRemoveBg = async () => {
    try {
      const canvas2: any = canvasRef2.current;
      const ctx2 = canvas2.getContext('2d');

      // Get the image data from the canvas
      let imageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
      let data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // If the pixel is transparent, make it white
        if (data[i + 3] === 0) {
          data[i] = 255; // Red
          data[i + 1] = 255; // Green
          data[i + 2] = 255; // Blue
          data[i + 3] = 255; // Alpha
        }
        // If the pixel is purple, make it black
        else if (data[i] >= 125 && data[i + 2] >= 125) {
          data[i] = 0; // Red
          data[i + 1] = 0; // Green
          data[i + 2] = 0; // Blue
          data[i + 3] = 255; // Blue
        }
      }

      // Put the modified image data back on the canvas
      // ctx2.putImageData(imageData, 0, 0);

      // let dataUrl = canvas2.toDataURL("image/png");
      let tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas2.width;
      tempCanvas.height = canvas2.height;
      let tempCtx: any = tempCanvas.getContext('2d');
      tempCtx.putImageData(imageData, 0, 0);
      let dataUrl = tempCanvas.toDataURL('image/png');

      // Convert the data URL to a Blob
      let blob = dataURLToBlob(dataUrl);

      // Create a File object from the Blob
      let file = new File([blob], 'filename.png', { type: 'image/png' });

      setIsRemovedBgLoading(true);
      const formData = new FormData();
      const randomName1 =
        Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
      const newFile1 = new File([file as File], randomName1 + '_mask', {
        type: (file as File)?.type ?? 'image/jpeg',
      });

      formData.append('image', newFile1);
      removedBgFileNameRef.current = randomName1 + '_mask';
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const ogFormData = new FormData();
      const originalImageFile = new File([previewImageFile as File], randomName1 + '_og', {
        type: (previewImageFile as File)?.type ?? 'image/jpeg',
      });

      ogFormData.append('image', originalImageFile);
      originalBgFileNameRef.current = randomName1 + '_og';
      await axios.post(`${process.env.NEXT_PUBLIC_COMFY_API_URL}/upload-image`, ogFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      bg_rem_workflow['5']['inputs']['image'] =
        '../input/' + originalBgFileNameRef.current + '.jpg';
      bg_rem_workflow['167']['inputs']['image'] =
        '../input/' + removedBgFileNameRef.current + '.jpg';
      bg_rem_workflow['45']['inputs']['filename_prefix'] = randomName1 ?? '';

      const response = await AxiosProvider.post(`/prompt`, { prompt: bg_rem_workflow },);

      if (response.status === 200) {
        try {
          setRemovedBgImageShouldFetch(true);
          for (let i = 1; i < 2; i++) {
            fetchQueueRef.current.push(randomName1 + '_0000' + i);
          }
        } catch (error) {
          setRemovedBgImageShouldFetch(false);
          console.error('Error:', error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchImageByFileName = async (url: string, imageFileName: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      if (response.status === 204) {
        return;
      } else if (response.status === 200) {
        fetchQueueRef.current = fetchQueueRef.current.filter(
          (filename) => filename !== imageFileName,
        );

        const blob = new Blob([response.data], { type: 'image/png' });
        const objectURL = URL.createObjectURL(blob);

        const file = new File([blob], 'maskImage', { type: 'image/png' });
        setCanvasImageFile(file);
        setRemovedBgImageShouldFetch(false);
        toggleMotionEdit();
        setIsRemovedBgLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setRemovedBgImageShouldFetch(false);
    }
  };

  useEffect(() => {
    if (fetchQueueRef.current.length === 0 || removedBgImageShouldFetch === false) return;
    const intervalId = setInterval(() => {
      if (fetchQueueRef.current.length === 0) {
        setRemovedBgImageShouldFetch(false);
        clearInterval(intervalId);
        return;
      }
      fetchQueueRef.current.forEach((filename) => {
        fetchImageByFileName(
          `${process.env.NEXT_PUBLIC_COMFY_API_URL}/file?filename=${filename}`,
          filename,
        );
      });
    }, 3_000);

    return () => clearInterval(intervalId);
  }, [removedBgImageShouldFetch]);

  const saveMaskImage = () => {
    const canvas2: any = canvasRef2.current;
    const ctx2 = canvas2.getContext('2d');

    // Get the image data from the canvas
    let imageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // If the pixel is transparent, make it white
      if (data[i + 3] === 0) {
        data[i] = 255; // Red
        data[i + 1] = 255; // Green
        data[i + 2] = 255; // Blue
        data[i + 3] = 255; // Alpha
      }
      // If the pixel is purple, make it black
      else if (data[i] >= 125 && data[i + 2] >= 125) {
        data[i] = 0; // Red
        data[i + 1] = 0; // Green
        data[i + 2] = 0; // Blue
        data[i + 3] = 255; // Blue
      }
    }

    // Put the modified image data back on the canvas
    // ctx2.putImageData(imageData, 0, 0);

    // let dataUrl = canvas2.toDataURL("image/png");
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas2.width;
    tempCanvas.height = canvas2.height;
    let tempCtx: any = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);
    let dataUrl = tempCanvas.toDataURL('image/png');

    // Convert the data URL to a Blob
    let blob = dataURLToBlob(dataUrl);

    // Create a File object from the Blob
    let file = new File([blob], 'filename.png', { type: 'image/png' });

    setMaskImageFile(file);
    setMaskImage(dataUrl);
    toggleMotionEdit();
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
            <div
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
            </div>
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
            onClick={toggleMotionEdit}
          >
            <CloseOutlined color="white" />
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
          height: '400px',
          maxHeight: '400px',
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
                ? 'url("cursor/circle.cur"), auto'
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
          marginTop: '2.25px',
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
              borderRadius: '8px',
              boxSizing: 'border-box',
            }}
            onClick={toggleMotionEdit}
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
              borderRadius: '8px',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
            onClick={handleRemoveBg}
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
              {isRemovedBgLoading ? 'Loading...' : 'Remove Background'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
