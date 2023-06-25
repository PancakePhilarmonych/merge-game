import { App } from "./App";
import Board from "./Board";

export default class GameManager {
  public static gameSize: number = 450;

  public static init(parent: HTMLElement) {
    parent.appendChild(App.view);

    const board = new Board();
    board.init(6, this.gameSize, App.stage);

    console.log(board.getTiles())
  }
}
