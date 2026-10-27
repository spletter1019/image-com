export type GridSize = 3 | 4 | 5;

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type Grid = RGB[][];

export type MatrixChannel = "all" | "r" | "g" | "b" | "tuple";

export type ToolMode = "bucket" | "eyedropper" | "eraser";

export interface Preset {
  id: string;
  name: string;
  description: string;
  size: GridSize;
  grid1: Grid;
  grid2: Grid;
  targetGrid?: Grid;
}

export interface CellCoord {
  r: number;
  c: number;
}
