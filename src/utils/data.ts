export const generateArrayOf = (
  amount: number,
  dataGenerator: (index: number) => any
) =>
  Array(amount)
    .fill(1)
    .map((_, idx) => dataGenerator(idx));

export const getChar = (i: number) => String.fromCharCode(i);
