import { Tile } from '@/modules/core/Tile';
import Grid from '@/modules/core/Grid';
import TileManager from '@/modules/app/TileManager';
import Store from '@/modules/app/Store';
import Cell from '@/modules/core/Cell';
import { Colors, smoothMoveTo, getRandomColor, getAvailibleHeight, getTopUIHeight } from '@/utils';
import TimerBar from '../ui/TimerBar';
import GoalPanel from '../ui/GoalPanel';
import RestartView from '@/modules/ui/RestartView';
import StartView from '@/modules/ui/StartView';
import Goal from '@/modules/core/Goal';
import { gsap } from 'gsap';
import App from '@/modules/app/App';
import {
  GAME_DURATION,
  NEW_OBJECT_DELAY,
  AVAILABLE_CELL_ALPHA,
  SELECTION_ALPHA,
  SELECTION_Z_INDEX,
} from '@/config/constants';

export default class GameManager {
  private app: App = new App();
  private store: Store = new Store();
  private timerBar: TimerBar = new TimerBar();
  private goalPanel: GoalPanel = new GoalPanel();
  private grid: Grid;
  private tileManager: TileManager;
  private goal: Goal = new Goal();

  private availibleCells: Cell[] = [];
  private availibleForMerge: Tile[] = [];
  private selectedTile: Tile | null = null;
  private pause = false;
  private restartView: RestartView;
  private startView: StartView;
  private timeLeft = GAME_DURATION;
  private timerInterval: NodeJS.Timeout | null = null;
  private tickerCallback: (() => void) | null = null;

  constructor() {
    this.restartView = new RestartView();
    this.startView = new StartView();
    this.grid = new Grid();

    this.tileManager = new TileManager(this.grid);
    this.tileManager.generateTiles();

    this.app.container.y = getTopUIHeight();

    this.app.addToContainer(this.tileManager.getTiles());
    this.app.addToContainer(this.grid.cellsContainers);

    this.app.addToStage(this.timerBar);
    this.app.addToStage(this.goalPanel);
    this.app.addToStage(this.startView);
    this.app.addToStage(this.restartView);

    this.goalPanel.updateGoals(this.goal.getGoals());

    this.setListeners();

    this.resize();
  }

  private resize() {
    const size = getAvailibleHeight();

    this.app.resize();
    this.grid.resize(size);
    this.tileManager.resize(this.grid.cellSize);

    this.app.container.y = getTopUIHeight();

    this.timerBar.resize();
    this.goalPanel.resize();

    this.startView.resize();
    this.restartView.resize();
  }

