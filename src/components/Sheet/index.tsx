import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useParams } from 'react-router';
import { useSelection } from '../../hooks/use-selection';
import { useData } from '../../providers/data';
import { detectCoordsByEvent } from '../../utils/dom';
import Data from './Data';
import Header from './Header';
import Info from './Info';
import { SheetProps } from './interfaces';
import { ButtonsWrapperStyled, SheetStyled } from './styles';

const Sheet: VFC<SheetProps> = () => {
  const [input, setInput] = useState('');
  const [link, setLink] = useState('');
  const { payload } = useParams();

  const {
    data,
    selected,
    editing,
    selectedCellData,
    select,
    update,
    edit,
    setInitialData,
    blur,
    updateRelations,
    generateApplicationLinkPayload,
    actualizeData,
  } = useData();

  const handleSelect = useCallback(
    (e: any) => {
      const [row, column] = detectCoordsByEvent(e);
      if (row && column) {
        select(Number(row), Number(column));
      }
    },
    [select]
  );

  useSelection(selected);

  const handleCreateLink = useCallback(() => {
    setLink(`http://localhost:3000/#/${generateApplicationLinkPayload()}`);
  }, [generateApplicationLinkPayload]);

  const handleEdit = useCallback(
    (e: any) => {
      if (selectedCellData) {
        setInput(selectedCellData.data);
        edit();
      }
    },
    [edit, selectedCellData]
  );

  const handleBlur = useCallback(() => {
    update(input);
    updateRelations();
    blur();
    setInput('');
  }, [blur, update, input, updateRelations]);

  useEffect(() => {
    if (!editing) {
      window.addEventListener('keydown', edit);

      return () => window.removeEventListener('keydown', edit);
    }
  }, [edit, editing]);

  useEffect(() => {
    if (payload) {
      try {
        setInitialData(JSON.parse(atob(payload)));
      } catch (e) {}
    }
  }, [payload, setInitialData]);

  useEffect(() => {
    actualizeData();
    updateRelations();
  }, [actualizeData, updateRelations]);

  return (
    <SheetStyled onDoubleClick={handleEdit} onClick={handleSelect}>
      <ButtonsWrapperStyled>
        <button onClick={handleCreateLink}>Create Link</button>
        <input readOnly value={link} />
      </ButtonsWrapperStyled>
      <Info onBlur={handleBlur} onChange={setInput} value={input} />
      <Header />
      <Data matrix={data.matrix} />
    </SheetStyled>
  );
};

export default Sheet;
