import * as PIXI from "pixi.js";

export const app = new PIXI.Application<HTMLCanvasElement>({
  width: 450,
  height: 450,
  antialias: true,
  resolution: 1,
  backgroundColor: 0x6f432d,
});
