<script setup lang="ts">
import { onMounted } from "vue";
import App from "./modules/App"
import GameManager  from './modules/GameManager';

let gameManager: GameManager = {} as GameManager;

const restart = () => {
  gameManager.restartGame();
};

onMounted(() => {
  const app = new App();
  gameManager = new GameManager(app.instance);
});
</script>

<template>
 <div class="container">
   <div id="root" />
   <button @click="restart" class="restart-button"> Restart </button>
  </div>
</template>
