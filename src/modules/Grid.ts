import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class Grid {
  private cells: Tile[][];
  private container: PIXI.Container;
  private selectedTile: Tile | null = null;
  public tileSize: number;

  constructor(rowsCount: number, boardSize: number) {
    this.cells = [];

    this.tileSize = boardSize / rowsCount;

    this.container = new PIXI.Container();
    this.container.sortableChildren = true;
    this.container.interactiveChildren = true;

    this.initRows(rowsCount, this.tileSize);
    this.createGrid();
  }

  private initRows(rowsCount: number, tileSize: number): void {
    for (let row = 0; row < rowsCount; row++) {
      this.cells[row] = [];

      for (let col = 0; col < rowsCount; col++) {
        const tile = new Tile(col, row, tileSize);
        this.cells[row][col] = tile;
      }
    }
  }

  private createGrid() {
    this.container.addChild(...this.getSprites());
  }

  getSprites(): PIXI.Sprite[] {
    return this.cells.map((row: Tile[]) => row.map((tile: Tile) => tile.sprite)).flat();
  }

  getTiles(): Tile[] {
    return this.cells.flat();
  }

  getContainer(): PIXI.Container {
    return this.container;
  }

  public getTile(x: number, y: number): Tile | null {
    return this.cells[y] && this.cells[y][x] ? this.cells[y][x] : null;
  }

  public selectTile(tile: Tile): void {
    if (this.selectedTile) {
      this.deselect();
    }

    this.selectedTile = tile;
    // this.selectedTile.select();
  }

  public deselect(): void {
    if (this.selectedTile) {
      // this.selectedTile.deselect();
      this.selectedTile = null;
    }
  }

  getSelectedTilePosition(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.floor(x / this.cells[x][y].position.x),
      y: Math.floor(y / this.cells[x][y].position.y),
    };
  }
}
