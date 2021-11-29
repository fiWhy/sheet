import produce, { enableMapSet } from 'immer';
import { chain, isSymbol } from 'lodash';
import { spreadSheetValues } from './constants';
import { Action, PossibleViewValue, State } from './interfaces';
import {
  calculateValues,
  getColumnCoordsByName,
  initialEval,
  isColumnExists,
} from './utils';

enableMapSet();

const reducer = (state: State, action: Action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case 'update':
        if (draft.selected) {
          const selectedColumnCoords = [
            draft.selected[0] - 1,
            draft.selected[1],
          ];

          draft.data.matrix[selectedColumnCoords[0]][
            selectedColumnCoords[1]
          ].data = action.payload;
          draft.data.matrix[selectedColumnCoords[0]][
            selectedColumnCoords[1]
          ].viewData = initialEval(action.payload);
        }
        return;

      case 'update-relations':
        chain(action.payload)
          .toPairs()
          .reduce(
            (acc, [column]) =>
              calculateValues(column, action.payload, draft.data, column, acc),
            new Map<string, PossibleViewValue>()
          )
          .toPairs()
          .forEach(([column, value]) => {
            const columnCoords = getColumnCoordsByName(
              column,
              draft.data.columnsByLetter
            );
            if (
              columnCoords &&
              isColumnExists(
                draft.data.matrix,
                columnCoords[0],
                columnCoords[1]
              )
            ) {
              draft.data.matrix[columnCoords[0]][columnCoords[1]].viewData =
                isSymbol(value) ? spreadSheetValues[value] : value;
            }
          })
          .value();

        return;

      case 'actualize-data':
        chain(action.payload)
          .toPairs()
          .forEach(([column, value]) => {
            const columnCoords = getColumnCoordsByName(
              column,
              draft.data.columnsByLetter
            );

            if (
              columnCoords &&
              isColumnExists(
                draft.data.matrix,
                columnCoords[0],
                columnCoords[1]
              )
            ) {
              draft.data.matrix[columnCoords[0]][columnCoords[1]].data = value;
              draft.data.matrix[columnCoords[0]][columnCoords[1]].viewData =
                initialEval(value);
            }
          })
          .value();
        return;

      case 'select':
        draft.selected = action.payload;
        return;

      case 'edit':
        draft.editing = true;
        return;

      case 'blur':
        draft.editing = false;
        draft.selected = null;
        return;

      default:
        return;
    }
  });

export default reducer;
