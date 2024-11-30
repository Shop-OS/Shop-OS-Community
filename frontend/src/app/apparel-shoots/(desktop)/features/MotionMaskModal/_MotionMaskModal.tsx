import {
  CloseOutlined,
  EditOutlined,
  FileImageOutlined,
  FormatPainterOutlined,
  RedoOutlined,
  ScanOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { TextArea } from '@lobehub/ui';
import { Slider } from 'antd';
import { fabric } from 'fabric';
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

import '../../../../globals.css';

export default function MotionMaskModal({
  isMaskLoading,
  imageFile,
  productMaskDescription,
  setAgentInputComponent,
  previewImage,
  toggleMotionEdit,
  maskImage,
  setMaskImage,
  setMaskImageFile,
  setProductMaskDescription,
  handleCreateMask,
}: any) {
  const containerRef = useRef(null);
  const canvasRef1 = useRef<any>(null);
  const canvasRef2 = useRef<any>(null);
  const canvasCursorRef = useRef<any>(null);
  const [isCustomMode, setIsCustomMode] = React.useState(false);
  const [isEraserMode, setIsEraserMode] = React.useState(false);

  const [brushSize, setBrushSize] = useState(10);

  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const onBrashChange = (newValue: number) => {
    setBrushSize(newValue);
  };

  const imageCanvasRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const cursorRef = useRef<any>(null);
  const mouseCursorRef = useRef<any>(null);
  let currentPath = null;

  //jsdemo
  useEffect(() => {
    let container: any = containerRef.current;
    let imageCanvas = new fabric.StaticCanvas('imageCanvas');
    let canvas = new fabric.Canvas('draw', {
      isDrawingMode: true,
      freeDrawingCursor: 'none',
    });

    let cursor = new fabric.StaticCanvas('cursor');

    fabric.Image.fromURL(previewImage, function (img: any) {
      const scaleFactor = 0.5; // Adjust this value to change the size of the image

      img.scale(scaleFactor);

      imageCanvas.setWidth(img.getScaledWidth());
      imageCanvas.setHeight(img.getScaledHeight());
      cursor.setWidth(img.getScaledWidth());
      cursor.setHeight(img.getScaledHeight());
      canvas.setWidth(img.getScaledWidth());
      canvas.setHeight(img.getScaledHeight());

      img.set({
        left: img.getScaledWidth() / 2,
        top: img.getScaledHeight() / 2,
      });

      imageCanvas.add(img);
      imageCanvas.centerObject(img);
      imageCanvas.renderAll();
    });

    // Create a temporary canvas and context
    let tempCanvas = document.createElement('canvas');
    let tempCtx: any = tempCanvas.getContext('2d');

    fabric.Image.fromURL(maskImage, function (img: any) {
      const scaleFactor = 0.5; // Adjust this value to change the size of the image

      img.scale(scaleFactor);

      // Set the temporary canvas size to match the image size
      tempCanvas.width = img.getScaledWidth();
      tempCanvas.height = img.getScaledHeight();

      // Draw the image onto the temporary canvas
      tempCtx.drawImage(img.getElement(), 0, 0, tempCanvas.width, tempCanvas.height);

      // Get the image data from the temporary canvas
      let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      let data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        // If white, make transparent
        if (red === 255 && green === 255 && blue === 255) {
          data[i + 3] = 0;
        }

        if (red === 0 && green === 0 && blue === 0) {
          data[i] = 128; // Red
          data[i + 1] = 0; // Green
          data[i + 2] = 128; // Blue
          data[i + 3] = 128; // Alpha
        }
      }

      // Put the modified image data back onto the temporary canvas
      tempCtx.putImageData(imageData, 0, 0);
      // Create a new image from the temporary canvas
      fabric.Image.fromURL(tempCanvas.toDataURL(), function (newImg: any) {
        newImg.set({
          left: newImg.getScaledWidth() / 2,
          top: newImg.getScaledHeight() / 2,
          lockMovementX: true,
          lockMovementY: true,
        });

        canvas.add(newImg);
        canvas.centerObject(newImg);
        canvas.renderAll();
      });
    });

    canvas.freeDrawingBrush.width = brushSize;
    canvas.freeDrawingBrush.color = 'rgba(128,0,128,0.5)';

    let mouseCursor: any = new fabric.Circle({
      left: -100,
      top: -100,
      radius: canvas.freeDrawingBrush.width / 2,
      fill: `rgba(255,255,255,1)`,
      stroke: 'black',
      originX: 'center',
      originY: 'center',
    });

    cursor.add(mouseCursor);
    mouseCursorRef.current = mouseCursor;
    canvasRef.current = canvas;
    cursorRef.current = cursor;

    canvasRef.current.on('mouse:move', function (evt: any) {
      const mouse = canvasRef.current.getPointer(evt.e);
      mouseCursorRef.current
        .set({
          top: mouse.y,
          left: mouse.x,
          fill: isEraserMode ? 'rgba(0,0,0,0)' : 'rgba(255,0,255,1)',
        })
        .setCoords()
        .canvas.renderAll();
    });

    canvasRef.current.on('mouse:out', function () {
      mouseCursorRef.current
        .set({
          top: mouseCursor.originalState.top,
          left: mouseCursor.originalState.left,
        })
        .setCoords()
        .canvas.renderAll();
    });
    canvasRef.current.on('after:render', () => {
      canvasRef.current = canvas;
    });
    cursorRef.current.on('after:render', () => {
      cursorRef.current = cursor;
    });
    canvasRef.current.on('path:created', handlePathCreated);

    canvasRef.current = canvas;
    cursorRef.current = cursor;
    mouseCursorRef.current = mouseCursor;

    // return () => {
    //     canvasRef.current.off('path:created');
    //     canvasRef.current.off('mouse:move');
    //     canvasRef.current.off('mouse:out');
    //     canvasRef.current.off('mouse:down');
    // }
  }, [maskImage]);
  useEffect(() => {
    if (canvasRef.current) {
      // Add the event listener when the component mounts or when isEraserMode changes
      canvasRef.current.on('path:created', handlePathCreated);
    }

    if (isEraserMode) {
      canvasRef.current.freeDrawingBrush.color = 'rgba(0,0,0,0)';
      canvasRef.current.renderAll();
    } else {
      canvasRef.current.freeDrawingBrush.color = 'rgba(128,0,128,0.5)';
      canvasRef.current.renderAll();
    }

    return () => {
      canvasRef.current.off('path:created', handlePathCreated);
    };
  }, [isEraserMode, canvasRef.current]);

  function handlePathCreated(opt: any) {
    if (isEraserMode) {
      opt.path.globalCompositeOperation = 'destination-out';
      opt.path.stroke = 'rgba(0,0,0,1)';
      canvasRef.current.freeDrawingBrush.color = 'rgba(0,0,0,0)';
      canvasRef.current.renderAll();
      // mouseCursorRef.current
      //     .set({
      //         stroke: 'rgba(0,0,0,1)',
      //         fill: 'rgba(0,0,0,1)',
      //     }).setCoords().canvas.renderAll();
      // mouseCursorRef.current.renderAll();
      // mouseCursorRef.current.canvas.renderAll();
    } else {
      if (opt.path.stroke && opt.path.stroke !== 'rgba(128,0,128,0.5)') {
        opt.path.globalCompositeOperation = 'source-over';
        opt.path.stroke = 'rgba(128,0,128,0.5)';
        canvasRef.current.freeDrawingBrush.color = 'rgba(128,0,128,0.5)';
        canvasRef.current.renderAll();
      }
      // mouseCursorRef.current
      //     .set({
      //         fill: 'rgba(255,0,0,1)',
      //     }).setCoords().canvas.renderAll();
      // mouseCursorRef.current.renderAll();
      // mouseCursorRef.current.canvas.renderAll();
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.freeDrawingBrush.width = brushSize;
      mouseCursorRef.current
        .set({
          radius: brushSize / 2,
        })
        .setCoords()
        .canvas.renderAll();
    }
  }, [brushSize]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.isDrawingMode = isCustomMode;
      canvasRef.current.selection = false; // disable selection when isCustomMode is false
      canvasRef.current.forEachObject(function (object: any) {
        object.selectable = false;
      });
      canvasRef.current.allowTouchScrolling = false; // disable panning
      canvasRef.current.interactive = false;
      if (mouseCursorRef.current) {
        mouseCursorRef.current.visible = isCustomMode; // hide the cursor when isCustomMode is false
        mouseCursorRef.current.canvas.renderAll();
      }
      canvasRef.current.freeDrawingCursor = isEraserMode ? 'default' : 'none';
      canvasRef.current.renderAll();
    }
  }, [isCustomMode]);

  const saveMaskImage = () => {
    // canvasRef.current.renderAll();
    let tempCanvas = document.createElement('canvas');
    let tempCtx: any = tempCanvas.getContext('2d');

    fabric.Image.fromURL(canvasRef.current.toDataURL(), function (img: any) {
      // Set the temporary canvas size to match the image size
      const scaleFactor = 2; // Adjust this value to change the size of the image

      img.scale(scaleFactor);
      tempCanvas.width = img.getScaledWidth();
      tempCanvas.height = img.getScaledHeight();

      // Draw the image onto the temporary canvas
      tempCtx.drawImage(img.getElement(), 0, 0, tempCanvas.width, tempCanvas.height);

      // Get the image data from the temporary canvas
      let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
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

      // Put the modified image data back onto the temporary canvas
      tempCtx.putImageData(imageData, 0, 0);
      let dataUrl = tempCanvas.toDataURL('image/png');

      // Convert the data URL to a Blob
      let blob = dataURLToBlob(dataUrl);

      // Create a File object from the Blob
      let file = new File([blob], 'filename.png', { type: 'image/png' });

      setMaskImageFile(file);
      setMaskImage(dataUrl);
      toggleMotionEdit();
      setAgentInputComponent('templates');
    });
  };

  const saveMaskImageOld = () => {
    const canvas2: any = canvasRef.current;
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
    setAgentInputComponent('templates');
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

      <div id="cont" ref={containerRef}>
        <canvas id="imageCanvas" ref={imageCanvasRef} />
        <canvas id="draw" />
        <canvas id="cursor" ref={cursorRef} />
      </div>
      {/* <div ref={containerRef}
                style={{
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center",
                    width: '100%',
                    height: '400px',
                    maxHeight: "400px",
                    position: 'relative'
                }}> */}
      {/* <canvas id="myCanvas" style={{ position: 'absolute', zIndex: '0' }}></canvas>
                <canvas id="draw" ref={canvasRef} style={{ position: 'absolute', zIndex: '1' }} />
                <canvas id="cursor" ref={cursorRef} style={{ position: 'absolute', zIndex: '2', top: 0 }} /> */}
      {/* <canvas ref={canvasRef1} style={{ position: 'absolute', zIndex: '1' }}></canvas> */}
      {/* <canvas
                    ref={canvasRef2} style={{
                        position: 'absolute', zIndex: '2', opacity: '0.5',
                        cursor: isCustomMode ? (isEraserMode ? 'url("cursor/eraser.cur"), auto' : 'url("cursor/pencil1.cur"), auto') : 'default'
                    }}
                    onMouseDown={isCustomMode ? handleMouseDown : (e: any) => { e.preventDefault(); }}
                    onMouseUp={isCustomMode ? handleMouseUp : (e: any) => { e.preventDefault(); }}
                    onMouseOut={isCustomMode ? handleMouseUp : (e: any) => { e.preventDefault(); }}
                    onMouseMove={isCustomMode ? handleMouseMove : (e: any) => { e.preventDefault(); }}
                ></canvas> */}
      {/* <canvas id={"draw"} ref={canvasRef2}></canvas> */}
      {/* <canvas ref={canvasCursorRef}></canvas> */}
      {/* <canvas id={"draw"} ref={canvasRef} style={{ position: 'absolute', zIndex: '1', pointerEvents: "none" }}></canvas>
                <canvas id={"cursor"} ref={cursorRef} style={{ position: 'absolute', zIndex: '2' }}></canvas> */}
      {/* </div> */}

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
        Don't see what you expect? Describe the product
        <TextArea
          style={{
            marginLeft: 20,
            width: '50%',
            height: 'auto',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(58,58,58,1)',
            color: 'white',
          }}
          autoFocus
          onChange={(e) => setProductMaskDescription?.(e?.target.value)}
          showCount={false}
          size="small"
          value={productMaskDescription}
          className="textarea"
          type={'pure'}
          autoSize={{ minRows: 1, maxRows: 1 }}
        />
        <button
          onClick={() => handleCreateMask(imageFile)}
          style={{
            border: '1px solid #2a2a2a',
            backgroundColor: 'rgba(31,31,31,1)',
            fontSize: '14px',
            fontWeight: '500',
            color: 'rgba(152,148,148,1)',
            cursor: 'pointer',
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
                <p
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
                </p>
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
                  max={50}
                  onChange={onBrashChange}
                  step={2}
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
            onClick={saveMaskImage}
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
              Save
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
