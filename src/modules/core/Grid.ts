import * as PIXI from 'pixi.js';
import Cell from '@/modules/core/Cell';
import { getMaxAvailibleSideSize } from '@/utils';

export default class Grid extends PIXI.Container {
  private cells: Cell[][];
  public size: number;
  public gridSize: number;

  constructor(gridSize: number) {
    super();
    this.cells = [];
    this.gridSize = gridSize;
    this.size = getMaxAvailibleSideSize() / gridSize;

    this.initRows(gridSize);
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
    this.size = newSize / this.gridSize;

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
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
