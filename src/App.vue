<script setup lang="ts">
import { onMounted } from 'vue';
import App from './modules/App';
import GameManager from './modules/GameManager';
import { useCounterStore } from './store/counter';
import ActionFooter from './components/ActionFooter.vue';
import { calculateDimensions } from './utils';

let gm: GameManager = {} as GameManager;
let app: App = {} as App;
const counterStore = useCounterStore();

const onResetHandler = () => {
  gm.restartGame();
};

const onSellHandler = () => {
  gm.deleteSelectedObject();
  counterStore.increment(2);
};

function addAppListeners() {
  window.addEventListener('orientationchange', calculateDimensions, false);
  window.addEventListener('resize', calculateDimensions, false);
}

onMounted(() => {
  app = new App();
  gm = new GameManager(app.instance, counterStore);
  addAppListeners();
});
</script>

<template>
  <div class="container">
    <div id="root" />
    <ActionFooter
      :counter="counterStore.count"
      :selected-color="counterStore.color"
      @reset="onResetHandler"
      @sell="onSellHandler"
    />
  </div>
</template>
