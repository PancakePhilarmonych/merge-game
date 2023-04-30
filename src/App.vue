<script lang="ts">
import { defineComponent } from 'vue';
import SidebarComponent from './components/Sidebar/index.vue'
import GameComponent from './components/Game/index.vue'

export default defineComponent({
  components: {
    SidebarComponent,
    GameComponent
  },
})
</script>

<template>
  <sidebar-component/>
  <game-component/>
</template>
