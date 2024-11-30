export const handleUndo = (currentPos, history, setIndexInHistory) => {
  const max = history.length - 1;
  const newPos = currentPos === max ? max : currentPos + 1;
  setIndexInHistory(newPos);
};

export const handleRedo = (currentPos, setIndexInHistory) => {
  const min = 0;
  const newPos = currentPos === min ? min : currentPos - 1;
  setIndexInHistory(newPos);
};

export const removeFuture = (
  history,
  setHistory,
  indexInHistory,
  setIndexInHistory,
  currentCanvasObject,
) => {
  const eventArray = [...history];
  const trimmedArray = eventArray.filter((e, i) => i >= indexInHistory);
  setHistory([currentCanvasObject, ...trimmedArray]);
  setIndexInHistory(0);
};
