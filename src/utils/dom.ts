export const detectCoordsByEvent = (e: any) => {
  const el = e.target;
  const { r, c } = el.dataset;
  return [r, c];
};

export const cellPosition = (row: number, column: number) => {};

export const selectCell = (row: number, column: number) =>
  document.querySelector(`[data-r="${row}"][data-c="${column}"]`);

export const getColumnRect = (row: number, column: number) => {
  const element = selectCell(row, column);
  if (element) {
    return element.getBoundingClientRect();
  }
  return null;
};
