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
  const originalWidth = canvas.getWidth();
  const originalHeight = canvas.getHeight();

  // Increase the size of the canvas for a higher resolution screenshot
  canvas.setWidth(originalWidth * scaleFactor);
  canvas.setHeight(originalHeight * scaleFactor);
  canvas.setZoom(scaleFactor);
  canvas.renderAll();

  // Create a data URL of the canvas
  const dataUrl = canvas.toDataURL({
    format: 'jpg',
    quality: 1,
  });

  const response = await fetch(dataUrl);
  const blob = await response.blob();

  // Create a File object from the Blob
  const file = new File([blob], 'image.jpg', { type: 'image/jpg' });

  // Restore the original dimensions and scale of the canvas
  canvas.setWidth(originalWidth);
  canvas.setHeight(originalHeight);
  canvas.setZoom(1);
  canvas.renderAll();

  return file;
};

export const addBlackFilter = (canvas: any, whiteForegroudEnabled: boolean = true) => {
  canvas?.getObjects('image').forEach((image: any) => {
    if (image.name !== 'productImage') {
      const filter = new fabric.Image.filters.BlendColor({
        color: 'black',
        mode: 'overlay',
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

  const file = await getFile(canvas, 'screenshot-black-and-white.png');

  // Create a URL for the file
  const url = URL.createObjectURL(file);

  // Create a download link and click it
  const link = document.createElement('a');
  link.href = url;
  link.download = 'screenshot-black-and-white.png';
  document.body.appendChild(link);
  // link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Remove black filter
  removeBlackFilter(canvas, true);
  return file;
};

export const createCanvasMask2 = async (originalCanvas: any) => {
  // Deselect all the canvas objects
  originalCanvas.discardActiveObject().renderAll();
  const canvas = await copyCanvas(originalCanvas);

  // Add black filter
  addBlackFilter(canvas, true);

  const file = await getFileCopy(canvas, 'screenshot-black-and-white.png', 'black');
  // downloadImageFile(file, "b.png");
  // Remove black filter
  removeBlackFilter(canvas, true);
  return file;
};

export const createFocusImage = async (canvas: any) => {
  // Deselect all the canvas objects
  canvas.discardActiveObject().renderAll();

  // Add black filter
  addBlackFilter(canvas, false);

  const file = await getFile(canvas, 'screenshot-plain.png');

  // Remove black filter
  removeBlackFilter(canvas, false);
  return file;
};

export const takeCanvasScreenshot = async (canvas: any) => {
  // Save the current background color
  const originalBackgroundColor = canvas.backgroundColor;

  // Set the background color to white
  canvas.setBackgroundColor('white', () => canvas.renderAll());

  const file = await getFile(canvas, 'canvas-screenshot.png');

  // Create a new blob object from the file
  const blob = new Blob([file], { type: 'image/png' });

  // Create a URL for the blob object
  const url = URL.createObjectURL(blob);

  // Create a new anchor element
  const a = document.createElement('a');

  // Set the href of the anchor element to the blob URL
  a.href = url;

  // Set the download attribute of the anchor element to the desired file name
  a.download = 'canvas-screenshot.png';

  // Append the anchor element to the body
  document.body.appendChild(a);

  // Programmatically click the anchor element to start the download
  // a.click();

  // Remove the anchor element from the body
  document.body.removeChild(a);

  // Revoke the blob URL
  URL.revokeObjectURL(url);

  // Restore the original background color and dimensions
  canvas.setBackgroundColor(originalBackgroundColor, () => canvas.renderAll());
  return file;
};

export const takeCanvasScreenshot2 = async (canvas: any) => {
  // Save the current background color
  const originalBackgroundColor = canvas.backgroundColor;

  // Set the background color to white
  //old
  // canvas.setBackgroundColor('white', () => canvas.renderAll());
  // const file = await getFile(canvas, 'canvas-screenshot.png');

  //new
  const file = await getFileCopy(canvas, 'canvas-screenshot.png', 'white');
  // downloadImageFile(file);

  // Restore the original background color and dimensions
  // canvas.setBackgroundColor(originalBackgroundColor, () => canvas.renderAll());
  return file;
};

export const __createTransparentMask = async (canvas: fabric.Canvas) => {
  // Save the original visibility of all objects
  const originalVisibility = canvas.getObjects().map((obj) => ({
    object: obj,
    visible: obj.visible,
  }));
  const originalBackgroundColor = canvas.backgroundColor;

  // Find the productImage and get its zIndex
  const productImage = canvas.getObjects().find((obj) => obj.name === 'productImage');
  const productImageIndex = canvas.getObjects().indexOf(productImage!);

  // Hide all objects except the productImage and make the background transparent
  canvas.getObjects().forEach((obj, index) => {
    obj.visible = obj === productImage || index > productImageIndex;
  });

  canvas.backgroundColor = '';

  // Create a temporary canvas
  const tempCanvas = new fabric.StaticCanvas(null, { enableRetinaScaling: false });

  // Set the dimensions of the temporary canvas to match the original canvas
  tempCanvas.setWidth(canvas.getWidth());
  tempCanvas.setHeight(canvas.getHeight());

  // Draw all objects except the productImage on the temporary canvas
  originalVisibility.forEach(({ object, visible }) => {
    if (visible && object.name !== 'productImage') {
      object.clone((cloned: any) => {
        tempCanvas.add(cloned);
        tempCanvas.renderAll();
      });
    }
  });

  // Wait for all objects to be drawn on the temporary canvas
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Create a new image from the temporary canvas
  const mask = new Image();
  mask.src = tempCanvas.toDataURL();

  // Wait for the image to load
  await new Promise((resolve) => {
    mask.onload = resolve;
  });

  // Create a fabric.Image object from the image
  const maskImage = new fabric.Image(mask);

  // Set the globalCompositeOperation of the maskImage to 'destination-out'
  maskImage.globalCompositeOperation = 'destination-out';

  // Add the maskImage to the canvas
  canvas.add(maskImage);

  // Render all objects on the canvas
  canvas.renderAll();

  // Create a data URL of the canvas
  const dataUrl = canvas.toDataURL({
    format: 'png', // Use PNG to support transparency
    quality: 1,
  });

  // Create a new anchor element
  const link = document.createElement('a');
  link.download = 'image.png';
  link.href = dataUrl;

  // Append the anchor element to the body
  document.body.appendChild(link);

  // Simulate a click on the anchor element
  // link.click();

  // Remove the anchor element from the body
  document.body.removeChild(link);

  // Revert the changes
  originalVisibility.forEach(({ object, visible }) => {
    object.visible = visible;
  });
  canvas.backgroundColor = originalBackgroundColor;
  canvas.remove(maskImage);
  tempCanvas.dispose();
  canvas.renderAll();
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
        tempCanvas.renderAll();
      });
    }
  });

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
  // downloadImageFile(file, "t1.png");

  originalVisibility.forEach(({ object, visible }) => {
    object.visible = visible;
  });
  canvas.backgroundColor = originalBackgroundColor;
  canvas.remove(maskImage);

  tempCanvas.dispose();
  canvas.renderAll();
  return file;
};

