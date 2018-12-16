<template lang='pug'>
div
  main-menu
  router-view
</template>

<script>
import MainMenu from '@/components/MainMenu.vue'
export default {
  name: 'App',
  components: { MainMenu }
}
</script>

<style lang='sass'>
body
  margin: 0
  font-family: 'Roboto'
  background: #10153A
</style>
