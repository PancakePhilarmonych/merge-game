import { GameObject } from "./GameObject";
import Grid from "./Grid";
import * as PIXI from "pixi.js";
import Tile from "./Tile";
import A from '../assets/sprites/blocks/blue.png';
import B from '../assets/sprites/blocks/green.png';
import C from '../assets/sprites/blocks/transparent.png';
import D from '../assets/sprites/blocks/red.png';
import E from '../assets/sprites/blocks/yellow.png';

const sprites = [A, B, C, E, C, D, C]; // C is transparent

const getRandomSprite = () => {
  const index = Math.floor(Math.random() * sprites.length);
  return sprites[index];
}

export default class GameManager {
  private grid: Grid;
  private gameObjects: GameObject[] = [];
  private selectedObject: GameObject | null = null;

  constructor(app: PIXI.Application) {
    this.grid = new Grid(4, app.view.width);
    const gridContainer = this.grid.getContainer();
    gridContainer.interactive = true;
    gridContainer.on<any>('select', (go: GameObject) => {
      console.log('selected', go);
      this.selectedObject = go;
      this.selectedObject.sprite.alpha = 0.5;
    });
    gridContainer.on<any>('deselect', (go: GameObject) => {
      console.log('deselected', go);
      if(!this.selectedObject) return;
      this.selectedObject.sprite.alpha = 1;
      this.selectedObject = null;
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
          this.selectedObject!.setText(`${tile.position.x}, ${tile.position.y}`);
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
      const randomSprite = getRandomSprite();

      if(randomSprite === C) return;
      const gameObject = new GameObject(tile.position.x, tile.position.y, tile.sprite.width, randomSprite);
      this.gameObjects.push(gameObject);
      gridContainer.addChild(gameObject.sprite)
    });
  }

  private setObjectToTile(object: GameObject, tile: Tile): void {
    object.sprite.x = tile.position.x;
    object.sprite.y = tile.position.y;
  }
}