export const createTransparentMask2 = async (originalCanvas: fabric.Canvas) => {
  // Find the productImage and get its zIndex
  const canvas = await copyCanvas(originalCanvas);
  const productImage = canvas.getObjects().find((obj) => obj.name === 'productImage');
  const productImageIndex = canvas.getObjects().indexOf(productImage!);

  const originalVisibility = hideNonProductImages(canvas, productImage!);
  const originalBackgroundColor = canvas.backgroundColor;
  canvas.backgroundColor = '';

  const { maskImage, tempCanvas } = await createMask(canvas, productImage!);
  canvas.add(maskImage);
  canvas.renderAll();

  const file = await getFileCopy(canvas, 'canvas-transparent-mask.png');
  // downloadImageFile(file, "t.png");

  originalVisibility.forEach(({ object, visible }) => {
    object.visible = visible;
  });
  // canvas.backgroundColor = originalBackgroundColor;
  // canvas.remove(maskImage);

  tempCanvas.dispose();
  canvas.renderAll();

  return file;
};

export const createTransparentMask3 = async (canvas: fabric.Canvas) => {
  // Find the productImage and get its zIndex
  const productImage = canvas.getObjects().find((obj) => obj.name === 'productImage');
  const productImageIndex = canvas.getObjects().indexOf(productImage!);

  const originalVisibility = hideNonProductImages(canvas, productImage!);
  const originalBackgroundColor = canvas.backgroundColor;
  canvas.backgroundColor = '';

  const { maskImage, tempCanvas } = await createMask(canvas, productImage!);
  canvas.add(maskImage);
  canvas.renderAll();

  const file = await getFileCopy(canvas, 'canvas-transparent-mask.png');

  originalVisibility.forEach(({ object, visible }) => {
    object.visible = visible;
  });
  canvas.backgroundColor = originalBackgroundColor;
  canvas.remove(maskImage);

  tempCanvas.dispose();
  canvas.renderAll();

  return file;
};

