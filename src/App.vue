<script setup lang="ts">
import { onMounted } from "vue";
import App from "./modules/App";
import GameManager from "./modules/GameManager";
import { useCounterStore } from "./store/counter";
import ActionFooter from "./components/ActionFooter.vue";

let gm: GameManager = {} as GameManager;
const counterStore = useCounterStore();

const onResetHandler = () => {
  gm.restartGame();
};

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
    <ActionFooter
      :counter="counterStore.count"
      :selectedColor="counterStore.color"
      @reset="onResetHandler" />
  </div>
</template>
