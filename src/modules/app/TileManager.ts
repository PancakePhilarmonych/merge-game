import { Tile } from '@/modules/core/Tile';
import { Colors, getRandomColor } from '@/utils';
import Grid from '@/modules/core/Grid';
import Cell from '@/modules/core/Cell';
import { INITIAL_TILES_COUNT } from '@/config/constants';

export default class TileManager {
  private tiles: Tile[] = [];
  private grid: Grid;

  constructor(grid: Grid) {
    this.grid = grid;
  }

  public generateTiles(): void {
    const emptyCells = this.getEmptyCells();

    emptyCells.forEach((cell: Cell) => {
      if (this.tiles.length >= INITIAL_TILES_COUNT) return;
      const hasTile = cell.getTile();

      if (hasTile) return;

      const randomColor = getRandomColor();

      if (randomColor === Colors.EMPTY) return;

      const newTile = new Tile({ color: randomColor }, cell, this.grid.cellSize);

      this.tiles.push(newTile);
    });

    if (this.tiles.length < INITIAL_TILES_COUNT) {
      this.generateTiles();
    }
  }

  public addTile(cell: Cell, color: Colors, level: number = 1): Tile {
    const newTile = new Tile({ color, level }, cell, this.grid.cellSize);

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
