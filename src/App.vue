<script setup lang="ts">
import { onMounted } from "vue";
import GameManager  from './modules/GameManager';

onMounted(() => {
  const wrapper = document.getElementById("game-wrapper")! as HTMLDivElement;
  GameManager.init(wrapper)
});
</script>

<template>
 <div class="container">
    <div id="game-wrapper" />
  </div>
</template>
