import { DeleteFilled, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { fabric } from 'fabric';
import { BringToFront, SendToBack } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import {
  addBlackFilter,
  copyElement,
  createCanvasMask,
  createCanvasMask2,
  createFocusImage,
  createTransparentMask,
  createTransparentMask2,
  handleCopy,
  handlePaste,
  moveBackward,
  moveForward,
  redoFunction,
  removeObject,
  takeCanvasScreenshot,
  takeCanvasScreenshot2,
  undoFunction,
} from './canvasEditorFabricHelpers';

const CanvasEditorFabric = ({
  imageFile,
  templatefiles,
  setCanvasData,
  fabricRef,
  elementsRef,
  setElementRemovalCount,
  setImageFile,
  canvasProductImageRef,
  isOutputGenerating,
}: any) => {
  const canvasRef: any = useRef<any>('');
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [undo, setUndo] = useState([]);
  const [redo, setRedo] = useState([]);

  // Inside your component
  const undoFn = () => {
    undoFunction(fabricRef.current, undo, redo, setUndo, setRedo);
  };

  const redoFn = () => {
    redoFunction(fabricRef.current, undo, redo, setUndo, setRedo);
  };

  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#1f1f1f',
      height: 490,
      width: 490,
      preserveObjectStacking: true,
    });

    fabricRef.current?.renderAll();

    const disposeFabric = () => {
      fabricRef.current.dispose();
    };
    // addRectangle();
    setIsLoading(true);

    return () => {
      disposeFabric();
    };
  }, []);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.interactive = !isOutputGenerating;
      fabricRef.current.forEachObject((object: any) => {
        object.selectable = !isOutputGenerating;
        object.evented = !isOutputGenerating;
      });
      fabricRef.current.renderAll();
    }
  }, [isOutputGenerating]);

  useEffect(() => {
    if (!templatefiles) return;
    fabric.Image.fromURL(templatefiles.image, (img) => {
      const objects = fabricRef.current.getObjects();
      const lastObjectWithName = objects
        .reverse()
        .find((object: any) => object.name === templatefiles.prompt);
      if (lastObjectWithName) {
        img.set({ left: lastObjectWithName.left + 10, top: lastObjectWithName.top + 10 });
      } else {
        img.set({ left: 50, top: 50 });
      }
      img.set('name', templatefiles.prompt);

      fabricRef.current.add(img);
      fabricRef.current.renderAll();
    });
  }, [templatefiles]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      const canvas = fabricRef.current;

      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        handleCopy(canvas);
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        handlePaste(canvas, elementsRef);
      }

      if (event.key === 'Delete') {
        removeObject(canvas, elementsRef, setElementRemovalCount, canvasProductImageRef);
      }

      if (event.ctrlKey && event.key === 'd') {
        copyElement(fabricRef.current, elementsRef, setElementRemovalCount);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [elementsRef, setElementRemovalCount]);

  const uploadImage = (canvas: any, file: File) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      fabric.Image.fromURL((event.target as any).result, function (img) {
        // Determine the maximum size
        const maxSize = 300;

        // Check if the image's width or height exceeds the maximum size
        if (img.width && img.height && (img.width > maxSize || img.height > maxSize)) {
          // Calculate the scaling factor
          const scaleFactor = maxSize / Math.max(img.width, img.height);

          // Scale the image
          img.scale(scaleFactor);
        }

        // Set the image's dimensions and position
        img.set({
          left: 10,
          top: 10,
          angle: 0,
        });

        // Add custom property to the image
        img.set('name', 'productImage');

        // Add the image to the canvas
        canvas.add(img);
        canvasProductImageRef.current = img;
        canvas.renderAll();
      });
    };

    reader.readAsDataURL(file);
  };

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    (fileInputRef.current as any).click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setImageFile(file);
    uploadImage(fabricRef.current, file);
  };

  useEffect(() => {
    if (imageFile) {
      let imgEl = document.createElement('img');
      imgEl.onload = function () {
        let img = new fabric.Image(imgEl);

        const maxSize = 300;

        // Check if the image's width or height exceeds the maximum size
        if (img.width && img.height && (img.width > maxSize || img.height > maxSize)) {
          // Calculate the scaling factor
          const scaleFactor = maxSize / Math.max(img.width, img.height);

          // Scale the image
          img.scale(scaleFactor);
        }
        // Scale the image to fit the canvas
        // img.scaleToWidth(fabricRef.current?.width ?? 0);
        // img.scaleToHeight(fabricRef.current?.height ?? 0);

        // Set the image's position to the top-left corner
        img.set({ left: 10, top: 10 });

        // Enable controls
        img.set({
          selectable: true,
          hasControls: true,
          hasBorders: true,
          lockRotation: false,
          lockScalingX: false,
          lockScalingY: false,
          lockMovementX: false,
          lockMovementY: false,
        });

        // Add custom property to the image
        img.set('name', 'productImage');

        // Add the image to the canvas
        fabricRef.current?.add(img);
        canvasProductImageRef.current = img;

        // Re-render the canvas
        fabricRef.current?.renderAll();
      };
      imgEl.onerror = function () {
        console.error('Failed to load image');
      };

      if (typeof imageFile === 'string') {
        imgEl.src = imageFile;
      } else if (imageFile instanceof File) {
        let reader = new FileReader();
        reader.onloadend = function () {
          imgEl.src = reader.result as string;
        };
        reader.onerror = function () {
          console.error('Failed to read file');
        };
        reader.readAsDataURL(imageFile);
      } else {
        console.error('Unsupported imageFile type', typeof imageFile);
      }
    } else {
      const img = fabricRef.current
        ?.getObjects()
        .find((obj: any) => obj.get('name') === 'productImage');
      if (img) {
        fabricRef.current?.remove(img);
        canvasProductImageRef.current = null;
        fabricRef.current?.renderAll();
      }
    }
  }, [imageFile]);

  useEffect(() => {
    const canvas = fabricRef.current;
    const upperCanvas = document.querySelector('.upper-canvas');

    const handleKeyDown = (event: any) => {
      if (event.target !== canvas.getElement() && event.target !== upperCanvas) {
        // If not, deselect all active objects
        canvas.discardActiveObject();
        // Render the canvas
        canvas.renderAll();
      }
    }

    // Add a click event listener to the document
    document.addEventListener('click', handleKeyDown);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div
        id="fabricToCanvasData"
        onClick={() => {
          setCanvasData.current = fabricRef.current?.toDataURL({ format: 'png' });
        }}
        style={{ display: 'none', pointerEvents: 'none' }}
      ></div>
      <div
        style={
          isOutputGenerating
            ? {
              borderRadius: '10px',
              overflow: 'clip',
              position: 'relative',
              pointerEvents: 'none',
              cursor: 'not-allowed',
            }
            : { borderRadius: '10px', overflow: 'clip', position: 'relative' }
        }
      >
        <canvas ref={canvasRef} style={{ borderRadius: '10px' }} />

        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            padding: '4px',
            borderRadius: '5px',
          }}
        >
          <div style={{ backgroundColor: 'black', borderRadius: '5px' }}>
            <Tooltip placement="right" title={'Forward'}>
              <div
                style={{
                  color: '#8e8a8a',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: '8px',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  moveForward(fabricRef.current);
                }}
              >
                <BringToFront size={18} />
              </div>
            </Tooltip>
            <Tooltip placement="right" title={'Backward'}>
              <div
                style={{
                  color: '#8e8a8a',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: '8px',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  moveBackward(fabricRef.current);
                }}
              >
                <SendToBack size={18} />
              </div>
            </Tooltip>
            <Tooltip placement="right" title={'Remove'}>
              <div
                style={{
                  color: '#8e8a8a',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: '8px',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  removeObject(
                    fabricRef.current,
                    elementsRef,
                    setElementRemovalCount,
                    canvasProductImageRef,
                  );
                }}
              >
                <DeleteOutlined />
              </div>
            </Tooltip>
            <Tooltip placement="right" title={'Upload'}>
              <div
                style={{
                  color: '#8e8a8a',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: '8px',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  handleUploadClick();
                }}
              >
                <UploadOutlined size={18} />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      <div
        style={{ width: '100%', display: 'flex', bottom: '0px', justifyContent: ' space-around' }}
      >
        {' '}
        {/* <button onClick={() => moveForward(fabricRef.current)}>bring forward</button>{' '}
        <button
          onClick={() => {
            moveBackward(fabricRef.current);
          }}
        >
          bring backward
        </button> */}
      </div>
      {/* <button
        onClick={async () => {
          // await createCanvasMask(fabricRef.current);
          // await takeCanvasScreenshot(fabricRef.current);
          await createTransparentMask(fabricRef.current);
        }}
      >
        Screenshot
      </button>
      <button
        onClick={async () => {
          await createCanvasMask2(fabricRef.current);
          await takeCanvasScreenshot2(fabricRef.current);
          await createTransparentMask2(fabricRef.current);
        }}
      >
        Screenshot
      </button> */}
      {/* 
      <button
        onClick={() => {
          addBlackFilter(fabricRef.current);
        }}
      >
        Black filter
      </button> */}
      {/* <button
        onClick={() => {
          removeObject(fabricRef.current);
        }}
      >
        Remove
      </button> */}
    </>
  );
};

export default CanvasEditorFabric;
