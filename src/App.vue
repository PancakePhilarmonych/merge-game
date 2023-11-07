<script setup lang="ts">
import { onMounted } from "vue";
import App from "./modules/App";
import GameManager from "./modules/GameManager";
import { useCounterStore } from "./store/counter";

let gm: GameManager = {} as GameManager;
const counterStore = useCounterStore();

const restart = () => {
  gm.restartGame();
};

onMounted(() => {
  const app = new App();
  gm = new GameManager(app.instance, counterStore);
});
</script>

<template>
  <div class="container">
    <div id="root" />
    <button @click="restart" class="restart-button">Restart</button>
    <div class="counter">{{ counterStore.count }}</div>
  </div>
</template>
