import * as PIXI from 'pixi.js';
export default class App {
  public instance: PIXI.Application<HTMLCanvasElement>;
  private root: HTMLDivElement;

  constructor() {
    this.root = document.getElementById('root')! as HTMLDivElement;
    this.instance = new PIXI.Application<HTMLCanvasElement>({
      resizeTo: this.root,
      antialias: true,
    });
    this.root.appendChild(this.instance.view);
  }
}
