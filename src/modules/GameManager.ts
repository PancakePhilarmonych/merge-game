import { GameObject } from './GameObject';
import Grid from './Grid';
import * as PIXI from 'pixi.js';
import Tile from './Tile';
import { Colors, smoothMoveTo, maxLevelColors, getRandomColor } from '../utils';
import { gsap } from 'gsap';
import App from './App';
import { addAppListeners } from '../utils';

export default class GameManager {
  private store: any;
  private grid: Grid;
  private gameObjects: GameObject[] = [];
  private hoveredCell: Tile | null = null;
  private selectedObject: GameObject | null = null;
  private container: PIXI.Container = new PIXI.Container();

  constructor(counterStore: any) {
    const { instance } = new App();
    addAppListeners(instance);
    this.store = counterStore;
    this.container.eventMode = 'dynamic';
    this.container.sortableChildren = true;
    this.container.interactiveChildren = true;
    this.grid = new Grid(5, instance.view.width, instance.view.height);
    const cellselectArea = this.grid.getContainers();
    this.container.addChild(...cellselectArea);

    this.container
      .on('pointermove', this.moveOverContainer, this)
      .on('pointerdown', this.moveOverContainer, this);

    this.container.on<any>('select', (go: GameObject) => {
      if (this.selectedObject === go) return;
      this.selectedObject = go;
      this.store.select(go);
    });

    this.container.on<any>('deselect', () => {
      if (!this.selectedObject) return;
      // this.selectedObject.sprite.alpha = 1;
      this.selectedObject = null;
      this.store.select(null);
    });

    this.container.on<any>('check-cell', (gameObject: GameObject) => {
      if (!this.hoveredCell) return;
      this.setObjectToCell(gameObject, this.hoveredCell);
    });

    this.generateGameObjects();
    instance.stage.addChild(this.container);
    instance.stage.hitArea = instance.screen;

    instance.ticker.add(() => {
      const cellSize = this.grid.getCellSize();
      const cells = this.grid.getCells();

      if (!this.selectedObject) {
        cells.forEach((cell: Tile) => {
          cell.sprite.alpha = 1;
        });
        return;
      }

      const spriteSizeWidthAnchor = this.selectedObject.sprite.x;
      const spriteSizeHeightAnchor = this.selectedObject.sprite.y;

      cells.forEach((cell: Tile) => {
        const isHovered =
          this.selectedObject &&
          Math.floor(spriteSizeWidthAnchor / cellSize) === cell.position.x &&
          Math.floor(spriteSizeHeightAnchor / cellSize) === cell.position.y;

        if (isHovered) {
          this.hoveredCell = cell;

          cell.getGameObject() !== this.selectedObject
            ? gsap.to(cell.sprite, { alpha: 0.8, duration: 0.8 })
            : gsap.to(cell.sprite, { alpha: 1, duration: 0.1 });
          return;
        }

        const selectedOjectCell = this.selectedObject!.getCell();

        if (selectedOjectCell) {
          selectedOjectCell.selectArea.alpha = 0.9;
          selectedOjectCell.selectArea.zIndex = 2;
        }

        cell.sprite.alpha = 1;
        cell.selectArea.alpha = 0;
        cell.selectArea.zIndex = 1;
      });
    });
  }

  public deleteSelectedObject(): void {
    if (!this.selectedObject) return;
    gsap.to(this.selectedObject.sprite, { alpha: 0.1, duration: 0.2 });
    gsap.to(this.selectedObject.getCell()!.selectArea, {
      alpha: 0.0,
      duration: 0.2,
    });
    this.selectedObject.sprite.destroy();
    const gameObjectIndex = this.gameObjects.indexOf(this.selectedObject);
    this.gameObjects.splice(gameObjectIndex, 1);
    this.selectedObject.getCell()!.removeGameObject();
    this.selectedObject = null;
    this.store.select(null);
  }

  moveOverContainer(event: PIXI.FederatedPointerEvent) {
    if (!this.selectedObject) return;
    if (!this.selectedObject.isUnblocked) return;
    this.selectedObject.sprite.x = event.globalX;
    this.selectedObject.sprite.y = event.globalY;
  }

  private generateGameObjects(): void {
    const gridCells = this.grid.getCells();
    gridCells.forEach((cell: Tile) => {
      const randomColor = getRandomColor();

      if (randomColor === Colors.EMPTY) return;

      const newGameObject = new GameObject(
        cell.position.x,
        cell.position.y,
        cell.sprite.width,
        randomColor,
      );

      newGameObject.setCell(cell);
      cell.setGameObject(newGameObject);

      this.gameObjects.push(newGameObject);
      this.container.addChild(newGameObject.sprite);
    });
  }

