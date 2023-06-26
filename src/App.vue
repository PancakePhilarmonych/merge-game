<script setup lang="ts">
import { onMounted } from "vue";
import { App } from "./modules/App"
import GameManager  from './modules/GameManager';

onMounted(() => {
  const wrapper = document.getElementById("game-wrapper")! as HTMLDivElement;
  const gameManager = new GameManager();

  wrapper.appendChild(App.view);
});
</script>

<template>
 <div class="container">
    <div id="game-wrapper" />
  </div>
</template>
