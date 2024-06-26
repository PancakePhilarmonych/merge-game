<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';

import GameManager from './modules/GameManager';
import { useCounterStore } from './store/counter';

const counterStore = useCounterStore();

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
  <div id="root">
    <canvas></canvas>
  </div>
</template>

<style scoped lang="sass">

#root
  display: flex
  justify-content: center
  align-items: center
  canvas
    width: 100%
    height: 100%
    border-radius: 12px
    border: 5px solid #fff
</style>
