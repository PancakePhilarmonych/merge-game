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

  constructor(x: number, y: number, cellSize: number) {
    super();
    this.column = x;
    this.row = y;

    const cellCount = x + y;
    if (cellCount % 2 === 0) {
      this.sprite = PIXI.Sprite.from('grass-tile');
    } else {
      this.sprite = PIXI.Sprite.from('grass-tile-second');
    }

    this.sprite.width = cellSize;
    this.sprite.height = cellSize;
    this.sprite.x = cellSize * x;
    this.sprite.y = cellSize * y;
    this.sprite.zIndex = 1;

    this.availibleArea = createSqareGraphics({
      width: cellSize,
      height: cellSize,
      color: PALETTE.WHITE,
      offset: cellSize * (Cell.AVAILABLE_AREA_PADDING_PERCENT / 100),
      radius: cellSize * 0.05,
      borderSize: (cellSize / 100) * 4,
      transparentType: 'strong',
    });

    this.availibleArea.x = cellSize * x;
    this.availibleArea.y = cellSize * y;
    this.availibleArea.alpha = 0;
    this.availibleArea.zIndex = 1;

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

  public resize(newSize: number) {
    this.sprite.width = newSize;
    this.sprite.height = newSize;
    this.sprite.x = newSize * this.column;
    this.sprite.y = newSize * this.row;

    const currentAlpha = this.availibleArea.alpha;

    this.removeChild(this.availibleArea);

    this.availibleArea = createSqareGraphics({
      width: newSize,
      height: newSize,
      color: PALETTE.WHITE,
      offset: newSize * (Cell.AVAILABLE_AREA_PADDING_PERCENT / 100),
      radius: newSize * 0.05,
      borderSize: (newSize / 100) * Cell.BORDER_WIDTH_PERCENT,
      transparentType: 'strong',
    });
    this.availibleArea.x = newSize * this.column;
    this.availibleArea.y = newSize * this.row;

    this.availibleArea.alpha = currentAlpha;
    this.availibleArea.zIndex = 1;

    this.addChild(this.availibleArea);

    this.tile?.resize(newSize);
  }
}