  private setObjectToCell(object: GameObject, cell: Tile): void {
    const cellGameObject = cell.getGameObject();
    const cellSize = this.grid.getCellSize();
    const cellX = cellSize * cell.position.x + cellSize / 2;
    const cellY = cellSize * cell.position.y + cellSize / 2;
    const cellGameObjectColor = cellGameObject?.getColor();
    const gameObjectColor = object.getColor();

    if (cellGameObject) {
      if (cellGameObjectColor === gameObjectColor) {
        if (maxLevelColors.includes(cellGameObjectColor)) {
          this.moveObjectToOwnCell(object);
          return;
        }

        if (cellGameObject === object) {
          this.moveObjectToOwnCell(object);
          return;
        }

        this.moveObjectToMatchedCell(object, cell);
        return;
      }

      this.moveObjectToOwnCell(object);
      return;
    }

    // Hide
    object.getCell()!.selectArea.alpha = 0;
    object.getCell()!.selectArea.zIndex = 1;
    // Удаляем объект из клетки
    object.getCell()!.removeGameObject();
    // Ставим объект в текущую клетку
    cell.setGameObject(object);
    // Показываем спрайт выбора
    gsap.to(cell.selectArea, { alpha: 1, duration: 0.6 });
    gsap.to(cell.selectArea, { zIndex: 2, duration: 0.6 });
    // Перемещаем объект в центр клетки
    smoothMoveTo(object.sprite, cellX, cellY, 0.5);
    // Присваиваем объекту новую клетку
    object.setCell(cell);
    // Выбираем объект
    this.selectedObject = object;
    this.store.select(object);
  }

  moveObjectToOwnCell(object: GameObject): void {
    const cellSize = this.grid.getCellSize();
    const objectCell = object.getCell()!;

    const objectCellX = cellSize * objectCell.position.x + cellSize / 2;
    const objectCellY = cellSize * objectCell.position.y + cellSize / 2;

    smoothMoveTo(object.sprite, objectCellX, objectCellY, 0.5);
    object.getCell()!.selectArea.alpha = 0.9;
    object.getCell()!.selectArea.zIndex = 2;
    this.selectedObject = object;
    this.store.select(object);
  }

  moveObjectToMatchedCell(object: GameObject, cell: Tile): void {
    const cellGameObject = cell.getGameObject();
    const cellSize = this.grid.getCellSize();
    const cellX = cellSize * cell.position.x + cellSize / 2;
    const cellY = cellSize * cell.position.y + cellSize / 2;

    cellGameObject!.sprite.x = object.sprite.x;
    cellGameObject!.sprite.y = object.sprite.y;
    smoothMoveTo(cellGameObject!.sprite, cellX, cellY, 0.5);
    cellGameObject!.getCell()!.selectArea.alpha = 0.9;
    cellGameObject!.getCell()!.selectArea.zIndex = 2;

    object.sprite.destroy();
    object.getCell()!.removeGameObject();
    object.getCell()!.selectArea.alpha = 0;
    this.setNewColorToObject(cellGameObject!);
    this.store.select(cellGameObject!);
    this.selectedObject = cellGameObject!;
    const gameObjectIndex = this.gameObjects.indexOf(object);
    this.gameObjects.splice(gameObjectIndex, 1);
  }

  public restartGame(): void {
    this.gameObjects.forEach((gameObject: GameObject) => {
      gameObject.sprite.destroy();
    });

    this.gameObjects = [];
    this.grid.getCells().forEach((cell: Tile) => {
      cell.removeGameObject();
      cell.selectArea.alpha = 0;
    });

    this.hoveredCell = null;
    this.selectedObject = null;

    this.store.reset();
    this.generateGameObjects();
  }

  private setNewColorToObject(object: GameObject): void {
    switch (object.getColor()) {
      case Colors.RED:
        object.setColor(Colors.RED_TWO);
        this.store.increment();
        break;
      case Colors.RED_TWO:
        object.setColor(Colors.RED_THREE);
        this.store.increment();
        break;
      case Colors.RED_THREE:
        console.log('Alredy max color');
        break;
      case Colors.YELLOW:
        object.setColor(Colors.YELLOW_TWO);
        this.store.increment();
        break;
      case Colors.YELLOW_TWO:
        object.setColor(Colors.YELLOW_THREE);
        this.store.increment();
        break;
      case Colors.YELLOW_THREE:
        console.log('Alredy max color');
        break;
      case Colors.BLUE:
        object.setColor(Colors.BLUE_TWO);
        this.store.increment();
        break;
      case Colors.BLUE_TWO:
        object.setColor(Colors.BLUE_THREE);
        this.store.increment();
        break;
      case Colors.BLUE_THREE:
        console.log('Alredy max color');
        break;
      default:
        console.log('No color');
        break;
    }
  }
}
