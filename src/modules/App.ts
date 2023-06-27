import * as PIXI from "pixi.js";
export default class App {
  private root: HTMLDivElement;
  public instance: PIXI.Application<HTMLCanvasElement>;

  constructor() {
    this.root = document.getElementById("root")! as HTMLDivElement;
    this.instance = new PIXI.Application<HTMLCanvasElement>({ resizeTo: this.root });
    this.root.appendChild(this.instance.view);
  }
}
