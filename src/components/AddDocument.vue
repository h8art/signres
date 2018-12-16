<template lang="pug">
  .cont 
    input.text-input(placeholder='Project name',:value='$store.state.doc.name',@change='updateMessage')
    .items
      .item(v-for='item in $store.state.doc.endPoints')
        img(:src='getAvatar(item.adr)')
        span {{item.adr}}
    input.text-input.end(placeholder='Address',:value='$store.state.doc.endInput',@change='updateEndInput',v-on:keyup.enter="addEndAddress")
    form.form
      input(type='file',v-on:change='updateFile')
    .edit
      router-link(to='/editDocs') EDIT
    .action
      button(@click='sendNudes') ADD DOCUMENT
</template>

<script>
import * as identityImg from 'identity-img'

export default {
  data(){
    return{
      doc: null
    }
  },
  methods: {
    addEndAddress(){
      this.$store.commit('addEndAddress')
    },
    updateEndInput(e){
      this.$store.commit('updateEndInput',e.target.value)
    },
    getAvatar(address){
      return identityImg.create(address);
    },
    updateFile(e){
      this.$store.commit('updateFile', e.target.files[0])
    },
    sendNudes(){
      this.$store.dispatch('saveDocs')
    },
    updateMessage (e) {
      this.$store.commit('updateDocName', e.target.value)
    }
  },
}
</script>
<style scoped lang="sass">
.cont
  max-width: 1280px
  margin: 0 auto
  margin-top: 50px 
  .text-input
    background: transparent
    border-width: 0
    border-bottom: 2px solid #fff
    font-size: 18px
    color: #fff
    outline: none
  .items
    margin-top: 100px
    display: flex
    .item
      display: flex
      align-items: center
      padding: 4px 9px 
      border-radius: 13px
      background-color: #FFFFFF
      color: #181818
      margin: 0 15px
      img
        width: 40px
        height: 40px
        border-radius: 50%
      span
        margin-left: 7px
  .end
    margin-top: 40px
    width: 350px
  .form
    margin-top: 50px
  .edit
    margin-top: 20px
    text-decoration: none
    box-sizing: border-box
    padding: 15px 20px
    color: #fff
    background-color: #E91E63
    box-shadow: 0px 0px 10px rgba(0,0,0,0.4)
    border-width: 0
    font-size: 20px
    border-radius: 15px
    width: fit-content
    a
      color: #fff
      text-decoration: none
  .action
    margin-top: 25px
    button
      padding: 15px 20px
      color: #fff
      background-color: #1E2666
      box-shadow: 0px 0px 10px rgba(0,0,0,0.4)
      border-width: 0
      font-size: 20px
      border-radius: 15px
      transition: box-shadow .3s
      &:hover
        cursor: pointer
        box-shadow: 0px 0px 20px rgba(0,0,0,0.6)
</style>
