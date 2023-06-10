<script setup lang="ts">
import { onMounted } from "vue";
import SidebarComponent from "./components/Sidebar/index.vue";

onMounted(() => {
  const canvas = document.getElementById("view") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  console.log(ctx);
});
</script>

<template>
  <sidebar-component />
  <div class="container">
    <div class="game-wrapper">
      <canvas id="view"></canvas>
    </div>
  </div>
</template>