  private setListeners(): void {
    this.app.container.on('mg-select', (tile: Tile) => this.handleTileSelection(tile));

    this.restartView.panelContainer.on('mg-restart', () => this.restartGame());
    this.timerBar.on('mg-restart', () => this.restartGame());
    this.startView.panelContainer.on('mg-start', () => {
      this.startView.hide();
      this.startGame();
    });

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => this.resize());
  }

  private handleTileSelection(tile: Tile): void {
    if (this.pause) return;

    if (this.selectedTile === tile) {
      this.deselectTile(tile);
      return;
    }

    if (this.selectedTile) {
      this.selectedTile.selection.alpha = 0;
    }

    this.selectedTile = tile;
    this.cleanSteps();
    this.getAvailibleCellsAround(tile);
  }

  private deselectTile(tile: Tile): void {
    this.selectedTile = null;
    this.cleanSteps();
    tile.selection.alpha = 0;
  }

  private getAvailibleCellsAround(checkedTile: Tile): void {
    //TODO: write getSurroundingsCells function
    const tileCell = checkedTile.getCell();
    const up = this.grid.getCell(tileCell.x, tileCell.y + 1);
    const down = this.grid.getCell(tileCell.x, tileCell.y - 1);
    const left = this.grid.getCell(tileCell.x + 1, tileCell.y);
    const right = this.grid.getCell(tileCell.x - 1, tileCell.y);

    const surroundingCells = [up, down, left, right].filter(cell => cell !== null);

    surroundingCells.forEach((cell: Cell) => {
      const tile = cell.getTile();
      const sameColor = tile?.getColor() === checkedTile.getColor();
      const sameLevel = tile?.level === checkedTile.level;
      const isEmpty = tile === null;

      if (isEmpty) {
        this.availibleCells.push(cell);
      }

      if (sameColor && sameLevel) {
        this.availibleForMerge.push(tile);
        this.availibleCells.push(cell);
      }
    });

    this.availibleForMerge.forEach((tile: Tile) => {
      tile.setAvailibleForMerge();
      tile.on('pointerdown', () => {
        this.setTileToCell(checkedTile, tile.getCell());
      });
    });

    this.availibleCells.forEach((cell: Cell) => {
      cell.availibleArea.alpha = AVAILABLE_CELL_ALPHA;

      cell.availibleArea.zIndex = 1;
      cell.eventMode = 'dynamic';
      cell.cursor = 'pointer';
      cell.on('pointerdown', () => {
        this.setTileToCell(checkedTile, cell);
      });
    });
  }

  private addNewTile(cell: Cell, color: Colors, level: number): void {
    const newTile = this.tileManager.addTile(cell, color, level);

    this.app.container.addChild(newTile);

    gsap.from(newTile, {
      alpha: 0.0,
      duration: 0.3,
      ease: 'power2.out',
      y: cell.sprite.y - 40,

      onComplete: () => {
        newTile.setCell(cell);
        newTile.eventMode = 'dynamic';
      },
    });
  }

  private setTileToCell(tile: Tile, cell: Cell): void {
    const cellTile = cell.getTile();
    const cellSize = this.grid.cellSize;
    const cellX = cellSize * cell.x;
    const cellY = cellSize * cell.y;

    const scaleTo = 1.12 + 0.03 * tile.level;
    tile.animateScale(scaleTo, 0.22);

    if (cellTile) {
      if (cellTile === tile) {
        this.moveTileToOwnCell(tile);
        return;
      }

      const objectColor = tile.getColor();
      const cellObjectColor = cellTile.getColor();
      const objectLevel = tile.level;
      const cellObjectLevel = cellTile.level;

      const sameColor = objectColor === cellObjectColor;
      const sameLevel = objectLevel === cellObjectLevel;
      const sameColorAndLevel = sameColor && sameLevel;

      if (sameColorAndLevel) {
        this.moveTileToMatchedCell(tile, cell);
        return;
      }

      this.moveTileToOwnCell(tile);
      return;
    }

    tile.selection.alpha = 0;
    tile.selection.zIndex = 1;
    tile.getCell().removeTile();
    cell.setTile(tile);
    smoothMoveTo(tile, cellX, cellY, 0.5);
    tile.setCell(cell);
    this.selectedTile = tile;

    this.cleanSteps();
    this.addNewTileToRandomCell();

    this.cleanSteps();
    this.getAvailibleCellsAround(tile);

    this.selectedTile.selection.alpha = 0;
    this.selectedTile = null;
    this.cleanSteps();
  }

  addNewTileToRandomCell(level = 1): void {
    const randomEmptyCell = this.tileManager.getRandomEmptyCell();

    if (randomEmptyCell) {
      setTimeout(() => {
        this.addNewTile(randomEmptyCell, getRandomColor(true), level);
      }, NEW_OBJECT_DELAY);
    }
  }

  moveTileToOwnCell(tile: Tile): void {
    const cellSize = this.grid.cellSize;
    const objectCell = tile.getCell()!;

    const objectCellX = cellSize * objectCell.x;
    const objectCellY = cellSize * objectCell.y;

    smoothMoveTo(tile, objectCellX, objectCellY, 0.5);
    tile.selection.alpha = SELECTION_ALPHA;
    tile.selection.zIndex = SELECTION_Z_INDEX;
    this.selectedTile = tile;

    this.selectedTile.selection.alpha = 0;
    this.selectedTile = null;
    this.cleanSteps();
  }

  moveTileToMatchedCell(tile: Tile, cell: Cell): void {
    const cellTile = cell.getTile() || null;
    if (!cellTile) return;

    const cellSize = this.grid.cellSize;
    const cellX = cellSize * cell.x;
    const cellY = cellSize * cell.y;

    if (cellTile) {
      const scaleTo = 1.18 + 0.04 * cellTile.level;
      cellTile.animateScale(scaleTo, 0.28);
    }

    cellTile.x = tile.x;
    cellTile.y = tile.y;
    smoothMoveTo(cellTile!, cellX, cellY, 0.5);
    cellTile.selection.alpha = SELECTION_ALPHA;
    cellTile.selection.zIndex = SELECTION_Z_INDEX;

    tile.getCell().removeTile();
    tile.selection.alpha = 0;
    this.tileManager.removeTile(tile);
    this.levelUpTile(cellTile);
    this.selectedTile = cellTile;

    this.cleanSteps();

    this.addNewTileToRandomCell(2);

    this.cleanSteps();
    this.getAvailibleCellsAround(cellTile!);

    this.selectedTile.selection.alpha = 0;
    this.selectedTile = null;
    this.cleanSteps();
  }

  private cleanSteps(): void {
    this.availibleCells.forEach((cell: Cell) => {
      cell.availibleArea.alpha = 0;
      cell.availibleArea.zIndex = 1;
      cell.eventMode = 'none';
      cell.cursor = 'default';
      cell.removeAllListeners();
    });

    this.availibleForMerge.forEach((tile: Tile) => {
      tile.off('pointerdown');
      tile.setUnavailibleForMerge();
    });

    this.availibleCells = [];
    this.availibleForMerge = [];
  }

  public restartGame(): void {
    this.cleanSteps();

    this.tileManager.clean();
    this.grid.cleanAllCells();

    this.selectedTile = null;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.tickerCallback) {
      this.app.instance.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }

    this.store.reset();
    this.goal.reset();
    this.goalPanel.updateGoals(this.goal.getGoals());

    this.tileManager.generateTiles();
    this.tileManager.resize(this.grid.cellSize);
    this.app.addToContainer(this.tileManager.getTiles());

    this.app.container.off('mg-select');
    this.app.container.on('mg-select', (tile: Tile) => this.handleTileSelection(tile));

    this.restartView.hide();
    this.pause = false;

    this.startGame();
  }

  private resetTimer(): void {
    this.timeLeft = GAME_DURATION;
    this.timerBar.reset();
  }

  private startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.timerInterval = setInterval(() => {
      if (this.pause) {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        return;
      }

      this.timeLeft--;
      this.timerBar.setTimer(this.timeLeft);

      if (this.timeLeft <= 0) {
        this.handleGameOver();
      }
    }, 1000);
  }

  private handleGameOver(): void {
    if (this.pause) return;

    this.pause = true;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.tickerCallback) {
      this.app.instance.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }

    if (this.selectedTile) {
      const tile = this.selectedTile;
      this.selectedTile = null;
      tile.selection.alpha = 0;
      this.cleanSteps();
    }

    this.app.container.off('mg-select');

    this.tileManager.getTiles().forEach((tile: Tile) => {
      tile.eventMode = 'none';
    });

    const isVictory = this.goal.isAllCompleted();
    this.restartView.setGameResult(isVictory, this.goal.getGoals());
    this.restartView.show();
  }

  private levelUpTile(tile: Tile): void {
    tile.levelUp();
    this.store.incrementScore(tile.getLevel());

    const level = tile.level;
    const color = tile.getColor();

    const goalCompleted = this.goal.checkAndMarkCompleted(color, level);

    if (goalCompleted) {
      this.goalPanel.updateGoals(this.goal.getGoals());

      if (this.goal.isAllCompleted()) {
        this.handleGameOver();
        return;
      }
    }
  }

  private startGame(): void {
    this.pause = false;

    if (this.tickerCallback) {
      this.app.instance.ticker.remove(this.tickerCallback);
    }

    this.tickerCallback = () => {
      if (this.pause) return;

      if (this.tileManager.isFull()) {
        this.handleGameOver();
        return;
      }

      if (this.selectedTile) {
        this.selectedTile.selection.alpha = SELECTION_ALPHA;
        this.selectedTile.selection.zIndex = SELECTION_Z_INDEX;
      }
    };

    this.app.container.eventMode = 'dynamic';

    this.resetTimer();
    this.startTimer();
    this.app.instance.ticker.start();
    this.app.instance.ticker.add(this.tickerCallback);
  }
}
