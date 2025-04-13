import * as PIXI from 'pixi.js';
import { getBottomUIHeight, getMaxAvailibleSideSize, getTotalGameHeight } from '@/utils';

export default class BottomPanel extends PIXI.Container {
  private background: PIXI.Graphics;
  private infoText: PIXI.Text;
  private infoTimeout: NodeJS.Timeout | null = null;
  private readonly BORDER_RADIUS = 10;
  private readonly BORDER_WIDTH = 4;
  private readonly PANEL_MARGIN = 5;

  constructor() {
    super();

    const width = window.innerWidth;
    const height = getBottomUIHeight();
    const gameSize = getMaxAvailibleSideSize();

    this.background = new PIXI.Graphics()
      .lineStyle(this.BORDER_WIDTH, 0xffffff)
      .beginFill(0x1f322f, 0.9)
      .drawRoundedRect(0, 10, gameSize, height - 20, this.BORDER_RADIUS)
      .endFill();

    this.infoText = new PIXI.Text('Press "R" to restart', {
      fontFamily: 'Titan One',
      fontSize: Math.min(height * 0.4, gameSize * 0.05),
      fill: 0xffffff,
      align: 'center',
    });

    this.infoText.anchor.set(0.5);
    this.infoText.x = gameSize / 2;
    this.infoText.y = height / 2;

    this.addChild(this.background);
    this.addChild(this.infoText);

    this.x = (width - gameSize) / 2;
    this.y = window.innerHeight - height;
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = getBottomUIHeight();
    const gameSize = getMaxAvailibleSideSize();

    this.background.clear();
    this.background.lineStyle(this.BORDER_WIDTH, '#00b894');
    this.background.beginFill(0x1f322f, 0.9);
    this.background.drawRoundedRect(2, 10, gameSize - 4, height - 20, this.BORDER_RADIUS);
    this.background.endFill();

    const fontSize = Math.min(height * 0.4, gameSize * 0.05);

    const currentText = this.infoText.text;

    this.removeChild(this.infoText);

    this.infoText = new PIXI.Text(currentText, {
      fontFamily: 'Titan One',
      fontSize: fontSize,
      fill: 0xffffff,
      align: 'center',
    });

    this.infoText.anchor.set(0.5);
    this.infoText.x = gameSize / 2;
    this.infoText.y = height / 2;

    this.addChild(this.infoText);

    this.x = (width - gameSize) / 2;
    this.y = getTotalGameHeight() - height;
  }

  private setInfoText(text: string): void {
    this.infoText.text = text;

    const maxWidth = this.background.width * 0.9;
    if (this.infoText.width > maxWidth) {
      const scale = maxWidth / this.infoText.width;
      this.infoText.scale.set(scale);
    } else {
      this.infoText.scale.set(1);
    }
  }

  public updateInfoText(text: string, debounce = 0): void {
    if (this.infoTimeout) {
      clearTimeout(this.infoTimeout);
      this.infoTimeout = null;
    }

    if (debounce > 0) {
      this.infoTimeout = setTimeout(() => {
        this.setInfoText(text);
      }, debounce);
    } else {
      this.setInfoText(text);
    }
  }
}
