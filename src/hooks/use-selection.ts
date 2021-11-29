import { useEffect } from 'react';
import { selectCell } from '../utils/dom';

export const useSelection = (selected: [number, number] | null) => {
  useEffect(() => {
    const selectedElement = document.getElementsByClassName('selected')[0];

    if (selectedElement) {
      selectedElement.classList.remove('selected');
    }

    if (selected) {
      const element = selectCell(selected[0], selected[1]);

      element?.classList.add('selected');
    }
  }, [selected]);
};
