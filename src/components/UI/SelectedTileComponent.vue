<script setup lang="ts">
import MetaComponent from './MetaComponent.vue';
import BackDropComponent from './BackDropComponent.vue';
import CoinButton from './CoinButton.vue';
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['sellItem']);

const props = defineProps({
  selectedTile: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  cost: {
    type: Number,
    default: 0,
  },
});

const sell = () => {
  if (props.disabled) return;
  emit('sellItem');
};
</script>

<template>
  <div class="selected">
    <meta-component class="selected__title">Selected</meta-component>
    <back-drop-component class="selected__sprite">
      <img v-if="selectedTile" :src="selectedTile" alt="img" />
    </back-drop-component>

    <coin-button :disabled="disabled" :coins-amount="cost" class="selected__button" @click="sell">
      Sell
    </coin-button>
  </div>
</template>

<style scoped lang="sass">
@import '../../assets/colors'
.selected
  display: flex
  flex-direction: column
  justify-content: flex-start
  align-items: center
  gap: 12px

  &__title
    aspect-ratio: 4 / 1
    width: 80%

  &__sprite
    display: flex
    justify-content: center
    align-items: center
    width: 80%
    aspect-ratio: 1 / 1
    border-radius: 12px

    img
      aspect-ratio: 1 / 1

  &__button
    width: 80%

  @media (orientation: portrait)

    &__title
      display: none

    &__sprite
      aspect-ratio: 1 / 1
</style>
