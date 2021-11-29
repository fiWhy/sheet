import React, { memo, VFC } from 'react';
import { useData } from '../../providers/data';
import { HeaderProps } from './interfaces';
import { CellWrapperStyled, RowWrapperStyled } from './styles';

const Header: VFC<HeaderProps> = () => {
  const { data } = useData();

  const { columnsByIndex } = data;

  return (
    <RowWrapperStyled>
      <CellWrapperStyled className="cell-wrapper numeric custom" />
      {columnsByIndex.map((columnName) => (
        <CellWrapperStyled key={columnName}>{columnName}</CellWrapperStyled>
      ))}
    </RowWrapperStyled>
  );
};

export default memo(Header);
