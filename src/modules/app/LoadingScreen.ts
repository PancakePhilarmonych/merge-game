import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export default class LoadingScreen extends PIXI.Container {
  private bg!: PIXI.Graphics;
  private progressBarBg!: PIXI.Graphics;
  private progressBar!: PIXI.Graphics;
  private loadingText!: PIXI.Text;
  private maxBarWidth: number = 400;

  constructor(width: number, height: number) {
    super();

    this.createBackground(width, height);
    this.createProgressBar(width, height);
    this.createText(width, height);

    this.zIndex = 1000;
    this.visible = false;
  }

  private createBackground(width: number, height: number): void {
    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0x000000, 0.9);
    this.bg.drawRect(0, 0, width, height);
    this.bg.endFill();
    this.addChild(this.bg);
  }

  private createProgressBar(width: number, height: number): void {
    const barHeight = 20;
    const x = (width - this.maxBarWidth) / 2;
    const y = height / 2;

    // Фон прогресс-бара
    this.progressBarBg = new PIXI.Graphics();
    this.progressBarBg.beginFill(0x333333);
    this.progressBarBg.drawRoundedRect(x, y, this.maxBarWidth, barHeight, 10);
    this.progressBarBg.endFill();
    this.addChild(this.progressBarBg);

    // Сам прогресс-бар
    this.progressBar = new PIXI.Graphics();
    this.progressBar.beginFill(0xf5cd79);
    this.progressBar.drawRoundedRect(x, y, 0, barHeight, 10);
    this.progressBar.endFill();
    this.addChild(this.progressBar);
  }

  private createText(width: number, height: number): void {
    this.loadingText = new PIXI.Text('💿', {
      fontSize: 32,
      fill: 0xffffff,
      fontFamily: 'Arial',
      align: 'center',
    });

    this.loadingText.anchor.set(0.5);
    this.loadingText.x = width / 2;
    this.loadingText.y = height / 2 - 50;
    this.addChild(this.loadingText);
  }

  public updateProgress(progress: number): void {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const targetWidth = clampedProgress * this.maxBarWidth;
    const barHeight = 20;
    const x = (window.innerWidth - this.maxBarWidth) / 2;
    const y = window.innerHeight / 2;

    this.progressBar.clear();
    this.progressBar.beginFill(0xf5cd79);
    this.progressBar.drawRoundedRect(x, y, targetWidth, barHeight, 10);
    this.progressBar.endFill();

    this.loadingText.text = `💿💿💿`;
  }

  public show(): void {
    this.visible = true;
    this.alpha = 0;
    gsap.to(this, {
      alpha: 1,
      duration: 0.3,
    });
  }

  public hide(): void {
    gsap.to(this, {
      alpha: 0,
      duration: 0.3,
      onComplete: () => {
        this.visible = false;
        this.destroy();
      },
    });
  }

  public resize(width: number, height: number): void {
    this.bg.clear();
    this.bg.beginFill(0x000000, 0.9);
    this.bg.drawRect(0, 0, width, height);
    this.bg.endFill();

    const x = (width - this.maxBarWidth) / 2;
    const y = height / 2;

    this.progressBarBg.x = x;
    this.progressBarBg.y = y;
    this.progressBar.x = x;
    this.progressBar.y = y;

    this.loadingText.x = width / 2;
    this.loadingText.y = height / 2 - 50;
  }
}
