<script lang="ts" setup>
defineEmits(["reset"]);
defineProps({
  counter: {
    type: Number,
    default: 0,
  },
  selectedColor: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="action-footer">
    <div class="action-footer__item counter">{{ counter }}</div>
    <div class="action-footer__item selected-color">
    {{ selectedColor }}
    </div>
    <div style="flex: 1;"/>
    <img class="action-footer__item reset"
      src="../assets/icons/reset.svg"
      alt="reset-icon"
      @click="$emit('reset')"/>
  </div>
</template>

<style scoped lang="sass">
.action-footer
  display: flex
  align-items: center
  padding: 12px
  width: 600px
  height: 60px

  background: #2e2e2e
  border-radius: 12px
  justify-content: space-between

  &__item
    height: 40px
    background: #3e3e3e
    border-radius: 8px
    font-size: 18px
    font-weight: 500
    color: #fff
    display: flex
    align-items: center
    justify-content: center
    padding: 4px

  .selected-color
    padding: 0 8px
    min-width: 80px
    justify-content: space-evenly

  .counter
    min-width: 40px
    margin-right: 16px

  .reset
    width: 40px
    transition: 0.3s

    &:hover
      cursor: pointer
      scale: 1.05

    &:active
      scale: 0.9
</style>
