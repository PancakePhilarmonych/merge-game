import * as PIXI from 'pixi.js';
import { getTopUIHeight, getAvailibleHeight } from '@/utils';
import { PALETTE } from '@/config/colors';
import UIPanel from './UIPanel';

export default class ScorePanel extends UIPanel {
  private scoreText: PIXI.Text;
  private timerText: PIXI.Text;
  private score: number = 0;
  private timeLeft: number = 20;

  constructor() {
    const height = getTopUIHeight();
    super({ height, yPosition: 0 });

    const mainHeight = getAvailibleHeight();
    const fontSize = Math.min(height * 0.5, mainHeight * 0.05);

    this.scoreText = this.createCenteredText(`Score: ${this.score}`, fontSize);
    this.scoreText.y = height / 2;
    this.scoreText.x = mainHeight / 4;

    this.timerText = this.createCenteredText(`Time: ${this.timeLeft}`, fontSize);
    this.timerText.y = height / 2;
    this.timerText.x = (mainHeight / 4) * 3;

    this.addChild(this.scoreText);
    this.addChild(this.timerText);
  }

  public setScore(score: number) {
    this.score = score;
    this.scoreText.text = `Score: ${this.score}`;
  }

  public setTimer(time: number) {
    this.timeLeft = time;
    this.timerText.text = `Time: ${this.timeLeft}`;

    if (this.timeLeft <= 5) {
      this.timerText.style.fill = PALETTE.DANGER;
    } else if (this.timeLeft <= 10) {
      this.timerText.style.fill = PALETTE.WARNING;
    } else {
      this.timerText.style.fill = PALETTE.TEXT_PRIMARY;
    }
  }

  public resize() {
    const height = getTopUIHeight();
    const mainHeight = getAvailibleHeight();

    this.resizeBackground(mainHeight, height);

    const fontSize = Math.min(height * 0.5, mainHeight * 0.05);

    this.removeChild(this.scoreText);
    this.removeChild(this.timerText);

    this.scoreText = this.createCenteredText(`Score: ${this.score}`, fontSize);
    this.scoreText.y = height / 2;
    this.scoreText.x = mainHeight / 4;

    this.timerText = this.createCenteredText(`Time: ${this.timeLeft}`, fontSize);
    this.timerText.y = height / 2;
    this.timerText.x = (mainHeight / 4) * 3;

    this.addChild(this.scoreText);
    this.addChild(this.timerText);

    this.updatePosition(0);
  }
}
