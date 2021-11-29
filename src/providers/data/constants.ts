import { LocalStorageData, State } from './interfaces';

export const Ref = Symbol('ref');

export const initialState: State = {
  storageKey: '',
  data: {
    columnsByLetter: new Map(),
    columnsByIndex: [],
    matrix: [],
  },
  selected: null,
  editing: false,
};

export const initialLocalStorageData: LocalStorageData = {
  relations: [],
  data: {},
};

export const spreadSheetValues: Record<symbol, string> = {
  [Ref]: '#REF!',
};
