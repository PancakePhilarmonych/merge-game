import './assets/main.sass';
import * as PIXI from 'pixi.js';
import GameManager from './modules/app/GameManager';
import ResourceLoader from './modules/app/ResourceLoader';
import LoadingScreen from './modules/app/LoadingScreen';

async function init() {
  // Создаем временное приложение для LoadingScreen с отдельным canvas
  const loadingCanvas = document.createElement('canvas');
  loadingCanvas.style.position = 'absolute';
  loadingCanvas.style.top = '0';
  loadingCanvas.style.left = '0';
  loadingCanvas.style.zIndex = '1000';
  document.body.appendChild(loadingCanvas);

  const tempApp = new PIXI.Application({
    antialias: true,
    backgroundAlpha: 0,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
    view: loadingCanvas,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const loadingScreen = new LoadingScreen(window.innerWidth, window.innerHeight);
  tempApp.stage.addChild(loadingScreen);
  loadingScreen.show();

  const loader = ResourceLoader.getInstance();
  await loader.loadResources(progress => {
    console.log('Loading progress:', progress);
    loadingScreen.updateProgress(progress);
  });

  console.log('Loading complete, showing 100%');
  loadingScreen.updateProgress(1);

  // Даем браузеру время на применение загруженных шрифтов
  await new Promise(resolve => setTimeout(resolve, 100));

  await new Promise(resolve => setTimeout(resolve, 500));

  loadingScreen.hide();

  await new Promise(resolve => setTimeout(resolve, 300));

  tempApp.destroy(true, { children: true, texture: false, baseTexture: false });

  if (loadingCanvas.parentElement) {
    document.body.removeChild(loadingCanvas);
  }

  new GameManager();
}

init();
