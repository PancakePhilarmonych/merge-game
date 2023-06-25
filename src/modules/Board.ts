import Row from "./Row";
import * as PIXI from "pixi.js";

export default class Board {
  public rows: Row[];
  private container: PIXI.Container;

  constructor() {
    this.container = new PIXI.Container();
    this.rows = [];
  }

  init(rowsCount: number, boardSize: number, parentContainer: PIXI.Container) {
    const tileSize = boardSize / rowsCount;
    this.rows = [];

    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
      let newRow = new Row(rowIndex);
      newRow.init(rowsCount, tileSize);
      this.rows.push(newRow);
      this.container.addChild(this.rows[rowIndex].getContainer());
    }

    parentContainer.addChild(this.container);
  }

  getTiles(): any[] {
    return this.rows
  }

  getContainer() {
    return this.container;
  }

  getTile(x: number, y: number) {
    return this.rows[x].tiles[y];
  }

  selectTile(x: number, y: number) {
    this.rows[x].tiles[y].select();
  }

  unselectTile(x: number, y: number) {
    this.rows[x].tiles[y].unselect();
  }

  hoverTile(x: number, y: number) {
    this.rows[x].tiles[y].hover();
  }

  getTileByIndex(x: number, y: number) {
    return this.rows[x].tiles[y];
  }
}
