export interface CellData {
  viewData: string;
  data: string;
}

export type StorageDataKeys = 'data' | 'relations';

export type Matrix = CellData[][];

export type ColumnCoordinate = [number, number];

export type Relations = Map<string, Set<string>>;

export type ColumnsByLetter = Map<string, number>;

export type ColumnsByIndex = string[];

export type PossibleDataValue = string | number | symbol | undefined;
export type PossibleViewValue = string | symbol;

export type DataValue = {
  columnsByLetter: ColumnsByLetter;
  columnsByIndex: ColumnsByIndex;
  matrix: Matrix;
};

export interface State {
  storageKey: string;
  data: DataValue;
  selected: ColumnCoordinate | null;
  editing: boolean;
}

export type LocalStorageColumnValues = Record<string, string>;
export type LocalStorageRelations = [string, string[]][];

export interface LocalStorageData {
  data: LocalStorageColumnValues;
  relations: LocalStorageRelations;
}

export type UpdateAction = {
  type: 'update';
  payload: string;
};

export type EditAction = {
  type: 'edit';
};

export type BlurAction = {
  type: 'blur';
};

export type UpdateRelations = {
  type: 'update-relations';
  payload: Relations;
};

export type ActualizeRelations = {
  type: 'actualize-data';
  payload: LocalStorageColumnValues;
};

export type SelectAction = { type: 'select'; payload: [number, number] };

export type Action =
  | UpdateAction
  | SelectAction
  | EditAction
  | BlurAction
  | UpdateRelations
  | ActualizeRelations;

export interface DataProviderValue extends State {
  selectedCellData: CellData | null;
  update: (value: string) => void;
  select: (row: number, column: number) => void;
  edit: () => void;
  blur: () => void;
  updateRelations: () => void;
  generateApplicationLinkPayload: () => string;
  actualizeData: () => void;
  setInitialData: (data: LocalStorageData) => void;
}

export interface DataContextProps {
  storageKey: string;
  columns: number;
  rows: number;
  children: any;
}
