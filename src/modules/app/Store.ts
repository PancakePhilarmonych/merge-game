export default class Store {
  private static readonly BEST_SCORE_KEY = 'best';

  private currentScore: number;
  private bestScore: number;

  constructor() {
    this.currentScore = 0;
    this.bestScore = this.loadBestScore();
  }

  private loadBestScore(): number {
    const bestFromStorage = localStorage.getItem(Store.BEST_SCORE_KEY);
    return bestFromStorage ? parseInt(bestFromStorage, 10) : 0;
  }

  public incrementScore(n: number = 1): void {
    this.currentScore += n;

    if (this.currentScore > this.bestScore) {
      this.bestScore = this.currentScore;
      this.saveBestScore();
    }
  }

  private saveBestScore(): void {
    localStorage.setItem(Store.BEST_SCORE_KEY, this.currentScore.toString());
  }

  public reset(): void {
    this.currentScore = 0;
    this.bestScore = this.loadBestScore();
  }

  public getScore(): number {
    return this.currentScore;
  }

  public getBestScore(): number {
    return this.bestScore;
  }

  public setBestScore(score: number): void {
    this.bestScore = score;
  }
}
