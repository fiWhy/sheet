import { Matrix } from '../../providers/data/interfaces';

export interface SheetProps {}

export interface HeaderProps {}

export interface DataProps {
  matrix: Matrix;
}

export interface InfoProps {
  onChange: (value: string) => void;
  onBlur: () => void;
  value: string;
}
