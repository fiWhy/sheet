import {
  ActualizeRelations,
  BlurAction,
  EditAction,
  LocalStorageColumnValues,
  Relations,
  SelectAction,
  UpdateAction,
  UpdateRelations,
} from './interfaces';

export const update = (value: string): UpdateAction => ({
  type: 'update',
  payload: value,
});

export const select = (row: number, column: number): SelectAction => ({
  type: 'select',
  payload: [row, column],
});

export const edit = (): EditAction => ({
  type: 'edit',
});

export const blur = (): BlurAction => ({
  type: 'blur',
});

export const updateRelations = (relations: Relations): UpdateRelations => ({
  type: 'update-relations',
  payload: relations,
});

export const actualizeData = (
  data: LocalStorageColumnValues
): ActualizeRelations => ({
  type: 'actualize-data',
  payload: data,
});
