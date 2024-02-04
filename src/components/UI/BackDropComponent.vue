<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<style scoped lang="sass">
@import '../../assets/colors'
.container
  display: flex
  flex-direction: column
  border-radius: 12px
  padding: 12px
  background: $secondary-green
  gap: 12px

  @media screen and (max-width: 768px)
    border-radius: 10px
    padding: 10px
    gap: 10px


  @media screen and (min-width: 768px) and (max-width: 1024px)
    border-radius: 12px
    padding: 12px
    gap: 12px


  @media screen and (min-width: 1024px) and (max-width: 1440px)
    border-radius: 14px
    padding: 14px
    gap: 14px

  @media screen and (min-width: 1440px)
    border-radius: 18px
    padding: 18px
    gap: 18px
</style>
