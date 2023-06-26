import Row from "./Row";
import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class Grid {
  private rows: Row[];
  private container: PIXI.Container;

  constructor(rowsCount: number, boardSize: number, parent: PIXI.Container) {
    const tileSize = boardSize / rowsCount;

    this.container = new PIXI.Container();
    this.rows = [];
    this._initRows(rowsCount, tileSize);
    parent.addChild(this.container);
  }

  private _initRows(rowsCount: number, tileSize: number) {
    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
      let newRow = new Row(rowIndex);
      newRow.init(rowsCount, tileSize);
      this.rows.push(newRow);
      this.container.addChild(this.rows[rowIndex].getContainer());
    }
  }

  getRows(): Row[] {
    return this.rows
  }

  getContainer(): PIXI.Container {
    return this.container;
  }

  public getTile(x: number, y: number): Tile | null {
    if (x >= 0 && x < this.rows.length && y >= 0 && y < this.rows[x].getTiles().length) {
      return this.rows[x].getTiles()[y];
    }

    return null;
  }

  selectTile(x: number, y: number) {
    const tile = this.getTile(x, y);
    if(!tile) throw new Error(`Tile at position ${x}, ${y} does not exist`);

    this.rows[x].getTiles()[y].select();
  }

  unselectTile(x: number, y: number) {
    const tile = this.getTile(x, y);
    if(!tile) throw new Error(`Tile at position ${x}, ${y} does not exist`);

    this.rows[x].getTiles()[y].unselect();
  }

  hoverTile(x: number, y: number) {
    const tile = this.getTile(x, y);
    if(!tile) throw new Error(`Tile at position ${x}, ${y} does not exist`);

    this.rows[x].getTiles()[y].hover();
  }
}
