<template>
  <div class="meta">
    <div class="meta-text">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="sass">
@import '../../assets/colors'
.meta
  display: flex
  justify-content: center
  align-items: center
  background: $third-green
  min-height: 32px
  aspect-ratio: 4 / 1
  .meta-text
    text-align: center
    color: $white
    text-wrap: nowrap

  @media screen and (max-width: 768px)
    border-radius: 10px
    .meta-text
      font-size: 8px
      line-height: 10px

  @media screen and (min-width: 768px) and (max-width: 1024px)
    border-radius: 12px
    .meta-text
      font-size: 10px
      line-height: 12px

  @media screen and (min-width: 1024px) and (max-width: 1440px)
    border-radius: 16px
    .meta-text
      font-size: 14px
      line-height: 16px

  @media screen and (min-width: 1440px)
    border-radius: 20px
    .meta-text
      font-size: 20px
      line-height: 22px
</style>
