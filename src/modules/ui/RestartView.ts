import * as PIXI from 'pixi.js';
import { createSqareGraphics, createText } from '@/utils/graphics';
import { getAvailibleHeight, getTotalGameHeight, getHexColorByColor } from '@/utils';
import MenuPanel from './MenuPanel';
import { GoalItem } from '@/modules/core/Goal';

export default class RestartView extends MenuPanel {
  private isVictory = false;
  private goals: GoalItem[] = [];

  constructor() {
    super();
  }

  public setGameResult(isVictory: boolean, goals: GoalItem[]): void {
    this.isVictory = isVictory;
    this.goals = goals;
    this.updateContent();
  }

  private updateContent(): void {
    this.panelContainer.removeChildren();

    const background = new PIXI.Graphics();
    background.beginFill(this.isVictory ? 0x1b4d3e : 0x4a1c1c);
    background.drawRect(0, 0, getAvailibleHeight(), getTotalGameHeight());
    background.endFill();
    this.panelContainer.addChild(background);

    const title = this.isVictory ? 'Victory!' : 'Game Over';
    const titleColor = this.isVictory ? '#2ecc71' : '#e74c3c';
    const titleText = this.createTitle(title);
    titleText.style.fill = titleColor;
    this.panelContainer.addChild(titleText);

    this.panelContainer.addChild(this.createGoalsDisplay());
    this.panelContainer.addChild(this.createRestartButton());
  }

  private createGoalsDisplay(): PIXI.Container {
    const container = new PIXI.Container();
    const size = getAvailibleHeight();
    const itemSize = size * 0.12;
    const spacing = size * 0.02;
    const totalWidth = this.goals.length * itemSize + (this.goals.length - 1) * spacing;

    this.goals.forEach((goal, index) => {
      const goalItem = this.createGoalItem(goal, itemSize);
      goalItem.x = (size - totalWidth) / 2 + index * (itemSize + spacing);
      container.addChild(goalItem);
    });

    container.y = getTotalGameHeight() * 0.4;
    return container;
  }

  private createGoalItem(goal: GoalItem, size: number): PIXI.Container {
    const container = new PIXI.Container();

    const offset = size * 0.4;
    const radius = size * 0.05;
    const borderSize = size * 0.04;

    const color = goal.completed ? 0x4caf50 : getHexColorByColor(goal.color);

    const background = createSqareGraphics({
      width: size,
      height: size,
      color,
      offset,
      radius,
      borderSize,
    });

    container.addChild(background);

    const text = createText({
      text: goal.completed ? '✓' : String(Math.pow(2, goal.level - 1)),
      size: size * 0.35,
    });
    text.anchor.set(0.5);
    text.x = size / 2;
    text.y = size / 2;

    container.addChild(text);

    return container;
  }

  private createRestartButton(): PIXI.Container {
    const button = this.createButton('Restart', getTotalGameHeight() * 0.65, 0x3498db);

    button.on('pointerdown', () => {
      this.panelContainer.emit('mg-restart', this);
    });

    return button;
  }

  public override resize(): void {
    super.resize();
    if (this.goals.length > 0) {
      this.updateContent();
    }
  }
}
