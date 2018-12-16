<template lang="pug">
.cont
  .tabs
    .tab-header
      .select(@click='actualTab="my"', :class='{ "active" : actualTab == "my" }') MY DOCUMENTS
      .select(@click='actualTab="our"', :class='{ "active" : actualTab == "our" }') SHARED DOCUMENTS
    .tab-body(v-if='$store.state.user.public')
      .my-docs(v-if='actualTab=="my"')
        .documents
          .document
            router-link.img-cont(to='/add',tag="div")
              img(src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCA0NDggNDQ4IiB3aWR0aD0iNjRweCI+PHBhdGggZD0ibTQwOCAxODRoLTEzNmMtNC40MTc5NjkgMC04LTMuNTgyMDMxLTgtOHYtMTM2YzAtMjIuMDg5ODQ0LTE3LjkxMDE1Ni00MC00MC00MHMtNDAgMTcuOTEwMTU2LTQwIDQwdjEzNmMwIDQuNDE3OTY5LTMuNTgyMDMxIDgtOCA4aC0xMzZjLTIyLjA4OTg0NCAwLTQwIDE3LjkxMDE1Ni00MCA0MHMxNy45MTAxNTYgNDAgNDAgNDBoMTM2YzQuNDE3OTY5IDAgOCAzLjU4MjAzMSA4IDh2MTM2YzAgMjIuMDg5ODQ0IDE3LjkxMDE1NiA0MCA0MCA0MHM0MC0xNy45MTAxNTYgNDAtNDB2LTEzNmMwLTQuNDE3OTY5IDMuNTgyMDMxLTggOC04aDEzNmMyMi4wODk4NDQgMCA0MC0xNy45MTAxNTYgNDAtNDBzLTE3LjkxMDE1Ni00MC00MC00MHptMCAwIiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+Cg==")
          .document(v-for='document in items')
            span.title {{document}}
            .visitFull 
              router-link(:to='"/yourDoc/"+document') MORE
      .shared-docs(v-else)
        .body
          .search
            input(placeholder='Address',v-on:keyup.enter='getFromAdr')
          .body-cont
            .document(v-for='document in sharedDocs')
              span.title {{document}}
              .visitFull 
                router-link(:to='"/globalDoc/"+document+"/"+queryAdr') MORE
    h1.login(v-else) Please login :(

</template>
<script>
import imagesArr from './images.js'
import axios from 'axios'
export default {
  data(){
    return{
      actualTab: 'my',
      queryAdr: '',
      items: [],
      sharedDocs: []
    }
  },
  methods: {
    getFromAdr(e){
      this.queryAdr=e.target.value
      function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
      }
      var documents
      axios.get('https://testnodes.wavesnodes.com/addresses/data/'+e.target.value).then(response=>{
        documents=response.data.filter(item=>{
          if(item.key.indexOf('SIGNES')>-1&&item.key.indexOf(this.$store.state.user.address)>-1)  return item
        })
        var names = documents.map((item)=>{
          return item.key.split('_')[3]
        })
        var unique = names.filter( onlyUnique );
        this.sharedDocs=unique
      })
    }
  },
  created(){
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }
    var documents
    axios.get('https://testnodes.wavesnodes.com/addresses/data/'+this.$store.state.user.address).then(response=>{
      documents=response.data.filter(item=>{
        if(item.key.indexOf('SIGNES')>-1)  return item
      })
      var names = documents.map((item)=>{
        return item.key.split('_')[3]
      })
      var unique = names.filter( onlyUnique );
      this.items=unique
    })

    
  }
}
</script>
<style lang="sass" scoped>
.cont
  max-width: 1280px
  margin: 0 auto
  margin-top: 50px
  .tabs
    .login
      color: #fff
      text-align: center
    .tab-body
      .shared-docs
        margin-top: 30px
        margin-left: 24px
        .body
          .search 
            input
              outline: none
              background: transparent
              border-width: 0
              border-bottom: 2px solid #fff
              color: #fff
              font-size: 20px
              width: 430px
          &-cont
            display: flex
            flex-wrap: wrap
            margin-top: 30px
            .document
              padding: 15px 30px
              background: linear-gradient(to top,#18203E,#222D53)
              box-shadow: 0 5px 10px rgba(0,0,0,0.3)
              border-radius: 15px
              margin: 0 15px
              .title
                font-size: 24px
                font-weight: bold
                color: #fff
                text-align: center
              .visitFull
                background-color: #E91E63
                color: #fff
                padding: 10px 15px
                border-radius: 8px
                width: fit-content
                margin: 0 auto
                margin-top: 50px
                box-shadow: 0 5px 10px rgba(0,0,0,0.3)
                transition: box-shadow .3s
                a
                  color: #fff
                  text-decoration: none
                &:hover
                  cursor: pointer
                  box-shadow: 0 5px 15px rgba(0,0,0,0.6)
      .my-docs
        .documents
          display: flex
          flex-wrap: wrap
          margin-top: 30px
          .document
            padding: 15px 30px
            background: linear-gradient(to top,#18203E,#222D53)
            box-shadow: 0 5px 10px rgba(0,0,0,0.3)
            border-radius: 15px
            margin: 0 15px
            .img-cont
              padding: 20px
              border-radius: 50%
              background-color: #E91E63
              &:hover
                cursor: pointer
            .title
              font-size: 24px
              font-weight: bold
              color: #fff
              text-align: center
            .visitFull
              background-color: #E91E63
              color: #fff
              padding: 10px 15px
              border-radius: 8px
              width: fit-content
              margin: 0 auto
              margin-top: 50px
              box-shadow: 0 5px 10px rgba(0,0,0,0.3)
              transition: box-shadow .3s
              a
                color: #fff
                text-decoration: none
              &:hover
                cursor: pointer
                box-shadow: 0 5px 15px rgba(0,0,0,0.6)
    .tab-header
      display: flex
      width: fit-content
      color: #fff
      .select
        padding: 10px 20px
        border-left: 2px solid transparent
        border-top: 2px solid transparent
        border-right: 2px solid transparent
        border-top-left-radius: 15px
        border-top-right-radius: 15px
        transition: all .3s linear
        &:hover 
          cursor: pointer
          background-color: #ea4c82
          border-left: 2px solid #ea4c82
          border-top: 2px solid #ea4c82
          border-right: 2px solid #ea4c82
      .active
        border-left: 2px solid #E91E63
        border-top: 2px solid #E91E63
        border-right: 2px solid #E91E63
        &:hover
          background-color: transparent
          border-left: 2px solid #E91E63
          border-top: 2px solid #E91E63
          border-right: 2px solid #E91E63
</style>
