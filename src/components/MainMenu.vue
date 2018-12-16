<template lang='pug'>
  .header
    .user(v-if='$store.state.user.address')
      img(:src='imgSrc')
    .notLoggedIn(v-else)
      button.btn(@click='loginUser') LOG IN

</template>

<script>
import * as identityImg from 'identity-img'
export default {
  data(){
    return{
      
    }
  },
  methods: {
    loginUser(){
      Waves.auth({
        name: 'SIRESSIGN',
        data: 'wow such hehe',
      }).then((res,err)=>{
        this.$store.commit('auth',{
          address: res.address,
          public: res.publicKey,
          sign: res.signature
        })
      })
    }
  },
  computed:{
    imgSrc(){
      return identityImg.create(this.$store.state.user.address);
    }
  }
}
</script>

<style lang='sass' scoped>
.header
  display: flex
  justify-content: flex-end
  overflow: hidden
  height: 48px
  .notLoggedIn
    .btn
      margin-top: 15px
      margin-right: 15px
      background-color: #E91E63
      color: #fff
      border-width: 0
      font-size: 28px
      padding: 0px 25px
      border-radius: 20px
      outline: none
      &:hover
        cursor: pointer
  .user
    height: 48px
    display: flex
    align-items: center
    background: #fff
    padding-right: 20px
    position: relative
    &:before
      position: absolute
      width: 60px
      height: 60px
      top: 0px
      border-bottom-left-radius: 75px
      left: -55px
      content: ''
      background: #fff
      z-index: -1
    img
      width: 40px
      height: 40px
      border-radius: 50%
</style>
