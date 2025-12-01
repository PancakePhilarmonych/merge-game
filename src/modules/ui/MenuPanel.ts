import * as PIXI from 'pixi.js';
import { createText } from '@/utils/graphics';
import { getAvailibleHeight, getTotalGameHeight } from '@/utils';

export default class MenuPanel extends PIXI.Container {
  public panelContainer: PIXI.Container;

  constructor() {
    super();

    this.panelContainer = new PIXI.Container();
    this.panelContainer.zIndex = 100;
    this.panelContainer.visible = false;
    this.addChild(this.panelContainer);

    this.createBackground();
    this.centerPanel();
  }

  private createBackground(): void {
    const background = new PIXI.Graphics();
    background.beginFill(0x1e3a5f);
    background.drawRect(0, 0, getAvailibleHeight(), getTotalGameHeight());
    background.endFill();
    this.panelContainer.addChild(background);
  }

  protected createButton(text: string, yPosition: number, color: number): PIXI.Container {
    const size = getAvailibleHeight();
    const buttonWidth = size * 0.5;
    const buttonHeight = size * 0.16;
    const radius = 15;

    const button = new PIXI.Container();

    const shadow = new PIXI.Graphics();
    shadow.beginFill(0x000000, 0.3);
    shadow.drawRoundedRect(4, 4, buttonWidth, buttonHeight, radius);
    shadow.endFill();

    const background = new PIXI.Graphics();
    background.beginFill(color);
    background.drawRoundedRect(0, 0, buttonWidth, buttonHeight, radius);
    background.endFill();

    const border = new PIXI.Graphics();
    border.lineStyle(3, 0xffffff, 0.8);
    border.drawRoundedRect(0, 0, buttonWidth, buttonHeight, radius);

    const buttonText = createText({
      text,
      size: 50,
    });
    buttonText.anchor.set(0.5);
    buttonText.x = buttonWidth / 2;
    buttonText.y = buttonHeight / 2;

    button.addChild(shadow, background, border, buttonText);
    button.x = size / 2 - buttonWidth / 2;
    button.y = yPosition;
    button.eventMode = 'dynamic';
    button.cursor = 'pointer';

    return button;
  }

  protected createTitle(text: string, size: number = 80): PIXI.Text {
    const title = createText({
      text,
      size,
    });
    title.anchor.set(0.5, 0.5);
    title.x = getAvailibleHeight() / 2;
    title.y = getTotalGameHeight() * 0.25;
    return title;
  }

  private centerPanel(): void {
    const mainHeight = getAvailibleHeight();
    const screenWidth = window.innerWidth;

    if (screenWidth > mainHeight) {
      this.panelContainer.x = (screenWidth - mainHeight) / 2;
    } else {
      this.panelContainer.x = 0;
    }
  }

  public show(): void {
    this.panelContainer.visible = true;
  }

  public hide(): void {
    this.panelContainer.visible = false;
  }

  public resize(): void {
    this.panelContainer.removeChildren();
    this.createBackground();
    this.centerPanel();
  }
}
