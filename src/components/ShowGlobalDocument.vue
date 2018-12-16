<template lang="pug">
  .cont 
    .head
      h1 {{$route.params.name}} 
      router-link.btn(:to='"/fillDoc/"+$route.params.name+"/"+$route.params.adr') EDIT
</template>

<script>
import axios from 'axios'
import * as identityImg from 'identity-img'
export default {
  methods: {
    getAvatar(adr){
      return identityImg.create(adr);
    }
  },
  data(){
    return{
      images: [],
      inputs: [],
      endPoints: []
    }
  },
  computed:{
    endPointsSum(){
      return this.endPoints.reduce((acc,item,index)=>{
        if(item.isReady) return acc + 1
        else return acc
      },0)
    }
  },
  created(){
    var documents
    axios.get('https://testnodes.wavesnodes.com/addresses/data/'+this.$store.state.user.address).then(response=>{
      documents=response.data.filter(item=>{
        if(item.key.indexOf('SIGNES')>-1&&item.key.indexOf(this.$route.params.name)>-1)  return item
      })
      this.images = documents.filter(item=>{
        if(item.key.indexOf('DOC')>-1) return item
      })
      this.inputs = documents.filter(item=>{
        if(item.key.indexOf('INPUT')>-1) return item
      })
      this.endPoints = this.inputs.map(item=>{
        return {
          address: item.key.split('_')[1],
          isReady: false
        }
      })
    })
  }
}
</script>

<style lang='sass' scoped>
.cont
  max-width: 1280px
  margin: 0 auto
  margin-top: 50px
  .head
    display: flex
    align-items: center
    .btn
      margin-left: 15px
      padding: 10px 20px
      color: #fff
      background-color: #E91E63
      border-radius: 15px
      box-shadow: 0px 0px 10px rgba(0,0,0,0.4)
      transition: box-shadow .3s
      &:hover
        box-shadow: 0px 0px 20px rgba(0,0,0,0.6)
        cursor: pointer
  h1
    color: #fff
  h3
    color: #fff
  .ready
    &-item
      display: flex
      align-items: center
      img
        width: 24px
        height: 24px
        border-radius: 50%
      span
        color: #fff
        margin-right: 20px
        margin-left: 10px
      .yes
        width: 24px
        height: 24px
        background-size: 100% 100%
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDI2IDI2IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNiAyNiIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+CiAgPHBhdGggZD0ibS4zLDE0Yy0wLjItMC4yLTAuMy0wLjUtMC4zLTAuN3MwLjEtMC41IDAuMy0wLjdsMS40LTEuNGMwLjQtMC40IDEtMC40IDEuNCwwbC4xLC4xIDUuNSw1LjljMC4yLDAuMiAwLjUsMC4yIDAuNywwbDEzLjQtMTMuOWgwLjF2LTguODgxNzhlLTE2YzAuNC0wLjQgMS0wLjQgMS40LDBsMS40LDEuNGMwLjQsMC40IDAuNCwxIDAsMS40bDAsMC0xNiwxNi42Yy0wLjIsMC4yLTAuNCwwLjMtMC43LDAuMy0wLjMsMC0wLjUtMC4xLTAuNy0wLjNsLTcuOC04LjQtLjItLjN6IiBmaWxsPSIjOTFEQzVBIi8+Cjwvc3ZnPgo=)
      .no
        width: 24px
        height: 24px
        background-size: 100% 100%
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDIxLjkgMjEuOSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjEuOSAyMS45IiB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4Ij4KICA8cGF0aCBkPSJNMTQuMSwxMS4zYy0wLjItMC4yLTAuMi0wLjUsMC0wLjdsNy41LTcuNWMwLjItMC4yLDAuMy0wLjUsMC4zLTAuN3MtMC4xLTAuNS0wLjMtMC43bC0xLjQtMS40QzIwLDAuMSwxOS43LDAsMTkuNSwwICBjLTAuMywwLTAuNSwwLjEtMC43LDAuM2wtNy41LDcuNWMtMC4yLDAuMi0wLjUsMC4yLTAuNywwTDMuMSwwLjNDMi45LDAuMSwyLjYsMCwyLjQsMFMxLjksMC4xLDEuNywwLjNMMC4zLDEuN0MwLjEsMS45LDAsMi4yLDAsMi40ICBzMC4xLDAuNSwwLjMsMC43bDcuNSw3LjVjMC4yLDAuMiwwLjIsMC41LDAsMC43bC03LjUsNy41QzAuMSwxOSwwLDE5LjMsMCwxOS41czAuMSwwLjUsMC4zLDAuN2wxLjQsMS40YzAuMiwwLjIsMC41LDAuMywwLjcsMC4zICBzMC41LTAuMSwwLjctMC4zbDcuNS03LjVjMC4yLTAuMiwwLjUtMC4yLDAuNywwbDcuNSw3LjVjMC4yLDAuMiwwLjUsMC4zLDAuNywwLjNzMC41LTAuMSwwLjctMC4zbDEuNC0xLjRjMC4yLTAuMiwwLjMtMC41LDAuMy0wLjcgIHMtMC4xLTAuNS0wLjMtMC43TDE0LjEsMTEuM3oiIGZpbGw9IiNEODAwMjciLz4KPC9zdmc+Cg==)

</style>