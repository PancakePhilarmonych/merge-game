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
  private restartButton: PIXI.Container;
  private barHeight: number;
  private timeLeft: number = GAME_DURATION;
  private maxTime: number = GAME_DURATION;

  constructor() {
    super();

    const availableWidth = getAvailibleHeight();
    this.barHeight = getTopUIHeight() * 0.4;

    this.background = new PIXI.Graphics();
    this.glow = new PIXI.Graphics();
    this.progressBar = new PIXI.Graphics();
    this.border = new PIXI.Graphics();

    const buttonSize = this.barHeight * 0.8;
    const gap = this.barHeight * 2;
    const timerWidth = availableWidth - buttonSize - gap;

    this.drawBackground(timerWidth);
    this.drawGlow(timerWidth);
    this.drawProgressBar(timerWidth, 1);

    this.timeText = this.createTimeText(timerWidth);
    this.restartButton = this.createRestartButton(buttonSize, timerWidth + gap);

    this.addChild(this.background);
    this.addChild(this.glow);
    this.addChild(this.progressBar);
    this.addChild(this.border);
    this.addChild(this.timeText);
    this.addChild(this.restartButton);

    const screenWidth = window.innerWidth;
    this.x = (screenWidth - availableWidth) / 2;
    this.y = getTopUIHeight() / 2 - this.barHeight / 2;
  }

  private createTimeText(timerWidth: number): PIXI.Text {
    const fontSize = Math.min(this.barHeight * 0.6, window.innerHeight * 0.025);
    const text = new PIXI.Text(`Time: ${this.timeLeft}s`, {
      fontFamily: 'Titan One',
      fontSize: fontSize,
      fill: PALETTE.WHITE,
      align: 'center',
    });
    text.anchor.set(0.5);
    text.x = timerWidth / 2;
    text.y = this.barHeight / 2;
    return text;
  }

  private createRestartButton(buttonSize: number, xPosition: number): PIXI.Container {
    const buttonContainer = new PIXI.Container();

    const background = new PIXI.Graphics();
    background.beginFill(PALETTE.BUTTON_PRIMARY, 0.9);
    background.drawRoundedRect(0, 0, buttonSize, buttonSize, buttonSize / 4);
    background.endFill();

    const border = new PIXI.Graphics();
    border.lineStyle(2, PALETTE.WHITE, 0.8);
    border.drawRoundedRect(0, 0, buttonSize, buttonSize, buttonSize / 4);

    const iconSize = buttonSize * 0.5;
    const icon = new PIXI.Graphics();
    icon.beginFill(PALETTE.WHITE);
    icon.drawCircle(0, 0, iconSize * 0.15);
    icon.endFill();
    icon.lineStyle(iconSize * 0.12, PALETTE.WHITE);
    icon.arc(0, 0, iconSize * 0.3, -Math.PI * 0.7, Math.PI * 0.7);

    icon.beginFill(PALETTE.WHITE);
    icon.moveTo(iconSize * 0.1, -iconSize * 0.3);
    icon.lineTo(iconSize * 0.35, -iconSize * 0.3);
    icon.lineTo(iconSize * 0.1, -iconSize * 0.55);
    icon.closePath();
    icon.endFill();

    icon.x = buttonSize / 2;
    icon.y = buttonSize / 2;

    buttonContainer.addChild(background, border, icon);
    buttonContainer.x = xPosition;
    buttonContainer.y = (this.barHeight - buttonSize) / 2;

    buttonContainer.eventMode = 'dynamic';
    buttonContainer.cursor = 'pointer';

    buttonContainer.on('pointerdown', () => {
      this.emit('mg-restart', this);
    });

    buttonContainer.on('pointerover', () => {
      background.tint = 0xdddddd;
    });

    buttonContainer.on('pointerout', () => {
      background.tint = 0xffffff;
    });

    return buttonContainer;
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
    const availableWidth = getAvailibleHeight();
    const buttonSize = this.barHeight * 0.8;
    const gap = this.barHeight * 2;
    const timerWidth = availableWidth - buttonSize - gap;
    const progress = Math.max(0, this.timeLeft / this.maxTime);
    this.drawProgressBar(timerWidth, progress);
    this.timeText.text = `Time: ${this.timeLeft}s`;
  }

  public resize(): void {
    const availableWidth = getAvailibleHeight();
    const screenWidth = window.innerWidth;
    this.barHeight = getTopUIHeight() * 0.4;

    const buttonSize = this.barHeight * 0.8;
    const gap = this.barHeight * 2;
    const timerWidth = availableWidth - buttonSize - gap;

    this.drawBackground(timerWidth);
    this.drawGlow(timerWidth);
    const progress = Math.max(0, this.timeLeft / this.maxTime);
    this.drawProgressBar(timerWidth, progress);

    this.removeChild(this.timeText);
    this.timeText = this.createTimeText(timerWidth);
    this.addChild(this.timeText);

    this.removeChild(this.restartButton);
    this.restartButton = this.createRestartButton(buttonSize, timerWidth + gap);
    this.addChild(this.restartButton);

    this.x = (screenWidth - availableWidth) / 2;
    this.y = getTopUIHeight() / 2 - this.barHeight / 2;
  }

  public reset(): void {
    this.timeLeft = this.maxTime;
    const availableWidth = getAvailibleHeight();
    const buttonSize = this.barHeight * 0.8;
    const gap = this.barHeight * 2;
    const timerWidth = availableWidth - buttonSize - gap;
    this.drawProgressBar(timerWidth, 1);
    this.timeText.text = `Time: ${this.timeLeft}s`;
  }
}
