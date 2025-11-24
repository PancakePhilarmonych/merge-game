import * as PIXI from 'pixi.js';
import { getTopUIHeight, getMaxAvailibleSideSize } from '@/utils';
import UIPanel from './UIPanel';

export default class ScorePanel extends UIPanel {
  private scoreText: PIXI.Text;
  private score: number = 0;

  constructor() {
    const height = getTopUIHeight();
    super({ height, yPosition: 0 });

    const gameSize = getMaxAvailibleSideSize();
    const fontSize = Math.min(height * 0.5, gameSize * 0.05);

    this.scoreText = this.createCenteredText(`Score: ${this.score}`, fontSize);
    this.scoreText.y = height / 2;

    this.addChild(this.scoreText);
  }

  public setScore(score: number) {
    this.score = score;
    this.scoreText.text = `Score: ${this.score}`;
  }

  public resize() {
    const height = getTopUIHeight();
    const gameSize = getMaxAvailibleSideSize();

    this.resizeBackground(gameSize, height);

    const fontSize = Math.min(height * 0.5, gameSize * 0.05);

    this.removeChild(this.scoreText);

    this.scoreText = this.createCenteredText(`Score: ${this.score}`, fontSize);
    this.scoreText.y = height / 2;

    this.addChild(this.scoreText);

    this.updatePosition(0);
  }
}
