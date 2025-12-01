import * as PIXI from 'pixi.js';
import { getAvailibleHeight, getBottomUIHeight, getHexColorByColor } from '@/utils';
import { PALETTE } from '@/config/colors';
import { createSqareGraphics } from '@/utils/graphics';
import UIPanel from './UIPanel';
import type { GoalItem } from '@/modules/core/Goal';

export default class GoalPanel extends UIPanel {
  private goalItems: PIXI.Container[] = [];
  private titleText: PIXI.Text | null = null;

  constructor() {
    const height = getBottomUIHeight();
    super({ height, yPosition: window.innerHeight - height });
    this.createTitle();
  }

  private createTitle(): void {
    const height = getBottomUIHeight();
    const fontSize = Math.min(height * 0.2, 24);

    this.titleText = new PIXI.Text('Goals:', {
      fontFamily: 'Titan One',
      fontSize: fontSize,
      fill: PALETTE.WHITE,
      align: 'center',
    });
    this.titleText.anchor.set(0.5, 0);
    this.titleText.x = getAvailibleHeight() / 2;
    this.titleText.y = height * 0.05;

    this.addChild(this.titleText);
  }

  public updateGoals(goals: GoalItem[]): void {
    this.clearGoalItems();

    const width = getAvailibleHeight();
    const height = getBottomUIHeight();
    const itemSize = Math.min(height * 0.65, width / 4); // уменьшено, чтобы оставить место для заголовка
    const spacing = itemSize * 0.2;
    const totalWidth = goals.length * itemSize + (goals.length - 1) * spacing;
    const startX = (width - totalWidth) / 2;

    goals.forEach((goal, index) => {
      const item = this.createGoalItem(goal, itemSize);
      item.x = startX + index * (itemSize + spacing);
      item.y = height * 0.3; // размещаем ниже заголовка

      this.goalItems.push(item);
      this.addChild(item);
    });
  }

  private createGoalItem(goal: GoalItem, size: number): PIXI.Container {
    const container = new PIXI.Container();
    const PADDING_PERCENT = 40;
    const offset = size * (PADDING_PERCENT / 100);

    // Используем тот же стиль, что и игровые плитки
    const bg = createSqareGraphics({
      width: size,
      height: size,
      offset: offset,
      color: goal.completed ? PALETTE.BUTTON_SUCCESS : (getHexColorByColor(goal.color) as number),
      radius: size * 0.05,
      borderSize: (size / 100) * 4,
    });

    container.addChild(bg);

    if (goal.completed) {
      // Показываем галочку
      const checkmark = new PIXI.Text('✓', {
        fontFamily: 'Arial',
        fontSize: size * 0.5,
        fill: PALETTE.WHITE,
        align: 'center',
        fontWeight: 'bold',
      });
      checkmark.anchor.set(0.5);
      checkmark.x = size / 2;
      checkmark.y = size / 2;
      container.addChild(checkmark);
    } else {
      // Показываем требуемое значение
      const levelValue = Math.pow(2, goal.level - 1);
      const text = new PIXI.Text(levelValue.toString(), {
        fontFamily: 'Titan One',
        fontSize: size * 0.3,
        fill: PALETTE.WHITE,
        align: 'center',
      });
      text.anchor.set(0.5);
      text.x = size / 2;
      text.y = size / 2;
      container.addChild(text);
    }

    return container;
  }

  private clearGoalItems(): void {
    this.goalItems.forEach(item => {
      this.removeChild(item);
      item.destroy({ children: true });
    });
    this.goalItems = [];
  }

  public resize(): void {
    const height = getBottomUIHeight();
    const width = getAvailibleHeight();

    this.resizeBackground(width, height);
    this.updatePosition(window.innerHeight - height);

    if (this.titleText) {
      this.removeChild(this.titleText);
      this.titleText.destroy();
    }
    this.createTitle();
  }
}
