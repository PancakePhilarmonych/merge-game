import * as PIXI from 'pixi.js';
import Cell from '@/modules/core/Cell';
import { getMaxAvailibleSideSize } from '@/utils';
import { ROWS_COUNT } from '@/config/constants';

export default class Grid extends PIXI.Container {
  private cells: Cell[][];
  public cellSize: number;

  constructor() {
    super();
    this.cells = [];
    this.cellSize = getMaxAvailibleSideSize() / ROWS_COUNT;

    this.initRows();
  }

  private initRows(): void {
    for (let row = 0; row < ROWS_COUNT; row++) {
      this.cells[row] = [];

      for (let col = 0; col < ROWS_COUNT; col++) {
        const cell = new Cell(col, row, this.cellSize);
        this.cells[row][col] = cell;
      }
    }
  }

  public getCell(x: number, y: number): Cell | null {
    return this.cells?.[y]?.[x] ?? null;
  }

  public cleanAllCells(): void {
    this.cells.forEach(row =>
      row.forEach(cell => {
        cell.removeTile();
        cell.alpha = 1;
      }),
    );
  }

  public resize(newSize: number) {
    this.cellSize = newSize / ROWS_COUNT;

    for (let row = 0; row < ROWS_COUNT; row++) {
      for (let col = 0; col < ROWS_COUNT; col++) {
        const cell = this.cells[row][col];
        cell.resize(this.cellSize);
      }
    }
  }

  get flatCells(): Cell[] {
    return this.cells.flat();
  }

  get emptyCells(): Cell[] {
    return this.flatCells.filter(cell => cell.getTile() === null);
  }

  get cellsContainers(): PIXI.Container[] {
    return this.cells.map((row: Cell[]) => row.map((cell: Cell) => cell)).flat();
  }
}
