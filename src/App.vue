<script setup lang="ts">
import { computed, onMounted, onBeforeMount } from 'vue';

import GameManager from './modules/GameManager';
import { useCounterStore } from './store/counter';
import BackDropComponent from './components/UI/BackDropComponent.vue';
import MetaComponent from './components/UI/MetaComponent.vue';
import TimerComponent from './components/UI/TimerComponent.vue';
import SelectedTileComponent from './components/UI/SelectedTileComponent.vue';
import { getSpritePathByColor } from './utils';
// import { RoundedRectangle } from 'pixi.js';

const counterStore = useCounterStore();
let gm = {} as GameManager | null;
let best = 0;

const onSellHandler = () => {
  // const count = gm.getSelectedObjectCost();
  gm?.deleteSelectedObject();
  counterStore.increment(2);
};

const selecetedSprite = computed(() => {
  return counterStore.color !== 'EMPTY'
    ? getSpritePathByColor[counterStore.color]
    : getSpritePathByColor['EMPTY'];
});

const selectedIsDisabled = computed(() => {
  return counterStore.color === 'EMPTY';
});

onBeforeMount(() => {
  let bestFromStorage = localStorage.getItem('best');

  if (bestFromStorage) {
    best = parseInt(bestFromStorage);
  }
});

onMounted(() => {
  gm = new GameManager(counterStore);
});
</script>

<template>
  <div class="game-container">
    <div class="meta-info">
      <back-drop-component class="info-wrapper">
        <meta-component class="info-item">Best: {{ best }}</meta-component>
        <meta-component class="info-item">Score: {{ counterStore.count }}</meta-component>
      </back-drop-component>
      <selected-tile-component
        :disabled="selectedIsDisabled"
        :selected-tile="selecetedSprite"
        @sell-item="onSellHandler"
      />
    </div>
    <div id="root">
      <canvas></canvas>
    </div>
    <timer-component :interval="50" />
  </div>
</template>

<style scoped lang="sass">
@import './assets/colors'

#root
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

  canvas
    border-radius: 12px
    border: 5px solid #fff

.info-wrapper
  height: max-content
  .info-item
    align-self: center
    width: 80%

.meta-info
  display: grid
  grid-template-columns: 1fr
  grid-template-rows: max-content 1fr
  gap: 16px

  @media (orientation: portrait)
    grid-template-columns: 1fr 1fr
    grid-template-rows: 1fr
    gap: 8px
</style>
