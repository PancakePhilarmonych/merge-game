declare namespace GlobalMixins {
  interface DisplayObjectEvents {
    'mg-click': (event: PIXI.InteractionEvent) => void;
    'mg-check-cells': (event: PIXI.InteractionEvent) => void;
    'mg-select': (event: PIXI.InteractionEvent) => void;
  }
}
