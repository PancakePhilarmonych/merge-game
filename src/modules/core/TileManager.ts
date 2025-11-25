import { Tile } from '@/modules/core/Tile';
import { Colors, getRandomColor } from '@/utils';
import Grid, { DEFAULT_GRID_SIZE } from '@/modules/core/Grid';
import Cell from '@/modules/core/Cell';

export default class TileManager {
  private static readonly INITIAL_OBJECT_COUNT = Math.floor(
    DEFAULT_GRID_SIZE * DEFAULT_GRID_SIZE * 0.7,
  );

  private tiles: Tile[] = [];
  private grid: Grid;
  private gridSize: number;

  constructor(grid: Grid, gridSize: number) {
    this.grid = grid;
    this.gridSize = gridSize;
  }

  public generateTiles(): void {
    const emptyCells = this.getEmptyCells();

    emptyCells.forEach((cell: Cell) => {
      if (this.tiles.length >= TileManager.INITIAL_OBJECT_COUNT) return;
      const hasTile = cell.getTile();

      if (hasTile) return;

      const randomColor = getRandomColor();

      if (randomColor === Colors.EMPTY) return;

      const newTile = new Tile(cell, randomColor, this.gridSize);

      this.tiles.push(newTile);
    });

    if (this.tiles.length < TileManager.INITIAL_OBJECT_COUNT) {
      this.generateTiles();
    }
  }

  public addTile(cell: Cell, color: Colors): Tile {
    const newTile = new Tile(cell, color, this.gridSize);
    this.tiles.push(newTile);
    return newTile;
  }

  public removeTile(tile: Tile): void {
    const index = this.tiles.indexOf(tile);
    if (index > -1) {
      this.tiles.splice(index, 1);
    }
    tile.destroy();
  }

  public clean(): void {
    this.tiles.forEach((tile: Tile) => {
      tile.destroy();
    });
    this.tiles = [];
  }

  public resize(gridSize: number): void {
    this.gridSize = gridSize;
    this.tiles.forEach((tile: Tile) => {
      tile.resize(gridSize);
    });
  }

  public getRandomEmptyCell(): Cell | null {
    const emptyCells = this.getEmptyCells();
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
  }

  private getEmptyCells(): Cell[] {
    return this.grid.flatCells.filter(cell => cell.getTile() === null);
  }

  public getTiles(): Tile[] {
    return this.tiles;
  }

  public isFull(): boolean {
    return this.grid.flatCells.every((cell: Cell) => cell.getTile() !== null);
  }
}