const downloadImageFile = (file: any, name: string = 'image.png') => {
  // Create a new blob object from the file
  const blob = new Blob([file], { type: 'image/png' });

  // Create a URL for the blob object
  const url = URL.createObjectURL(blob);

  // Create a new anchor element
  const a = document.createElement('a');

  // Set the href of the anchor element to the blob URL
  a.href = url;

  // Set the download attribute of the anchor element to the desired file name
  a.download = name;

  // Append the anchor element to the body
  document.body.appendChild(a);

  // Programmatically click the anchor element to start the download
  a.click();

  // Remove the anchor element from the body
  document.body.removeChild(a);

  // Revoke the blob URL
  URL.revokeObjectURL(url);
};

const copyCanvas = async (canvas: any) => {
  const tempCanvas = new fabric.Canvas('temp', {});
  tempCanvas.setWidth(canvas.getWidth());
  tempCanvas.setHeight(canvas.getHeight());

  const canvasObj = canvas.getObjects();

  for (let index = 0; index < canvasObj.length; index++) {
    const element = canvasObj[index];
    element.clone((cloned: any) => {
      cloned.set({
        name: element.name,
      });
      tempCanvas.add(cloned);
    });
    // tempCanvas.add(element);
    // await cloneElement(element, tempCanvas);
  }
  tempCanvas.renderAll();

  console.log(
    'first',
    tempCanvas.getObjects().map((obj: any) => obj.name),
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return tempCanvas;
};

const getFileCopy = async (
  canvas: any,
  filename: string,
  setWhiteColor: string = 'transparent',
  scaleFactor: number = 2,
) => {
  const tempCanvas = new fabric.Canvas('staticTemp', {
    backgroundColor: setWhiteColor,
  });
  tempCanvas.setWidth(canvas.getWidth());
  tempCanvas.setHeight(canvas.getHeight());

  canvas.getObjects().forEach((obj: any, index: any) => {
    obj.clone((cloned: any) => {
      cloned.set({
        name: obj.name,
      });
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

  // console.log('**--*-*-*-*-*-*-**-*');
  // console.log(dataUrl);

  // Create a File object from the Blob
  const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

  tempCanvas.dispose();
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
export const removeObject = (canvas: any, elementsRef: any, setElementRemovalCount: any, canvasProductImageRef:any  ) => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject) {
    if (activeObject.type === 'activeSelection') {
      activeObject.getObjects().forEach((obj: any) => {
        const index = elementsRef.current.findIndex((el: any) => el === obj.name);
        if (index !== -1) {
          elementsRef.current.splice(index, 1);
          setElementRemovalCount((prev: any) => prev + 1);
        }
        canvas?.remove(obj);
      });
      canvas?.discardActiveObject();
    } else {
      const index = elementsRef.current.findIndex((el: any) => el === activeObject.name);
      if (index !== -1) {
        elementsRef.current.splice(index, 1);
        setElementRemovalCount((prev: any) => prev + 1);
      }
      canvas?.remove(activeObject);
    }

    if (activeObject.name === 'productImage') {
      canvasProductImageRef.current = null;
    }

    canvas?.renderAll();
  }
};

export const copyElement = (canvas: any, elementsRef: any, setElementRemovalCount: any) => {
  const activeObject = canvas?.getActiveObject();
  if (activeObject.name === 'productImage') {
    return;
  }
  if (activeObject) {
    activeObject.clone(function (cloned: any) {
      const objects = canvas.getObjects();
      const lastObjectWithName = objects.reverse().find((object: any) => object.name == activeObject.name);
      if (lastObjectWithName) {
        cloned.set({
          name: activeObject.name,
          left: lastObjectWithName.left + 10,
          top: lastObjectWithName.top + 10,
        });
      } else {
        cloned.set({
          name: activeObject.name,
          left: cloned.left + 10,
          top: cloned.top + 10,
        });
      }
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      elementsRef.current.push(activeObject.name);
      setElementRemovalCount((prev: any) => prev + 1);
      canvas?.renderAll();
    });
  }
}

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

export const handleCopy = (canvas: any) => {
  const activeObject = canvas.getActiveObject();

  if (activeObject) {
    canvas._clipboard = activeObject;
  }
};

export const handlePaste = (canvas: any, elementsRef: any) => {
  if (canvas._clipboard) {
    const activeObject = canvas.getActiveObject();
    let pasteLeft = 0;
    let pasteTop = 0;

    if (activeObject) {
      pasteLeft = activeObject.left + activeObject.width + 5;
      pasteTop = activeObject.top;
    }

    canvas.discardActiveObject();

    const name = canvas._clipboard.name;
    canvas._clipboard.clone(function (clonedObj: any) {
      clonedObj.set({
        left: pasteLeft,
        top: pasteTop,
      });
      canvas.add(clonedObj);
      const ele = elementsRef.current;
      ele.push(name);
      elementsRef.current = ele;
      canvas.setActiveObject(clonedObj);
      canvas?.renderAll();
    });
  }
};
