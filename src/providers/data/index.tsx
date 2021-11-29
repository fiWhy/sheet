import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import {
  actualizeData,
  blur,
  edit,
  select,
  update,
  updateRelations,
} from './actions';
import { initialLocalStorageData, initialState } from './constants';
import {
  DataContextProps,
  DataProviderValue,
  LocalStorageData,
  State,
} from './interfaces';
import reducer from './reducer';
import {
  calculateRelations,
  generateMatrix,
  getLocalStorageData,
  relationsToStorageRelations,
  storageDataToRelations,
  updateLocalStorageData,
} from './utils';

export const DataContext = createContext<DataProviderValue>({
  ...initialState,
  selectedCellData: null,
  update: () => void 0,
  updateRelations: () => void 0,
  select: () => void 0,
  edit: () => void 0,
  blur: () => void 0,
  generateApplicationLinkPayload: () => '',
  actualizeData: () => void 0,
  setInitialData: () => void 0,
});

export const useData = () => useContext(DataContext);

export const DataProvider: FC<DataContextProps> = ({
  storageKey,
  children,
  columns,
  rows,
}) => {
  const [{ data, selected, editing }, dispatch] = useReducer<
    typeof reducer,
    State
  >(
    reducer,
    {
      data: generateMatrix(rows, columns),
      selected: null,
      editing: false,
      storageKey: '',
    },
    (init: State) => init
  );

  const handleGenerateApplicationLinkPayload = useCallback(
    () =>
      btoa(
        localStorage.getItem(storageKey) ||
          JSON.stringify(initialLocalStorageData)
      ),
    [storageKey]
  );

  const handleUpdateStorage = useCallback(
    (value: string) => {
      if (selected) {
        updateLocalStorageData(storageKey, (previousData) => ({
          data: {
            ...previousData.data,
            [data.columnsByIndex[selected[1]] + selected[0]]: value,
          },
          relations: relationsToStorageRelations(
            calculateRelations(
              selected,
              value,
              storageDataToRelations(getLocalStorageData(storageKey)),
              data.columnsByIndex
            )
          ),
        }));
      }
    },
    [storageKey, selected, data.columnsByIndex]
  );

  const handleSetInitialData = useCallback(
    (data: LocalStorageData) => {
      localStorage.setItem(storageKey, JSON.stringify(data));
    },
    [storageKey]
  );

  const handleUpdate = useCallback(
    (value: string) => {
      dispatch(update(value));
      handleUpdateStorage(value);
    },
    [dispatch, handleUpdateStorage]
  );
  const handleSelect = useCallback(
    (row: number, column: number) => dispatch(select(row, column)),
    [dispatch]
  );

  const handleUpdateRelations = useCallback(
    () =>
      dispatch(
        updateRelations(storageDataToRelations(getLocalStorageData(storageKey)))
      ),
    [dispatch, storageKey]
  );

  const handleActualizeData = useCallback(
    () => dispatch(actualizeData(getLocalStorageData(storageKey).data)),
    [storageKey]
  );

  const handleEdit = useCallback(() => dispatch(edit()), [dispatch]);

  const handleBlur = useCallback(() => dispatch(blur()), [dispatch]);

  const selectedCellData = useMemo(() => {
    if (!selected) return null;
    return data.matrix[selected[0] - 1][selected[1]];
  }, [selected, data]);

  return (
    <DataContext.Provider
      value={{
        storageKey,
        editing,
        select: handleSelect,
        update: handleUpdate,
        updateRelations: handleUpdateRelations,
        edit: handleEdit,
        blur: handleBlur,
        generateApplicationLinkPayload: handleGenerateApplicationLinkPayload,
        actualizeData: handleActualizeData,
        setInitialData: handleSetInitialData,
        data,
        selected,
        selectedCellData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
