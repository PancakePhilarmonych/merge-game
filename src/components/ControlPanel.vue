<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { Colors, ColorsTextMap, getSpritePathByColor } from '../utils';

defineEmits(['reset', 'sell']);
const props = defineProps({
  counter: {
    type: Number,
    default: 0,
  },
  selectedColor: {
    type: String as PropType<Colors>,
    required: true,
  },
});

const selectedSpritePath = computed(() => {
  return props.selectedColor !== 'EMPTY' ? getSpritePathByColor[props.selectedColor] : '';
});

const showSellButton = computed(() => {
  return props.selectedColor !== Colors.EMPTY;
});
</script>

<template>
  <div class="control-panel">
    <div class="score-counter">
      <div class="score-counter__label">Score:</div>
      <div class="score-counter__text">{{ counter }}</div>
    </div>
    <div class="selected-item">
      <div class="selected-item__wrapper">
        <img v-if="selectedSpritePath" class="sprite" :src="selectedSpritePath" alt="img" />
        <div v-else class="empty-text">Empty</div>
      </div>
      <div v-if="showSellButton" @click="$emit('sell')" class="selected-item__sell">
        <div class="sell-text">Sell</div>
      </div>
    </div>
    <div style="flex: 1" />
    <div class="restart" @click="$emit('reset')">
      <div class="restart-text">Restart</div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@import '../assets/colors'
.control-panel
  display: flex
  flex-direction: row
  align-items: flex-end
  gap: 18px
  color: #fff
  font-weight: 400
  background: $main-color
  padding: 16px
  border-radius: 12px
  font-size: 18px

  .restart
    position: relative
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    font-size: 14px
    border-radius: 12px

    &:after
      content: ''
      position: absolute
      left: 0
      bottom: 0
      display: block
      width: 100%
      height: 50%
      z-index: 1

    .restart-text
      z-index: 3
      font-weight: 500

    &:hover
      cursor: pointer

  .selected-item
    display: flex

    &__wrapper
      display: flex
      background: $second-color
      aspect-ratio: 1 / 1

      .sprite
        width: 100%
        aspect-ratio: 1 / 1

    &__sell
      display: flex
      justify-content: center
      align-items: center
      text-align: center
      background: $second-color
      border-radius: 12px
      border: 2px solid white

      &:hover
        cursor: pointer
  .score-counter
    display: flex
    justify-content: center
    align-items: center
    width: 100%

    &__text
      height: max-content
      font-size: 24px
      font-weight: 500

    &__label
      font-size: 18px
      font-weight: 400
      margin-right: 8px

    .coin
      width: 50px
      height: 50px
      background: transparent

  @media (orientation: landscape)
    flex-direction: column
    align-items: center
    justify-content: space-between

    .restart
      align-self: self-end
      aspect-ratio: 3 / 2

    .selected-item
      width: 100%
      flex-direction: column
      align-items: center
      justify-content: flex-start
      gap: 18px

      &__wrapper
        justify-content: center
        align-items: center
        width: 100%
        border-radius: 12px

        .sprite
          width: 100%

      &__sell
        width: 80%
        aspect-ratio: 2 / 1

    @media screen and (min-width: 1024px)
      width: 160px

      .score-counter
        aspect-ratio: 3 / 2

        &__text
          font-size: 24px

        &__label
          font-size: 18px

      .selected-item
        gap: 18px

        &__wrapper
          .empty-text
            font-size: 24px

        &__sell
          width: 100%
          border: 3px solid white
          .sell-text
            font-size: 24px

      .restart
        border: 3px solid white
        .restart-text
          font-size: 18px

    @media screen and (min-width: 768px) and (max-width: 1024px)
      width: 100px
      gap: 18px

      .restart
        border: 2px solid white
        width: 100%
        border-radius: 10px

        .restart-text
          font-size: 12px

      .selected-item
        gap: 18px
        &__wrapper
          border-radius: 10px
          .empty-text
            font-size: 12px

        &__sell
          width: 100%
          border: 2px solid white
          border-radius: 10px
          .sell-text
            font-size: 12px

      .score-counter
        padding: 0px
        aspect-ratio: 4 / 3

        &__text
          font-size: 14px

        &__label
          font-size: 12px


    @media screen and (max-width: 768px)
      width: 100px

      .selected-item
        gap: 12px

        &__wrapper
          justify-content: center
          align-items: center
          width: 100%

          .empty-text
            font-size: 10px

        &__sell
          width: 100%
          aspect-ratio: 2 / 1
          border-radius: 8px
          border: 1px solid white

          .sell-text
            font-size: 10px

      .restart
        border: 1px solid white
        width: 100%
        border-radius: 8px

        .restart-text
          font-size: 8px

  @media (orientation: portrait)
    height: 100px
    width: 100%
    flex-direction: row
    align-items: flex-start
    justify-content: space-between

    .score-counter
      display: none

    .selected-item
      height: 100%
      flex-direction: row
      gap: 18px

      &__wrapper
        height: 100%
        border-radius: 8px
        display: flex
        justify-content: center
        align-items: center

        .empty-text
          font-size: 14px
          font-weight: 400

        .sprite
          width: 100%
          height: 100%

      &__sell
        height: 100%
        aspect-ratio: 1 / 1
        border-radius: 8px
        border: 1px solid white

        .sell-text
          font-size: 18px
          font-weight: 400

    .restart
      height: 100%
      width: 100px
      border-radius: 8px
      border: 2px solid white
      .text
        font-size: 12px
        font-weight: 500

    @media screen and (max-width: 700px)
      height: 80px
      gap: 12px

      .selected-item
        gap: 12px

        &__wrapper
          .empty-text
            font-size: 10px

        &__sell
          border: 1px solid white
          .sell-text
            font-size: 10px

      .restart
        border: 1px solid white
        width: 50px
        .restart-text
          font-size: 10px
</style>
