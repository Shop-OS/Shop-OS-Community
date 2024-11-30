import { fabric } from 'fabric';

export const downloadImage = (canvas: any, filename: string, scaleFactor: number = 2) => {
  // Save the current dimensions of the canvas
  const originalWidth = canvas.getWidth();
  const originalHeight = canvas.getHeight();

  // Increase the size of the canvas for a higher resolution screenshot
  canvas.setWidth(originalWidth * scaleFactor);
  canvas.setHeight(originalHeight * scaleFactor);
  canvas.setZoom(scaleFactor);
  canvas.renderAll();

  // Create a data URL of the canvas
  const dataUrl = canvas.toDataURL({
    format: 'png',
    quality: 1,
  });

  // Create a new anchor element
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;

  // Append the anchor element to the body
  document.body.appendChild(link);

  // Simulate a click on the anchor element
  link.click();

  // Remove the anchor element from the body
  document.body.removeChild(link);

  // Restore the original dimensions and scale of the canvas
  canvas.setWidth(originalWidth);
  canvas.setHeight(originalHeight);
  canvas.setZoom(1);
  canvas.renderAll();
};

export const getFile = async (canvas: any, filename: string, scaleFactor: number = 2) => {
  // Save the current dimensions of the canvas
  // const originalWidth = canvas.getWidth();
  // const originalHeight = canvas.getHeight();

  // // Increase the size of the canvas for a higher resolution screenshot
  // canvas.setWidth(originalWidth * scaleFactor);
  // canvas.setHeight(originalHeight * scaleFactor);
  // canvas.setZoom(scaleFactor);
  // canvas.renderAll();

  const tempCanvas = new fabric.StaticCanvas(null, {});
  tempCanvas.setWidth(canvas.getWidth());
  tempCanvas.setHeight(canvas.getHeight());
  canvas.getObjects().forEach((obj: any, index: any) => {
    obj.clone((cloned: any) => {
      tempCanvas.add(cloned);
    });
  });
  tempCanvas.setWidth(canvas.getWidth() * scaleFactor);
  tempCanvas.setHeight(canvas.getHeight() * scaleFactor);
  tempCanvas.setZoom(scaleFactor);
  tempCanvas.renderAll();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Create a data URL of the canvas
  const dataUrl = tempCanvas.toDataURL({
    format: 'jpg',
    quality: 1,
  });

  const response = await fetch(dataUrl);
  const blob = await response.blob();

  // Create a File object from the Blob
  const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

  tempCanvas.dispose();
  // Restore the original dimensions and scale of the canvas
  // canvas.setWidth(originalWidth);
  // canvas.setHeight(originalHeight);
  // canvas.setZoom(1);
  // canvas.renderAll();

  return file;
};

export const addBlackFilter = (canvas: any, whiteForegroudEnabled: boolean = true) => {
  canvas?.getObjects('image').forEach((image: any) => {
    if (image.name !== 'productImage') {
      const filter = new fabric.Image.filters.BlendColor({
        color: 'black',
        mode: 'multiply',
        alpha: 1,
      });
      image.filters.push(filter);
    } else {
      if (whiteForegroudEnabled) {
        const filter = new fabric.Image.filters.ColorMatrix({
          matrix: [
            1,
            1,
            1,
            1,
            0, // Red channel:   red + green + blue + alpha + brightness
            1,
            1,
            1,
            1,
            0, // Green channel: red + green + blue + alpha + brightness
            1,
            1,
            1,
            1,
            0, // Blue channel:  red + green + blue + alpha + brightness
            0,
            0,
            0,
            1,
            0,
          ], // Alpha channel: keep it the same
        });
        image.filters.push(filter);
      }
    }
    image.applyFilters();
  });

  // Change the background color to black
  canvas.setBackgroundColor('black', () => canvas.renderAll());
};

export const removeBlackFilter = (canvas: any, whiteForegroudEnabled: boolean = true) => {
  canvas?.getObjects('image').forEach((image: any) => {
    if (image.name !== 'productImage') {
      // Remove the filter
      image.filters = image.filters.filter(
        (filter: any) => !(filter instanceof fabric.Image.filters.BlendColor),
      );
    } else {
      if (whiteForegroudEnabled) {
        // Remove the filter
        image.filters = image.filters.filter(
          (filter: any) => !(filter instanceof fabric.Image.filters.ColorMatrix),
        );
      }
    }
    // Reapply the filters
    image.applyFilters();
    canvas.renderAll();
  });

  // Change the background color to default (white)
  canvas.setBackgroundColor('#1f1f1f', () => canvas.renderAll());
};

