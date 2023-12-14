<script setup lang="ts">
import { onMounted } from 'vue';
import App from './modules/App';
import GameManager from './modules/GameManager';
import { useCounterStore } from './store/counter';
import ControlPanel from './components/ControlPanel.vue';
import { addAppListeners } from './utils';

let gm: GameManager = {} as GameManager;
let app: App = {} as App;
const counterStore = useCounterStore();
const onResetHandler = () => gm.restartGame();

const onSellHandler = () => {
  gm.deleteSelectedObject();
  counterStore.increment(2);
};

onMounted(() => {
  app = new App();
  gm = new GameManager(app.instance, counterStore);
  addAppListeners(app);
});
</script>

<template>
  <div class="merge-game">
    <div id="root" />
    <control-panel
      class="control-item"
      :counter="counterStore.count"
      :selected-color="counterStore.color"
      @reset="onResetHandler"
      @sell="onSellHandler"
    />
  </div>
</template>
