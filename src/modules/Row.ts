import Tile from "./Tile";
import * as PIXI from 'pixi.js';

export default class Row {
  private container: PIXI.Container;
  private rowIndex: number;
  private tiles: Tile[];

  constructor(index: number) {
    this.rowIndex = index;
    this.container = new PIXI.Container();
    this.tiles = [];
  }

  public init(size: number, tileSize: number): void {
    for (let tileIndex = 0; tileIndex < size; tileIndex++) {
      const tile = new Tile(tileIndex, this.rowIndex, tileSize, 0);
      this.tiles.push(tile);
      this.container.addChild(tile.getContainer());
    }
  }

  public getContainer(): PIXI.Container {
    return this.container;
  }

  public getTiles(): Tile[] {
    return this.tiles;
  }
}
