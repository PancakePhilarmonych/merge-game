<template>
  <div class="button-wrapper" :class="{ disabled }">
    <div class="coins-amount">
      <div class="coin" />
      <div class="coins">{{ disabled ? 0 : coinsAmount }}</div>
    </div>
    <button>
      <slot></slot>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  coinsAmount: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="sass">
@import '../../assets/colors'
.button-wrapper
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  background: $secondary-green
  border-radius: 12px
  padding-left: 12px
  min-height: 32px
  aspect-ratio: 4 / 1

  &.disabled
    button
      cursor: not-allowed
      background: $linear-one
      border-color: $third-green
      color: $third-green

  button
    border-radius: 12px
    background: $green
    border: 2px solid white
    color: $white
    font-size: 16px
    line-height: 18px
    text-align: center
    width: 60%
    height: 100%
    cursor: pointer
    transition: all 0.1s ease-in

  .coins-amount
    display: flex
    justify-content: center
    align-items: center
    gap: 8px
    width: 50%
    height: 100%
    color: $white
    text-align: center
    padding-right: 8px
    .coin
      width: 12px
      height: 12px
      background: $second-coin
      border-radius: 50%
      background-size: contain
      aspect-ratio: 1 / 1

  @media screen and (max-width: 768px)
    border-radius: 10px
    padding-left: 10px
    min-height: 24px
    aspect-ratio: 4 / 1

    button
      border-radius: 10px
      font-size: 8px
      line-height: 10px
      width: 60%
      height: 100%

    .coins-amount
      gap: 6px
      padding-right: 6px
      .coin
        width: 10px
        height: 10px
        aspect-ratio: 1 / 1
      .coins
        font-size: 8px
        line-height: 10px

  @media screen and (min-width: 768px) and (max-width: 1024px)
    border-radius: 12px
    padding-left: 12px
    min-height: 32px
    aspect-ratio: 4 / 1

    button
      border-radius: 12px
      font-size: 14px
      line-height: 16px
      width: 60%
      height: 100%

    .coins-amount
      gap: 8px
      padding-right: 8px

      .coins
        font-size: 10px
        line-height: 12px

  @media screen and (min-width: 1024px) and (max-width: 1440px)
    border-radius: 16px
    padding-left: 16px
    min-height: 40px
    aspect-ratio: 4 / 1

    button
      border-radius: 16px
      border: 4px solid white
      font-size: 18px
      line-height: 20px
      width: 60%
      height: 100%

    .coins-amount
      .coins
        font-size: 12px
        line-height: 14px

  @media screen and (min-width: 1440px)
    border-radius: 20px
    padding-left: 20px
    min-height: 48px
    aspect-ratio: 4 / 1

    button
      border-radius: 20px
      border: 4px solid white
      font-size: 22px
      line-height: 24px
      width: 60%
      height: 100%

    .coins-amount
      .coins
        font-size: 16px
        line-height: 18px
</style>
