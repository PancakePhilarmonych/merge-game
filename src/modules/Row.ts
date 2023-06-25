import Tile from "./Tile";
import * as PIXI from 'pixi.js'

export default class Row {
  private container: PIXI.Container;
  private rowIndex: number;
  public tiles: Tile[];

  constructor(rowIndex: number, ) {
    this.rowIndex = rowIndex;
    this.container = new PIXI.Container();
    this.tiles = [];
  }

  init(size: number, tileSize: number) {
    for (let tileIndex = 0; tileIndex < size; tileIndex++) {
      const tile = new Tile(tileIndex, this.rowIndex, tileSize, 0);
      this.tiles.push(tile);
      this.container.addChild(tile.getSpite());
    }
  }

  getContainer() {
    return this.container;
  }
}