export const createCanvasMask = async (canvas: any) => {
  // Deselect all the canvas objects
  canvas.discardActiveObject().renderAll();

  // Add black filter
  addBlackFilter(canvas, true);

  // downloadImage(canvas, 'screenshot-black-and-white.png');
  const file = await getFile(canvas, 'screenshot-black-and-white.png');

  // Remove black filter
  removeBlackFilter(canvas, true);
  return file;
};

export const createFocusImage = async (canvas: any) => {
  // Deselect all the canvas objects
  canvas.discardActiveObject().renderAll();

  // Add black filter
  addBlackFilter(canvas, false);

  // downloadImage(canvas, 'screenshot-plain.png');
  const file = await getFile(canvas, 'screenshot-plain.png');

  // Remove black filter
  removeBlackFilter(canvas, false);
  return file;
};

export const takeCanvasScreenshot = async (canvas: any) => {
  const tempCanvas = new fabric.StaticCanvas(null, { backgroundColor: 'white' });
  tempCanvas.setWidth(canvas.getWidth());
  tempCanvas.setHeight(canvas.getHeight());
  canvas.getObjects().forEach((obj: any, index: any) => {
    obj.clone((cloned: any) => {
      tempCanvas.add(cloned);
    });
  });
  const file = await getFile(tempCanvas, 'canvas-screenshot.png');
  tempCanvas.dispose();
  return file;
};

const hideNonProductImages = (canvas: fabric.Canvas, productImage: fabric.Object) => {
  const originalVisibility = canvas.getObjects().map((obj) => ({
    object: obj,
    visible: obj.visible,
  }));

  const productImageIndex = canvas.getObjects().indexOf(productImage);
  canvas.getObjects().forEach((obj, index) => {
    obj.visible = obj === productImage || index > productImageIndex;
  });

  return originalVisibility;
};

const createMask = async (canvas: fabric.Canvas, productImage: fabric.Object) => {
  const tempCanvas = new fabric.StaticCanvas(null, { enableRetinaScaling: false });
  tempCanvas.setWidth(canvas.getWidth());
  tempCanvas.setHeight(canvas.getHeight());

  const productImageIndex = canvas.getObjects().indexOf(productImage);
  canvas.getObjects().forEach((obj, index) => {
    if (index > productImageIndex) {
      obj.clone((cloned: any) => {
        tempCanvas.add(cloned);
      });
    }
  });
  tempCanvas.renderAll();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mask = new Image();
  mask.src = tempCanvas.toDataURL();

  await new Promise((resolve) => {
    mask.onload = resolve;
  });

  const maskImage = new fabric.Image(mask);
  maskImage.globalCompositeOperation = 'destination-out';

  return { maskImage, tempCanvas };
};

export const createTransparentMask = async (canvas: fabric.Canvas) => {
  // Find the productImage and get its zIndex
  const productImage = canvas.getObjects().find((obj) => obj.name === 'productImage');
  const productImageIndex = canvas.getObjects().indexOf(productImage!);

  const originalVisibility = hideNonProductImages(canvas, productImage!);
  const originalBackgroundColor = canvas.backgroundColor;
  canvas.backgroundColor = '';

  const { maskImage, tempCanvas } = await createMask(canvas, productImage!);
  canvas.add(maskImage);
  canvas.renderAll();

  const file = await getFile(canvas, 'canvas-transparent-mask.png');

  originalVisibility.forEach(({ object, visible }) => {
    object.visible = visible;
  });
  canvas.backgroundColor = originalBackgroundColor;
  canvas.remove(maskImage);
  tempCanvas.dispose();
  canvas.renderAll();

  return file;
};

export const moveBackward = (canvas: any) => {
  const activeObject = canvas?.getActiveObject();

  if (activeObject) {
    canvas?.sendBackwards(activeObject);
    canvas?.renderAll();
  }
};

// Function to move the selected object forward
export const moveForward = (canvas: any) => {
  const activeObject = canvas?.getActiveObject();

  if (activeObject) {
    canvas?.bringForward(activeObject);
    canvas?.renderAll();
  }
};

// Function to remove the selected object
export const removeObject = (canvas: any) => {
  const activeObject = canvas?.getActiveObject();

  if (activeObject) {
    canvas?.remove(activeObject);
    canvas?.renderAll();
  }
};

export const undoFunction = (canvas: any, undo: any[], redo: any[], setUndo: any, setRedo: any) => {
  if (undo.length > 0) {
    setRedo([...redo, undo.pop()]);
    canvas.loadFromJSON(undo[undo.length - 1]);
  }
};

export const redoFunction = (canvas: any, undo: any[], redo: any[], setUndo: any, setRedo: any) => {
  if (redo.length > 0) {
    setUndo([...undo, redo.pop()]);
    canvas.loadFromJSON(undo[undo.length - 1]);
  }
};
