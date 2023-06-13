<script setup lang="ts">
import * as PIXI from 'pixi.js';
import empty from './assets/sprites/blocks/empty.png';
import { Ref, onMounted, ref } from "vue";
import { app } from './modules/App'
import { Field } from './modules/Field';


const active: Ref<number | null> = ref(null);

onMounted(() => {
  const wrapper = document.getElementById("game-wrapper")! as HTMLDivElement;
  const gameWidth = app.screen.width;
  const gameHeight = app.screen.height;

  wrapper.appendChild(app.view);

  const gameField = Array.from({ length: 16 }, (q, index) => {
    return new Field(
      (index % 4) * gameWidth / 4,
      Math.floor(index / 4) * gameHeight / 4,
      gameWidth / 4,
      gameHeight / 4,
      index,
    );
});

  gameField.forEach((field, index) => app.stage.addChild(field.sprite));
});
</script>

<template>
 <div class="container">
    <div id="game-wrapper" />
  </div>
</template>
