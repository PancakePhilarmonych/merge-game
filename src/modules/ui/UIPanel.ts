import * as PIXI from 'pixi.js';
import { getAvailibleHeight } from '@/utils';
import { PALETTE } from '@/config/colors';

interface UIPanelOptions {
  height: number;
  yPosition: number;
}

export default class UIPanel extends PIXI.Container {
  protected background: PIXI.Graphics;
  protected readonly BORDER_RADIUS = 4;
  protected readonly BORDER_WIDTH = 4;

  constructor(options: UIPanelOptions) {
    super();

    const width = window.innerWidth;
    const mainHeight = getAvailibleHeight();

    this.background = this.createBackground(mainHeight, options.height);

    this.addChild(this.background);

    this.x = (width - mainHeight) / 2;
    this.y = options.yPosition;
  }

  protected createBackground(mainHeight: number, height: number): PIXI.Graphics {
    return new PIXI.Graphics()
      .lineStyle(this.BORDER_WIDTH, PALETTE.BORDER)
      .beginFill(PALETTE.BACKGROUND_OVERLAY, 1)
      .drawRoundedRect(0, 10, mainHeight, height - 20, this.BORDER_RADIUS)
      .endFill();
  }

  protected resizeBackground(mainHeight: number, height: number): void {
    this.background.clear();
    this.background.lineStyle(this.BORDER_WIDTH, PALETTE.BORDER);
    this.background.beginFill(PALETTE.BACKGROUND_OVERLAY, 0.9);
    this.background.drawRoundedRect(2, 10, mainHeight - 4, height - 20, this.BORDER_RADIUS);
    this.background.endFill();
  }

  protected createCenteredText(text: string, fontSize: number): PIXI.Text {
    const mainHeight = getAvailibleHeight();
    const textElement = new PIXI.Text(text, {
      fontFamily: 'Titan One',
      fontSize: fontSize,
      fill: PALETTE.TEXT_PRIMARY,
      align: 'center',
    });

    textElement.anchor.set(0.5);
    textElement.x = mainHeight / 2;

    return textElement;
  }

  protected updatePosition(yPosition: number): void {
    const width = window.innerWidth;
    const mainHeight = getAvailibleHeight();

    this.x = (width - mainHeight) / 2;
    this.y = yPosition;
  }
}
