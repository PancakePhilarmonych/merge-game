import * as PIXI from 'pixi.js';
import Cell from '@/modules/core/Cell';
import { getMaxAvailibleSideSize } from '@/utils';
const DEFAULT_GRID_SIZE = 5;

export default class Grid extends PIXI.Container {
  private cells: Cell[][];
  public size: number;

  constructor() {
    super();
    this.cells = [];
    this.size = getMaxAvailibleSideSize() / DEFAULT_GRID_SIZE;

    this.initRows(DEFAULT_GRID_SIZE);
  }

  private initRows(rowsCount: number): void {
    for (let row = 0; row < rowsCount; row++) {
      this.cells[row] = [];

      for (let col = 0; col < rowsCount; col++) {
        const cell = new Cell(col, row, this.size);
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
    this.size = newSize / DEFAULT_GRID_SIZE;

    for (let row = 0; row < DEFAULT_GRID_SIZE; row++) {
      for (let col = 0; col < DEFAULT_GRID_SIZE; col++) {
        const cell = this.cells[row][col];
        cell.resize(this.size);
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
