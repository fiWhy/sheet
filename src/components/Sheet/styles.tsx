import styled from 'styled-components';

export const SheetStyled = styled.div`
  display: grid;
  grid-auto-flow: row;
  height: 100%;
`;
export const RowWrapperStyled = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: nowrap;
`;

export const ButtonsWrapperStyled = styled.div`
  display: flex;
  width: 200px;
  flex-direction: row;
`;

export const CellWrapperStyled = styled.div`
  border: 1px solid #ccc;
  width: 100%;
  display: flex;
  flex: 1;
  min-width: 150px;

  &.numeric {
    max-width: 50px;
    min-width: 50px !important;
  }

  &.header-input {
    flex: 0 1 100%;
  }

  &.custom {
    flex: inherit;
    min-width: inherit;
  }

  &.selected {
    border: 1px solid blue;
  }
`;

export const InputWrapperStyled = styled(CellWrapperStyled)`
  position: absolute;
`;
