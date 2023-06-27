import Grid from "./Grid";
import * as PIXI from "pixi.js";

export default class GameManager {
  private grid: Grid;

  constructor(app: PIXI.Application) {
    this.grid = new Grid(4, app.view.width, app.stage);
  }
}
