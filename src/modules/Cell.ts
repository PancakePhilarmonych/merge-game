import * as PIXI from 'pixi.js';
import EmptyField from '../assets/sprites/blocks/grass-tile.png';
import EmptyFieldSecond from '../assets/sprites/blocks/grass-tile-second.png';
import { GameObject } from './GameObject';
import SelectedTile from '../assets/sprites/blocks/selected.png';
import AvaibleTile from '../assets/sprites/blocks/availible.png';

export default class Tile extends PIXI.Container {
  public sprite: PIXI.Sprite;
  public selectArea: PIXI.Sprite;
  public availibleArea: PIXI.Sprite;
  public availible: boolean = false;
  private row: number;
  private column: number;
  private gameObject: GameObject | null = null;

  constructor(x: number, y: number, size: number) {
    super();
    this.column = x;
    this.row = y;

    const tileeCount = x + y;
    if (tileeCount % 2 === 0) {
      this.sprite = PIXI.Sprite.from(EmptyField);
    } else {
      this.sprite = PIXI.Sprite.from(EmptyFieldSecond);
    }

    this.selectArea = PIXI.Sprite.from(SelectedTile);
    this.availibleArea = PIXI.Sprite.from(AvaibleTile);

    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * x;
    this.sprite.y = size * y;

    this.selectArea.width = size;
    this.selectArea.height = size;
    this.selectArea.x = size * x;
    this.selectArea.y = size * y;
    this.selectArea.alpha = 0;

    this.availibleArea.width = size;
    this.availibleArea.height = size;
    this.availibleArea.x = size * x;
    this.availibleArea.y = size * y;
    this.availibleArea.alpha = 0;

    this.sprite.zIndex = 1;
    this.selectArea.zIndex = 2;
    this.availibleArea.zIndex = 3;

    this.addChild(this.sprite);
    this.addChild(this.selectArea);
    this.addChild(this.availibleArea);
  }

  get x() {
    return this.column;
  }

  get y() {
    return this.row;
  }

  getGameObject() {
    return this.gameObject;
  }

  setAvailible() {
    this.availible = true;
    this.availibleArea.alpha = 1;
  }

  removeAvailible() {
    this.availible = false;
    this.availibleArea.alpha = 0;
  }

  setGameObject(gameObject: GameObject) {
    this.gameObject = gameObject;
  }

  removeGameObject() {
    this.gameObject = null;
  }
}
