import { fabric } from 'fabric';

export const addRect = (canvas, setRect, rect) => {
  if (rect) {
    const testRect = new fabric.Rect(rect);
    canvas.add(testRect);
    setRect(testRect);
  } else {
    const testRect = new fabric.Rect({
      height: 200,
      width: 200,
      fill: '#555555',
      rx: 0,
      ry: 0,
    });
    canvas.add(testRect);
    setRect(testRect);
  }
};

export const setUpRect = (canvas, rect) => {
  addBrControllers(canvas, rect);
  const shortSide = widerThanTall(rect) ? rect.width : rect.height;
  calculateBrControllerPositions(0.1, shortSide);
  rect.on('scaling', (options) => {
    rect.set({
      width: rect.width * rect.scaleX,
      height: rect.height * rect.scaleY,
      scaleX: 1,
      scaleY: 1,
      noScaleCache: false,
    });
    canvas.renderAll();
  });
};

const addBorderRadiusControl = (canvas, rect, x, y) =>
  new fabric.Control({
    x,
    y,
    cursorStyle: 'pointer',
    actionName: 'borderRadius',
    actionHandler: (eventData, target) => {
      calculateBorderRadius(canvas, rect, eventData, target);
    },
    render: (ctx, left, top) => {
      ctx.beginPath();
      ctx.arc(left, top, 5, 0, 6.28319);
      ctx.fill();
      ctx.stroke();
      ctx.font = '10px Arial';
      ctx.fillText(`${Math.floor(rect.rx)}`, left + 5, top + 10);
    },
    cornerSize: 5,
  });

const addBrControllers = (canvas, rect) => {
  const controlCoords = {
    tl: { x: -0.5, y: -0.5 },
    tr: { x: 0.5, y: -0.5 },
    bl: { x: -0.5, y: 0.5 },
    br: { x: 0.5, y: 0.5 },
  };
  Object.keys(rect.aCoords).forEach((corner) => {
    const controlName = `bRadius${corner}`;
    fabric.Object.prototype.controls[controlName] = addBorderRadiusControl(
      canvas,
      rect,
      controlCoords[corner].x,
      controlCoords[corner].y,
    );
  });
};

const calculateControllerPosition = (multiplier, shortSide, pos) => {
  const position = shortSide * multiplier;
  return position * pos * -1;
};

const changeBorderRadius = (multiplier, shortSide) => {
  const offSet = Math.cos(multiplier * Math.PI) * -0.1;
  return shortSide * (multiplier + offSet) * 0.5;
};

const calculateBrControllerPositions = (multiplier, shortSide) => {
  Object.keys(fabric.Object.prototype.controls).forEach((control) => {
    if (fabric.Object.prototype.controls[control].actionName === 'borderRadius') {
      fabric.Object.prototype.controls[control].offsetX = calculateControllerPosition(
        multiplier,
        shortSide,
        fabric.Object.prototype.controls[control].x,
      );
      fabric.Object.prototype.controls[control].offsetY = calculateControllerPosition(
        multiplier,
        shortSide,
        fabric.Object.prototype.controls[control].y,
      );
    }
  });
};

const outOfBounds = (corner, ratio, direction) => {
  if (direction === 'x') {
    if (corner === 'bRadiustr' || corner === 'bRadiusbr') {
      if (ratio > 0.9) return 1;
      if (ratio < 0.1) return -1;
      return 0;
    } else {
      if (ratio < -0.9) return 1;
      if (ratio > -0.1) return -1;
      return 0;
    }
  } else {
    if (corner === 'bRadiusbr' || corner === 'bRadiusbl') {
      if (ratio > 0.9) return 1;
      if (ratio < 0.1) return -1;
      return 0;
    } else {
      if (ratio < -0.9) return 1;
      if (ratio > -0.1) return -1;
      return 0;
    }
  }
};

const widerThanTall = (rect) => {
  return rect.width < rect.height;
};

const calculateSideToDistanceRatio = (rectangle, eventData, direction) => {
  const cursor = direction === 'x' ? eventData.offsetX : eventData.offsetY;
  const midX = rectangle.left + rectangle.width / 2;
  const midY = rectangle.top + rectangle.height / 2;
  const mid = direction === 'x' ? midX : midY;
  const shortSide = direction === 'x' ? rectangle.width : rectangle.height;
  const distanceToMiddle = cursor - mid;
  const distanceRatio = distanceToMiddle / (shortSide / 2);
  return distanceRatio;
};

const calculateBorderRadius = (canvas, rectangle, eventData, transform) => {
  const direction = widerThanTall(rectangle) ? 'x' : 'y';
  const ratio = calculateSideToDistanceRatio(rectangle, eventData, direction);
  const multiplier = 1 - Math.abs(ratio);
  const shortSide = direction === 'x' ? rectangle.width : rectangle.height;
  if (!outOfBounds(transform.corner, ratio, direction)) {
    calculateBrControllerPositions(multiplier, shortSide);
    rectangle.set({
      rx: changeBorderRadius(multiplier, shortSide),
      ry: changeBorderRadius(multiplier, shortSide),
    });
  } else {
    if (outOfBounds(transform.corner, ratio, direction) === 1) {
      rectangle.set({
        rx: 0,
        ry: 0,
      });
      calculateBrControllerPositions(0.1, shortSide);
    } else {
      rectangle.set({
        rx: shortSide / 2,
        ry: shortSide / 2,
      });
      calculateBrControllerPositions(0.9, shortSide);
    }
  }
  canvas.renderAll();
};
