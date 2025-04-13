import * as PIXI from 'pixi.js';
import { getTopUIHeight, getMaxAvailibleSideSize } from '@/utils';

export default class ScorePanel extends PIXI.Container {
  private scoreText: PIXI.Text;
  private score: number = 0;
  private background: PIXI.Graphics;

  constructor() {
    super();

    const width = window.innerWidth;
    const height = getTopUIHeight();
    const gameSize = getMaxAvailibleSideSize();

    this.background = new PIXI.Graphics()
      .beginFill(0x1f322f, 0.9)
      .drawRect(0, 0, gameSize, height)
      .endFill();

    this.scoreText = new PIXI.Text(`Score: ${this.score}`, {
      fontFamily: 'Titan One',
      fontSize: Math.min(height * 0.5, gameSize * 0.05),
      fill: 0xffffff,
      align: 'center',
    });

    this.scoreText.anchor.set(0.5);
    this.scoreText.x = gameSize / 2;
    this.scoreText.y = height / 2;

    this.addChild(this.background);
    this.addChild(this.scoreText);

    this.x = (width - gameSize) / 2;
    this.y = 0;
  }

  public setScore(score: number) {
    this.score = score;
    this.scoreText.text = `Score: ${this.score}`;
  }

  public resize() {
    const width = window.innerWidth;
    const height = getTopUIHeight();
    const gameSize = getMaxAvailibleSideSize();

    this.background.clear();
    this.background.beginFill(0x1f322f, 0.9);
    this.background.drawRect(0, 0, gameSize, height);
    this.background.endFill();

    const fontSize = Math.min(height * 0.5, gameSize * 0.05);

    this.removeChild(this.scoreText);

    this.scoreText = new PIXI.Text(`Score: ${this.score}`, {
      fontFamily: 'Titan One',
      fontSize: fontSize,
      fill: 0xffffff,
      align: 'center',
    });

    this.scoreText.anchor.set(0.5);
    this.scoreText.x = gameSize / 2;
    this.scoreText.y = height / 2;

    this.addChild(this.scoreText);

    this.x = (width - gameSize) / 2;
  }
}
