import { GameObject } from "./GameObject";
import Grid from "./Grid";
import * as PIXI from "pixi.js";
import Tile from "./Tile";
import { Colors } from './garbage'

const colors = [
  Colors.RED,
  Colors.YELLOW,
  Colors.BLUE,
  Colors.EMPTY,
];

const getRandomColor = () => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

export default class GameManager {
  private grid: Grid;
  private gameObjects: GameObject[] = [];
  private hoveredTile: Tile | null = null;
  private selectedObject: GameObject | null = null;

  constructor(app: PIXI.Application) {
    this.grid = new Grid(5, app.view.width);
    const gridContainer = this.grid.getContainer();
    gridContainer.interactive = true;
    gridContainer.on<any>('select', (go: GameObject) => {
      this.selectedObject = go;
      this.selectedObject.sprite.alpha = 0.5;
    });
    gridContainer.on<any>('deselect', (go: GameObject) => {
      if(!this.selectedObject) return;
      this.selectedObject.sprite.alpha = 1;
      this.selectedObject = null;
    });
    gridContainer.on<any>('check-tile', (gameObject: GameObject) => {
      if(!this.hoveredTile) return;
      this.setObjectToTile(gameObject, this.hoveredTile);
    });
    this.generateGameObjects();
    app.stage.addChild(gridContainer);

    app.ticker.add(() => {
      if(!this.selectedObject) {
        this.grid.getTiles().forEach((tile: Tile) => {
          tile.sprite.alpha = 1;
        });
        return;
      };

      const spriteSizeWidthAnchor = this.selectedObject.sprite.x;
      const spriteSizeHeightAnchor = this.selectedObject.sprite.y;

      this.grid.getTiles().forEach((tile: Tile) => {

        const isHovered = this.selectedObject
        && Math.floor(spriteSizeWidthAnchor / this.grid.tileSize) === tile.position.x
        && Math.floor(spriteSizeHeightAnchor / this.grid.tileSize) === tile.position.y;

        if(isHovered) {
          this.hoveredTile = tile;
          tile.sprite.alpha = 0.8;
          return;
        }

        tile.sprite.alpha = 1;
      }
      );
    });
  }

  private generateGameObjects(): void {
    const gridTiles = this.grid.getTiles()
    const gridContainer = this.grid.getContainer();

    gridTiles.forEach((tile: Tile) => {
      const randomColor = getRandomColor();

      if(randomColor === Colors.EMPTY) return;
      const gameObject = new GameObject(tile.position.x, tile.position.y, tile.sprite.width, randomColor );
      gameObject.setTile(tile);
      tile.setGameObject(gameObject);
      this.gameObjects.push(gameObject);
      gridContainer.addChild(gameObject.sprite)
    });
  }

  private setObjectToTile(object: GameObject, tile: Tile): void {
    const tileGameObject = tile.getGameObject();

    if(tileGameObject) {

      if(tileGameObject?.getColor() === object.getColor()) {

        if(tileGameObject === object) {
          const objectTile = object.getTile();
          object.sprite.x = this.grid.tileSize * objectTile!.position.x + (this.grid.tileSize / 2)
          object.sprite.y = this.grid.tileSize * objectTile!.position.y + (this.grid.tileSize / 2)
          return;
        };

        object.sprite.destroy();
        const gameObjectIndex = this.gameObjects.indexOf(object);
        this.gameObjects.splice(gameObjectIndex, 1);
        object.getTile()!.removeGameObject();

        this.setNewColorToObject(tileGameObject);
        return;
      };

      const objectTile = object.getTile();

      object.sprite.x = this.grid.tileSize * objectTile!.position.x + (this.grid.tileSize / 2)
      object.sprite.y = this.grid.tileSize * objectTile!.position.y + (this.grid.tileSize / 2)
      return;
    };

    object.getTile()!.removeGameObject();
    tile.setGameObject(object);

    object.sprite.x = this.grid.tileSize * tile.position.x + (this.grid.tileSize / 2)
    object.sprite.y = this.grid.tileSize * tile.position.y + (this.grid.tileSize / 2)

    object.setTile(tile);
  }

  private setNewColorToObject(object: GameObject): void {
    switch(object.getColor()) {
      case Colors.RED:
        object.setColor(Colors.RED_TWO);
        break;
      case Colors.RED_TWO:
        object.setColor(Colors.RED_THREE);
        break;
      case Colors.RED_THREE:
        console.log('Alredy max color');
        break;
      case Colors.YELLOW:
        object.setColor(Colors.YELLOW_TWO);
        break;
      case Colors.YELLOW_TWO:
        object.setColor(Colors.YELLOW_THREE);
        break;
      case Colors.YELLOW_THREE:
        console.log('Alredy max color');
        break;
      case Colors.BLUE:
        object.setColor(Colors.BLUE_TWO);
        break;
      case Colors.BLUE_TWO:
        object.setColor(Colors.BLUE_THREE);
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
