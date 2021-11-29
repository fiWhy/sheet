import {
  chain,
  cond,
  constant,
  isArray,
  isSymbol,
  replace,
  startsWith,
  stubTrue,
} from 'lodash';
import { generateArrayOf } from '../../utils/data';
import { initialLocalStorageData, Ref } from './constants';
import {
  ColumnCoordinate,
  ColumnsByIndex,
  ColumnsByLetter,
  DataValue,
  LocalStorageData,
  LocalStorageRelations,
  Matrix,
  PossibleDataValue,
  PossibleViewValue,
  Relations,
} from './interfaces';

const linksRegexp = /([a-zA-Z]+[0-9]+)+/g;
const columnValueSplitRegexp = /^([A-Z]+)([0-9]+)$/;

export const isColumnExists = (matrix: Matrix, row: number, column: number) =>
  matrix[row]?.[column] ? true : false;

export const getColumnLetter = (n: number) => {
  let arr = [];
  let i = 0;

  while (n) {
    arr[i] = n % 26;
    n = Math.floor(n / 26);
    i++;
  }

  for (let j = 0; j < i - 1; j++) {
    if (arr[j] <= 0) {
      arr[j] += 26;
      arr[j + 1] = arr[j + 1] - 1;
    }
  }

  let ans = '';
  for (let j = i; j >= 0; j--) {
    if (arr[j] > 0) ans += String.fromCharCode(65 + arr[j] - 1);
  }

  return ans;
};

export const generateMatrix = (rows: number, columns: number): DataValue => {
  const columnsByIndex = generateArrayOf(columns, (i) =>
    getColumnLetter(i + 1)
  );
  return {
    columnsByLetter: new Map(columnsByIndex.map((l, i) => [l, i])),
    columnsByIndex,
    matrix: generateArrayOf(rows, () =>
      generateArrayOf(columns, () => ({
        viewData: '',
        data: '',
      }))
    ),
  };
};

export const getLinks = (column: string) => column.match(linksRegexp);

export const getColumnValues = (column: string) => {
  const splitted = column.match(columnValueSplitRegexp);
  return splitted ? [splitted[2], splitted[1]] : null;
};

export const getRelations = cond<string, string[] | null>([
  [
    (s) => startsWith(s, '='),
    (s) =>
      chain(s)
        .thru(getLinks)
        .map(getColumnValues)
        .filter(isArray)
        .map(([c, n]) => n + c)
        .value(),
  ],
  [stubTrue, constant(null)],
]);

export const getColumnCoordsByName = (
  column: string,
  columnsByLetter: ColumnsByLetter
): [number, number, string] | null => {
  const matchedSource = getColumnValues(column);
  if (matchedSource) {
    const [sourceRowNumber, sourceColumnName] = matchedSource;
    const nSourceRowNumber = Number(sourceRowNumber) - 1;
    const columnIndex = columnsByLetter.get(sourceColumnName);
    if (columnIndex === undefined) return null;
    return [nSourceRowNumber, columnIndex, sourceColumnName];
  }
  return null;
};

const replaceCalculate = (
  str: string | symbol,
  column: string,
  withValue: PossibleDataValue
) => {
  if (isSymbol(str)) return str;
  if (isSymbol(withValue)) return withValue;

  return replace(str, column, String(withValue));
};

export const evalHelper = (str: string | symbol) => {
  if (isSymbol(str)) return str;
  const actualString = startsWith(str, '=') ? str.substr(1) : str;
  try {
    return eval(actualString) || '';
  } catch (e) {
    return actualString;
  }
};

export const initialEval = (str: string) =>
  startsWith(str, '=') ? str : evalHelper(str);

export const calculateValues = (
  root: string,
  graph: Relations,
  data: DataValue,
  startColumn: string,
  calculatedValues: Map<string, PossibleViewValue> = new Map(),
  visited: Set<string> = new Set()
): Map<string, PossibleViewValue> => {
  const { matrix, columnsByLetter } = data;
  const columnCoords = getColumnCoordsByName(startColumn, columnsByLetter);

  if (
    !columnCoords ||
    !isColumnExists(data.matrix, columnCoords[0], columnCoords[1])
  ) {
    return calculatedValues;
  }

  const columnData = matrix[columnCoords[0]][columnCoords[1]];

  visited.add(startColumn);
  const relations = graph.get(startColumn);

  if (!calculatedValues.has(startColumn)) {
    calculatedValues.set(startColumn, columnData.data);
  }
  if (!relations) {
    return calculatedValues.set(startColumn, evalHelper(columnData.data));
  }

  for (let value of Array.from(relations) as string[]) {
    if (visited.has(value)) {
      calculatedValues.set(value, Ref);
      return calculatedValues;
    }

    const nextPortion = calculateValues(
      root,
      graph,
      data,
      value,
      calculatedValues,
      startColumn === root ? new Set([root, startColumn]) : visited
    );

    calculatedValues.set(
      startColumn,
      replaceCalculate(
        calculatedValues.get(startColumn) || '',
        value,
        nextPortion.get(value) || 0
      )
    );
  }

  calculatedValues.set(
    startColumn,
    evalHelper(calculatedValues.get(startColumn) || '')
  );

  return calculatedValues;
};

export const relationsToStorageRelations = (
  relations: Relations
): LocalStorageRelations =>
  chain(relations)
    .toPairs()
    .reduce<LocalStorageRelations>(
      (acc, [column, relatedColumns]) => [
        ...acc,
        [column, Array.from(relatedColumns || new Set())],
      ],
      []
    )
    .value();

export const storageDataToRelations = (data: LocalStorageData): Relations =>
  chain(data.relations)
    .reduce(
      (acc, [column, relatedColumns]) =>
        acc.set(column, new Set(relatedColumns)),
      new Map()
    )
    .value();

export const calculateRelations = (
  selected: ColumnCoordinate,
  value: string,
  relations: Relations,
  columnsByIndex: ColumnsByIndex
): Relations => {
  const relationsList = getRelations(value);
  const column = columnsByIndex[selected[1]] + selected[0];
  if (relationsList) {
    relations.set(column, new Set(relationsList));
  } else {
    relations.delete(column);
  }

  return relations;
};

export const getLocalStorageData = (key: string): LocalStorageData => {
  try {
    return JSON.parse(
      localStorage.getItem(key) || JSON.stringify(initialLocalStorageData)
    );
  } catch (e) {
    return initialLocalStorageData;
  }
};

export const updateLocalStorageData = (
  storageKey: string,
  cb: (data: LocalStorageData) => LocalStorageData
) => {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      ...cb(getLocalStorageData(storageKey)),
    })
  );
};
