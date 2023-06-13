<script setup lang="ts">
import * as PIXI from 'pixi.js';
import empty from './assets/sprites/blocks/empty.png';
import { onMounted } from "vue";
import { app } from './modules/App'

const gameField = Array.from({ length: 16 }, () => PIXI.Sprite.from(empty));

onMounted(() => {
  const wrapper = document.getElementById("game-wrapper")! as HTMLDivElement;
  const gameWidth = app.screen.width;
  const gameHeight = app.screen.height;

  wrapper.appendChild(app.view);

  gameField.forEach((block, index) => {
    block.interactive = true;
    block.cursor = 'pointer';
    block.roundPixels = true;

    block.width = gameWidth / 4;
    block.height = gameHeight / 4;

    block.x = (index % 4) * block.width;
    block.y = Math.floor(index / 4) * block.height;

    block.onclick = () => {
      console.log('BLOCK INFO', { block, index });
    }

    app.stage.addChild(block);
  });
});
</script>

<template>
 <div class="container">
    <div id="game-wrapper" />
  </div>
</template>
