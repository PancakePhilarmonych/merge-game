import { Colors } from '@/utils';

export interface GoalItem {
  color: Colors;
  level: number;
  completed: boolean;
}

export default class Goal {
  private goals: GoalItem[] = [];

  constructor() {
    this.generateGoals();
  }

  private generateGoals(): void {
    const availableColors = [Colors.RED, Colors.YELLOW, Colors.BLUE];
    const goalCount = 2;
    let hasLevel4 = false; // отслеживаем, есть ли уже плитка уровня 5 (значение 16)

    for (let i = 0; i < goalCount; i++) {
      const color = availableColors[Math.floor(Math.random() * availableColors.length)];

      let level: number;
      if (hasLevel4) {
        level = Math.floor(Math.random() * 2) + 2;
      } else {
        level = Math.floor(Math.random() * 2) + 3;
        if (level === 5) {
          hasLevel4 = true;
        }
      }

      this.goals.push({
        color,
        level,
        completed: false,
      });
    }
  }

  public checkAndMarkCompleted(color: Colors, level: number): boolean {
    const goal = this.goals.find(g => g.color === color && g.level === level && !g.completed);

    if (goal) {
      goal.completed = true;
      return true;
    }

    return false;
  }

  public isAllCompleted(): boolean {
    return this.goals.every(goal => goal.completed);
  }

  public getGoals(): GoalItem[] {
    return [...this.goals];
  }

  public getProgress(): { completed: number; total: number } {
    const completed = this.goals.filter(g => g.completed).length;
    return { completed, total: this.goals.length };
  }

  public reset(): void {
    this.goals = [];
    this.generateGoals();
  }
}
