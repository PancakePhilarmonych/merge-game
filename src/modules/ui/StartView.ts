import * as PIXI from 'pixi.js';
import { getTotalGameHeight } from '@/utils';
import MenuPanel from './MenuPanel';

export default class StartView extends MenuPanel {
  constructor() {
    super();

    this.panelContainer.addChild(this.createTitle('Merge Game'));
    this.panelContainer.addChild(this.createStartButton());
    this.show();
  }

  private createStartButton(): PIXI.Container {
    const button = this.createButton('Start', getTotalGameHeight() * 0.55, 0x27ae60);

    button.on('pointerdown', () => {
      this.panelContainer.emit('mg-start', this);
    });

    return button;
  }

  public override resize(): void {
    super.resize();
    this.panelContainer.addChild(this.createTitle('Merge Game'));
    this.panelContainer.addChild(this.createStartButton());
  }
}
