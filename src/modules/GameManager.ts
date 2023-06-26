import { App } from "./App";
import Grid from "./Grid";

export default class GameManager {
  private grid: Grid;

  constructor() {
    this.grid = new Grid(4, App.view.width, App.stage);
  }
}
