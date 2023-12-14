import * as PIXI from 'pixi.js';
export default class App {
  public instance: PIXI.Application<HTMLCanvasElement>;
  private root: HTMLDivElement;

  constructor() {
    const size = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
    const sizeWithoutPadding = size - 36;
    this.root = document.getElementById('root')! as HTMLDivElement;
    this.instance = new PIXI.Application<HTMLCanvasElement>({
      width: sizeWithoutPadding,
      height: sizeWithoutPadding,
      antialias: true,
    });
    this.root.appendChild(this.instance.view);
    this.instance.renderer.resize(sizeWithoutPadding, sizeWithoutPadding);
  }
}
