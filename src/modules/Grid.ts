import * as PIXI from 'pixi.js';
import Tile from './Tile';

export default class Grid {
  private cells: Tile[][];
  private selected: Tile | null = null;
  private cellSize: number;

  constructor(objectCount: number, gameWidth: number, gameHeight: number) {
    this.cells = [];
    const cellWidth = gameWidth / objectCount;
    const cellHeight = gameHeight / objectCount;
    this.cellSize = cellWidth > cellHeight ? cellHeight : cellWidth;

    this.initRows(objectCount);
  }

  private initRows(rowsCount: number): void {
    for (let row = 0; row < rowsCount; row++) {
      this.cells[row] = [];

      for (let col = 0; col < rowsCount; col++) {
        const cell = new Tile(col, row, this.cellSize);
        this.cells[row][col] = cell;
      }
    }
  }

  getContainers(): PIXI.Container[] {
    return this.cells.map((row: Tile[]) => row.map((cell: Tile) => cell.container)).flat();
  }

  getCells(): Tile[] {
    return this.cells.flat();
  }

  public getCell(x: number, y: number): Tile | null {
    return this.cells?.[x]?.[y] ?? null;
  }

  public select(cell: Tile): void {
    if (this.selected) {
      this.deselect();
    }

    this.selected = cell;
  }

  public deselect(): void {
    if (this.selected) {
      this.selected = null;
    }
  }

  getCellSize(): number {
    return this.cellSize;
  }

  getSelectedCellPosition(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.floor(x / this.cells[x][y].position.x),
      y: Math.floor(y / this.cells[x][y].position.y),
    };
  }
}
