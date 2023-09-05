<script setup lang="ts">
import { onMounted } from "vue";
import App from "./modules/App";
import GameManager from "./modules/GameManager";
import { useCounterStore } from "./store/counter";

let gameManager: GameManager = {} as GameManager;
const counter = useCounterStore();

const restart = () => {
  gameManager.restartGame();
};

onMounted(() => {
  const app = new App();
  gameManager = new GameManager(app.instance, counter);
});
</script>

<template>
  <div class="container">
    <div id="root" />
    <button @click="restart" class="restart-button">Restart</button>
    <div class="counter">{{ counter.count }}</div>
  </div>
</template>
