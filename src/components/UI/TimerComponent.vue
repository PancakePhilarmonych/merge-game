<template>
  <div class="panel">
    <back-drop-component>
      <div class="timer">
        <MetaComponent class="timer__speed">Speed x1</MetaComponent>
        <div class="timer-wrapper">
          <div class="timer-progress" :style="progressStyles" />
        </div>
      </div>
    </back-drop-component>
    <!-- <div class="controls">
      <div class="shop-button">
        <div class="coins">
          <div class="coin" />
          <div class="coin-count">999</div>
        </div>
        <div class="shop">Shop</div>
      </div>
      <div class="menu-button">
        <div class="menu-button__text">Menu</div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import BackDropComponent from './BackDropComponent.vue';
import MetaComponent from './MetaComponent.vue';
import { defineProps } from 'vue';

const { interval } = defineProps({
  interval: {
    type: Number,
    default: 5,
  },
});

const progressStyles = {
  '--progress': `${interval}%`,
};
</script>

<style scoped lang="sass">
@import '../../assets/colors'

.panel
  height: 100%
  display: grid
  grid-template-rows: 1fr
  .timer
    width: 100%
    height: 100%

    display: flex
    justify-content: center
    align-items: center
    flex-direction: column

    &__speed
      margin-bottom: 20px
      width: 80%
  .timer-wrapper
    position: relative
    width: 30%
    height: 100%
    background: #252323
    border-radius: 12px
    overflow: hidden
    transform: rotate(180deg)
  .timer-progress
    position: absolute
    width: 100%
    height: var(--progress)
    background: $additional
    border-radius: 12px

  @media (orientation: portrait)
    .timer-wrapper
      width: 100%
      height: 30%
      margin-bottom: 20px
      transform: rotate(0deg)
    .timer-progress
      width: var(--progress)
      height: 100%
</style>
