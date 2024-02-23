<script setup lang="ts">
import { computed, onMounted, onBeforeMount } from 'vue';

import GameManager from './modules/GameManager';
import { useCounterStore } from './store/counter';
import BackDropComponent from './components/UI/BackDropComponent.vue';
import MetaComponent from './components/UI/MetaComponent.vue';
import TimerComponent from './components/UI/TimerComponent.vue';

const counterStore = useCounterStore();

const timerPercentage = computed(() => {
  return Math.round(counterStore.timerFill);
});

onBeforeMount(() => {
  counterStore.reset();
});

onMounted(() => {
  document.body.style.backgroundColor = '#000';
  const loading = document.createElement('div');
  loading.style.position = 'absolute';
  loading.style.top = '0';
  loading.style.left = '0';
  loading.style.width = '100%';
  loading.style.height = '100%';
  loading.style.backgroundColor = '#000';
  loading.style.display = 'flex';
  loading.style.justifyContent = 'center';
  loading.style.alignItems = 'center';
  loading.style.zIndex = '1000';
  loading.innerHTML = '<h1 style="color: #fff">Loading...</h1>';
  document.body.appendChild(loading);

  setTimeout(() => {
    new GameManager(counterStore);
    document.body.style.backgroundColor = '#fff';
    document.body.removeChild(loading);
  }, 1500);
});
</script>

<template>
  <div class="game-container">
    <div class="meta-info">
      <back-drop-component class="info-wrapper">
        <meta-component class="info-item">Best: {{ counterStore.best }}</meta-component>
        <meta-component class="info-item">Score: {{ counterStore.count }}</meta-component>
      </back-drop-component>
    </div>
    <div id="root">
      <canvas></canvas>
    </div>
    <timer-component :interval="timerPercentage" />
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
  height: 100%
  .info-item
    align-self: center
    width: 80%

.meta-info
  display: grid
  grid-template-columns: 1fr
  grid-template-rows: max-content 1fr
  gap: 16px

  @media (orientation: portrait)
    grid-template-columns: 1fr
    grid-template-rows: 1fr
    gap: 8px
</style>
