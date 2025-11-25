import { Assets } from 'pixi.js';
import EmptyField from '@/assets/sprites/grass-tile.png';
import EmptyFieldSecond from '@/assets/sprites/grass-tile-second.png';

export default class ResourceLoader {
  private static instance: ResourceLoader;
  private loaded = false;

  private constructor() {}

  public static getInstance(): ResourceLoader {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
    }
    return ResourceLoader.instance;
  }

  private async loadFonts(): Promise<void> {
    if ('fonts' in document) {
      try {
        // Сначала ждем загрузки всех шрифтов на странице
        await document.fonts.ready;

        // Затем явно загружаем Titan One с разными размерами
        await Promise.all([
          document.fonts.load('16px "Titan One"'),
          document.fonts.load('32px "Titan One"'),
          document.fonts.load('50px "Titan One"'),
        ]);

        // Проверяем что шрифт действительно загружен
        const isFontLoaded = document.fonts.check('32px "Titan One"');
        if (!isFontLoaded) {
          console.warn('Titan One font still not available after loading');
        }
      } catch (error) {
        console.error('Error loading Titan One font:', error);
      }
    }
  }

  public async loadResources(onProgress?: (progress: number) => void): Promise<void> {
    if (this.loaded) {
      return;
    }

    Assets.add('grass-tile', EmptyField);
    Assets.add('grass-tile-second', EmptyFieldSecond);

    let assetsProgress = 0;
    let fontsProgress = 0;

    const updateProgress = () => {
      if (onProgress) {
        onProgress((assetsProgress + fontsProgress) / 2);
      }
    };

    await Promise.all([
      (async () => {
        await Assets.load(['grass-tile', 'grass-tile-second'], progress => {
          assetsProgress = progress;
          updateProgress();
        });
        assetsProgress = 1;
        updateProgress();
      })(),
      (async () => {
        await this.loadFonts();
        fontsProgress = 1;
        updateProgress();
      })(),
    ]);

    this.loaded = true;
  }

  public isLoaded(): boolean {
    return this.loaded;
  }
}
