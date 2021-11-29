import React, { memo, useCallback, useEffect, useRef, VFC } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../providers/data';
import { getColumnRect } from '../../utils/dom';
import { InfoProps } from './interfaces';
import {
  CellWrapperStyled,
  InputWrapperStyled,
  RowWrapperStyled,
} from './styles';

const Info: VFC<InfoProps> = ({ onChange, value, onBlur }) => {
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { editing, selected } = useData();

  const handleChangeCellData = useCallback(
    (e: any) => {
      onChange(e.currentTarget.value);
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur();
    }
  }, [onBlur]);

  useEffect(() => {
    if (selected && editing && inputWrapperRef.current) {
      const rect = getColumnRect(selected[0], selected[1]);
      inputWrapperRef.current.style.top = `${rect?.top}px` || '0';
      inputWrapperRef.current.style.left = `${rect?.left}px` || '0';
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing, selected]);

  return (
    <>
      {editing &&
        selected &&
        createPortal(
          <InputWrapperStyled ref={inputWrapperRef}>
            <input
              onBlur={handleBlur}
              ref={inputRef}
              value={value}
              onInput={handleChangeCellData}
            />
          </InputWrapperStyled>,
          document.body
        )}
      <RowWrapperStyled>
        <CellWrapperStyled className="numeric custom">fx</CellWrapperStyled>
        <CellWrapperStyled className="header-input custom">
          {value}
        </CellWrapperStyled>
      </RowWrapperStyled>
    </>
  );
};

export default memo(Info);
