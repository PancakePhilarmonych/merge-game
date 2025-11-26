import * as PIXI from 'pixi.js';
import { Tile } from '@/modules/core/Tile';
import { createSqareGraphics } from '@/utils/graphics';
import { PALETTE } from '@/config/colors';

export default class Cell extends PIXI.Container {
  private static readonly AVAILABLE_AREA_PADDING_PERCENT = 20;
  private static readonly BORDER_WIDTH_PERCENT = 4;

  public sprite: PIXI.Sprite;
  public availibleArea: PIXI.Graphics;
  public availible: boolean = false;
  private row: number;
  private column: number;
  private tile: Tile | null = null;

  constructor(x: number, y: number, size: number) {
    super();
    this.column = x;
    this.row = y;

    const cellCount = x + y;
    if (cellCount % 2 === 0) {
      this.sprite = PIXI.Sprite.from('grass-tile');
    } else {
      this.sprite = PIXI.Sprite.from('grass-tile-second');
    }

    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * x;
    this.sprite.y = size * y;
    this.sprite.zIndex = 1;

    this.availibleArea = createSqareGraphics({
      width: size,
      height: size,
      color: PALETTE.WHITE,
      offset: size * (Cell.AVAILABLE_AREA_PADDING_PERCENT / 100),
      radius: size * 0.05,
      borderSize: (size / 100) * 4,
      transparentType: 'strong',
    });

    this.availibleArea.x = size * x;
    this.availibleArea.y = size * y;
    this.availibleArea.alpha = 0;
    this.availibleArea.zIndex = 3;

    this.addChild(this.sprite);
    this.addChild(this.availibleArea);
  }

  get x() {
    return this.column;
  }

  get y() {
    return this.row;
  }

  getTile() {
    return this.tile;
  }

  setAvailible() {
    this.availible = true;
    this.availibleArea.alpha = 1;
  }

  removeAvailible() {
    this.availible = false;
    this.availibleArea.alpha = 0;
  }

  setTile(tile: Tile) {
    this.tile = tile;
  }

  removeTile() {
    this.tile = null;
  }

  public resize(size: number) {
    this.sprite.width = size;
    this.sprite.height = size;
    this.sprite.x = size * this.column;
    this.sprite.y = size * this.row;

    const currentAlpha = this.availibleArea.alpha;

    this.removeChild(this.availibleArea);

    this.availibleArea = createSqareGraphics({
      width: size,
      height: size,
      color: PALETTE.WHITE,
      offset: size * (Cell.AVAILABLE_AREA_PADDING_PERCENT / 100),
      radius: size * 0.05,
      borderSize: (size / 100) * Cell.BORDER_WIDTH_PERCENT,
      transparentType: 'strong',
    });
    this.availibleArea.x = size * this.column;
    this.availibleArea.y = size * this.row;

    this.availibleArea.alpha = currentAlpha;
    this.availibleArea.zIndex = 3;

    this.addChild(this.availibleArea);

    this.tile?.resize(size);
  }
}
