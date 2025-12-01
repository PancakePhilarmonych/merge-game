import * as PIXI from 'pixi.js';
import { getAvailibleHeight, getTopUIHeight } from '@/utils';
import { PALETTE } from '@/config/colors';
import { GAME_DURATION } from '@/config/constants';

export default class TimerBar extends PIXI.Container {
  private background: PIXI.Graphics;
  private progressBar: PIXI.Graphics;
  private border: PIXI.Graphics;
  private glow: PIXI.Graphics;
  private timeText: PIXI.Text;
  private barHeight: number;
  private timeLeft: number = GAME_DURATION;
  private maxTime: number = GAME_DURATION;

  constructor() {
    super();

    const width = getAvailibleHeight();
    this.barHeight = getTopUIHeight() / 2;

    this.background = new PIXI.Graphics();
    this.glow = new PIXI.Graphics();
    this.progressBar = new PIXI.Graphics();
    this.border = new PIXI.Graphics();

    this.drawBackground(width);
    this.drawGlow(width);
    this.drawProgressBar(width, 1);

    this.timeText = this.createTimeText();

    this.addChild(this.background);
    this.addChild(this.glow);
    this.addChild(this.progressBar);
    this.addChild(this.border);
    this.addChild(this.timeText);

    const screenWidth = window.innerWidth;
    this.x = (screenWidth - width) / 2;
    this.y = getTopUIHeight() / 2 - this.barHeight / 2;
  }

  private createTimeText(): PIXI.Text {
    const fontSize = Math.min(this.barHeight * 0.6, window.innerHeight * 0.025);
    const text = new PIXI.Text(`Time: ${this.timeLeft}s`, {
      fontFamily: 'Titan One',
      fontSize: fontSize,
      fill: PALETTE.WHITE,
      align: 'center',
    });
    text.anchor.set(0.5);
    text.x = getAvailibleHeight() / 2;
    text.y = this.barHeight / 2;
    return text;
  }

  private drawBackground(width: number): void {
    const radius = this.barHeight / 2;
    this.background.clear();
    this.background.beginFill(PALETTE.GRAY_DARK, 0.8);
    this.background.drawRoundedRect(0, 0, width, this.barHeight, radius);
    this.background.endFill();
  }

  private drawGlow(width: number): void {
    const radius = this.barHeight / 2;
    const glowSize = 4;
    this.glow.clear();
    this.glow.lineStyle(glowSize, PALETTE.BUTTON_SUCCESS, 0.3);
    this.glow.drawRoundedRect(
      -glowSize / 2,
      -glowSize / 2,
      width + glowSize,
      this.barHeight + glowSize,
      radius + glowSize / 2,
    );
  }

  private drawProgressBar(width: number, progress: number): void {
    const radius = this.barHeight / 2;
    this.progressBar.clear();

    let color: number = PALETTE.BUTTON_SUCCESS;
    let glowColor: number = PALETTE.BUTTON_SUCCESS;

    if (progress <= 0.25) {
      color = PALETTE.DANGER;
      glowColor = PALETTE.DANGER;
    } else if (progress <= 0.5) {
      color = PALETTE.WARNING;
      glowColor = PALETTE.WARNING;
    }

    this.progressBar.beginFill(color, 0.9);
    this.progressBar.drawRoundedRect(0, 0, width * progress, this.barHeight, radius);
    this.progressBar.endFill();

    this.glow.clear();
    this.glow.lineStyle(4, glowColor, 0.4);
    this.glow.drawRoundedRect(-2, -2, width + 4, this.barHeight + 4, radius + 2);
  }

  public setTimer(time: number): void {
    this.timeLeft = time;
    const width = getAvailibleHeight();
    const progress = Math.max(0, this.timeLeft / this.maxTime);
    this.drawProgressBar(width, progress);
    this.timeText.text = `Time: ${this.timeLeft}s`;
  }

  public resize(): void {
    const width = getAvailibleHeight();
    const screenWidth = window.innerWidth;
    this.barHeight = getTopUIHeight() / 2;

    this.drawBackground(width);
    this.drawGlow(width);
    const progress = Math.max(0, this.timeLeft / this.maxTime);
    this.drawProgressBar(width, progress);

    this.removeChild(this.timeText);
    this.timeText = this.createTimeText();
    this.addChild(this.timeText);

    this.x = (screenWidth - width) / 2;
    this.y = window.innerHeight / 20 - this.barHeight / 2;
  }

  public reset(): void {
    this.timeLeft = this.maxTime;
    const width = getAvailibleHeight();
    this.drawProgressBar(width, 1);
    this.timeText.text = `Time: ${this.timeLeft}s`;
  }
}
