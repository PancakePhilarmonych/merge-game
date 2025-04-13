import * as PIXI from 'pixi.js';
import { getTopUIHeight, getMaxAvailibleSideSize } from '@/utils';

export default class ScorePanel extends PIXI.Container {
  private scoreText: PIXI.Text;
  private score: number = 0;
  private background: PIXI.Graphics;
  private readonly BORDER_RADIUS = 10;
  private readonly BORDER_WIDTH = 4;
  private readonly PANEL_MARGIN = 5;

  constructor() {
    super();

    const width = window.innerWidth;
    const height = getTopUIHeight();
    const gameSize = getMaxAvailibleSideSize();

    this.background = new PIXI.Graphics()
      .lineStyle(this.BORDER_WIDTH, 0xffffff)
      .beginFill(0x1f322f, 0.9)
      .drawRoundedRect(0, 10, gameSize, height - 20, this.BORDER_RADIUS)
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
    this.y = 0; // Поместим панель в самый верх
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
    this.background.lineStyle(this.BORDER_WIDTH, 0xffffff);
    this.background.beginFill(0x1f322f, 0.9);
    this.background.drawRoundedRect(2, 10, gameSize - 4, height - 20, this.BORDER_RADIUS);
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
    this.y = 0; // Поместим панель в самый верх
  }
}
