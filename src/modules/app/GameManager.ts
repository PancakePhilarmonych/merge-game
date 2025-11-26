import { Tile } from '@/modules/core/Tile';
import Grid from '@/modules/core/Grid';
import TileManager from '@/modules/app/TileManager';
import Store from '@/modules/app/Store';
import Cell from '@/modules/core/Cell';
import {
  Colors,
  smoothMoveTo,
  getRandomColor,
  getMaxAvailibleSideSize,
  getTopUIHeight,
  getBottomUIHeight,
} from '@/utils';
import ScorePanel from '../ui/ScorePanel';
import BottomPanel from '../ui/BottomPanel';
import RestartView from '@/modules/ui/RestartView';
import StartView from '@/modules/ui/StartView';
import { gsap } from 'gsap';
import App from '@/modules/app/App';
import {
  GAME_DURATION,
  NEW_OBJECT_DELAY,
  MERGE_OBJECT_DELAY,
  AVAILABLE_CELL_ALPHA,
  SELECTION_ALPHA,
  SELECTION_Z_INDEX,
} from '@/config/constants';

export default class GameManager {
  private app: App = new App();
  private store: Store = new Store();
  private scorePanel: ScorePanel = new ScorePanel();
  private bottomPanel: BottomPanel = new BottomPanel();
  private grid: Grid;
  private tileManager: TileManager;

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

    this.app.addToStage(this.scorePanel);
    this.app.addToStage(this.bottomPanel);
    this.app.addToStage(this.startView.container);
    this.app.addToStage(this.restartView.container);

    this.bottomPanel.updateInfoText('WELCOME!');
    this.bottomPanel.y = window.innerHeight - getBottomUIHeight();

    this.setListeners();

    this.resize();
  }

  private resize() {
    const size = getMaxAvailibleSideSize();

    this.app.resize();
    this.grid.resize(size);
    this.tileManager.resize(this.grid.cellSize);

    this.app.container.y = getTopUIHeight();

    this.scorePanel.resize();
    this.bottomPanel.resize();

    this.startView.resize(size);
    this.restartView.resize(size);
  }

  private setListeners(): void {
    this.app.container.on('mg-select', (tile: Tile) => this.handleTileSelection(tile));

    this.restartView.container.on('mg-restart', () => this.restartGame());
    this.startView.container.on('mg-start', () => {
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

  private addNewTile(cell: Cell, color: Colors): void {
    const newTile = this.tileManager.addTile(cell, color);

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

  addNewTileToRandomCell(): void {
    const randomEmptyCell = this.tileManager.getRandomEmptyCell();

    if (randomEmptyCell) {
      setTimeout(() => {
        this.addNewTile(randomEmptyCell, getRandomColor(true));
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

    const randomEmptyCell = this.tileManager.getRandomEmptyCell();

    if (randomEmptyCell) {
      setTimeout(() => {
        this.addNewTile(randomEmptyCell, getRandomColor(true));
      }, MERGE_OBJECT_DELAY);
    }

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

    this.scorePanel.setScore(0);
    this.bottomPanel.updateInfoText('New game is started!');
    this.bottomPanel.updateInfoText('Merge them all!', 2000);

    this.store.reset();
    this.tileManager.generateTiles();
    // Убедимся, что вновь созданные тайлы подстроены под текущий размер сетки
    this.tileManager.resize(this.grid.cellSize);
    this.app.addToContainer(this.tileManager.getTiles());
    this.app.container.on('mg-select', (tile: Tile) => this.handleTileSelection(tile));
    this.app.container.eventMode = 'dynamic';
    this.restartView.hide();
    this.pause = false;

    this.resetTimer();
    this.app.instance.ticker.start();
    this.startGame();
  }

  private resetTimer(): void {
    this.timeLeft = GAME_DURATION;
    this.scorePanel.setTimer(this.timeLeft);
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
      this.scorePanel.setTimer(this.timeLeft);

      if (this.timeLeft <= 0) {
        this.handleGameOver(`TIME'S UP!`);
      }
    }, 1000);
  }

  private handleGameOver(message: string): void {
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

    this.app.container.removeAllListeners();

    this.tileManager.getTiles().forEach((tile: Tile) => {
      tile.eventMode = 'none';
    });

    this.restartView.setScoreText(this.store.getScore(), this.store.getBestScore());
    this.bottomPanel.updateInfoText(message);
    this.restartView.show();
  }

  private levelUpTile(tile: Tile): void {
    tile.levelUp();
    this.store.incrementScore(tile.getLevel());
    this.scorePanel.setScore(this.store.getScore());

    const level = tile.getLevel();
    if (level >= 8) {
      this.bottomPanel.updateInfoText(`You are a genius!`);
      this.bottomPanel.updateInfoText(`Merge them all!`, 2000);
    } else if (level >= 4) {
      this.bottomPanel.updateInfoText(`WOW!`);
      this.bottomPanel.updateInfoText(`Merge them all!`, 2000);
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
        this.handleGameOver('GAME OVER!');
        return;
      }

      if (this.selectedTile) {
        this.selectedTile.selection.alpha = SELECTION_ALPHA;
        this.selectedTile.selection.zIndex = SELECTION_Z_INDEX;
      }
    };

    this.app.container.eventMode = 'dynamic';
    this.bottomPanel.updateInfoText('Merge them all!');

    this.resetTimer();
    this.startTimer();
    this.app.instance.ticker.start();
    this.app.instance.ticker.add(this.tickerCallback);
  }
}
