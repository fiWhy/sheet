import React, { memo, VFC } from 'react';
import { DataProps } from './interfaces';
import { CellWrapperStyled, RowWrapperStyled } from './styles';

const Data: VFC<DataProps> = ({ matrix }) => {
  return (
    <>
      {matrix.map((_, rowI) => {
        return (
          <RowWrapperStyled key={rowI}>
            <CellWrapperStyled className=" numeric custom">
              {rowI + 1}
            </CellWrapperStyled>
            {matrix[rowI].map((__, columnI) => {
              return (
                <CellWrapperStyled
                  data-r={rowI + 1}
                  data-c={columnI}
                  key={`${rowI}-${columnI}`}
                >
                  {matrix[rowI][columnI].viewData}
                </CellWrapperStyled>
              );
            })}
          </RowWrapperStyled>
        );
      })}
    </>
  );
};

export default memo(Data);
