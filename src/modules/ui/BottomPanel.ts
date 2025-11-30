import * as PIXI from 'pixi.js';
import { getBottomUIHeight, getAvailibleHeight, getTotalGameHeight } from '@/utils';
import UIPanel from './UIPanel';

export default class BottomPanel extends UIPanel {
  private infoText: PIXI.Text;
  private infoTimeout: NodeJS.Timeout | null = null;

  constructor() {
    const height = getBottomUIHeight();
    super({ height, yPosition: window.innerHeight - height });

    const gameSize = getAvailibleHeight();
    const fontSize = Math.min(height * 0.4, gameSize * 0.05);

    this.infoText = this.createCenteredText('Press "R" to restart', fontSize);
    this.infoText.y = height / 2;

    this.addChild(this.infoText);
  }

  public resize(): void {
    const height = getBottomUIHeight();
    const gameSize = getAvailibleHeight();

    this.resizeBackground(gameSize, height);

    const fontSize = Math.min(height * 0.4, gameSize * 0.05);
    const currentText = this.infoText.text;

    this.removeChild(this.infoText);

    this.infoText = this.createCenteredText(currentText, fontSize);
    this.infoText.y = height / 2;

    this.addChild(this.infoText);

    this.updatePosition(getTotalGameHeight() - height);
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
