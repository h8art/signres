<template lang='pug'>
.cont
  .documents-cont
    .document(ref='doc')
      img(:src='"data:image/jpeg;base64,"+images[currPage].FileData',@click='clickDoc',v-if='images.length>0')
      .rectangle(v-for='rect, index in rects[currPage]', :style='{width: rect.width + "px", height: rect.height + "px", left: rect.left + "px", top: rect.top + "px", backgroundColor: rect.color}', :key='index')
        input(v-if='rect.type=="text"',@change='changeInput($event,index)',:value='rect.value')
        img(src='/static/picture.svg', v-if='rect.type=="img"')
        img(src='/static/contract.svg', v-if='rect.type=="sign"')
      .options(:class='{ "options-vis" : options.vis }', :style='{ top: options.top + "px", left: options.left + 10 + "px" }')
        .options-cont
          .img(@click='optionClick("img")')
          .text(@click='optionClick("text")')
          .sign(@click='optionClick("sign")')
          select(@change='changeSelect', :value='selectUser')
            option(v-for='user,ind in $store.state.doc.endPoints', :value='ind',) {{user.adr}}
    .pages
      span.arrow(@click='currPage--') &darr;
      span {{ (currPage + 1) + "/" + images.length}}
      span.arrow(@click='currPage++') &uarr;
    .users
      div(v-for='user in $store.state.doc.endPoints', :style='{ backgroundColor: user.color }')
        img(:src='getAvatar(user.adr)')
    .actions
      .btn(@click='saveDocument')
        span SAVE
      router-link.btn(to='/add')
        span RETURN
    
</template>

<script>
import axios from 'axios'
import * as identityImg from 'identity-img'
export default {
  name: 'Main',
  methods: {
    saveDocument(){
      this.$store.commit('updateInputs',this.rects)
      this.$store.commit('updateImages',this.images.map((image)=>image.FileData))
    },
    getAvatar(adr){
      return identityImg.create(adr);
    },
    changeSelect(e){
      this.selectUser=e.target.value
      let lastInd = this.rects[this.currPage].length-1
      console.log(lastInd)
      this.rects[this.currPage][lastInd].color=this.$store.state.doc.endPoints[this.selectUser].color
    },
    changeInput(e,ind){
      console.log(this.rects[this.currPage])
      this.rects[this.currPage][ind].value=e.target.value
    },
    setMousePosition(e){
      var ev = e
      this.mouse.x = ev.pageX + window.pageXOffset - (window.innerWidth/2 - 250)
      this.mouse.y = ev.pageY + window.pageYOffset - 50
    },
    optionClick (type){
      const ind = this.rects[this.currPage].length-1
      this.options.vis=false
      this.noClickOption=true
      this.rects[this.currPage][ind].type=type
      setTimeout(()=>this.noClickOption=false,1000)
    },
    clickDoc (e) {
      const canvas = this.$refs.doc
      if(!this.noClickOption){
        if (this.isElement) {
          this.isElement=false
          this.options.vis=true
          this.options.top=this.mouse.y
          this.options.left=this.mouse.x
          canvas.style.cursor = "default";
        } else {
          this.mouse.startX = this.mouse.x;
          this.mouse.startY = this.mouse.y;
          this.isElement = true
          this.rects[this.currPage].push({
            left: this.mouse.x,
            top: this.mouse.y,
            width: 0,
            height: 0,
            type: null,
            value: '',
            userName: this.$store.state.doc.endPoints[0].adr,
            color: this.$store.state.doc.endPoints[0].color
          })
          canvas.style.cursor = "crosshair";
        }
      }
    }
  },
  data () {
    return {
      isElement: false,
      images: imagesArr,
      currPage: 0,
      selectUser: null,
      mouse: {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
      },
      rects: [],
      options: {
        vis: false,
        left: 0,
        top: 0,
        class: ''
      }
    }
  },
  mounted(){
    for(var i=0;i<this.images.length;i++){
      this.rects.push([])
    }
    this.users = this.$store.state.doc.endPoints
    var formData = new FormData();
    formData.append('File', this.$store.state.doc, 'my_file.docx');

    axios.post('https://v2.convertapi.com/convert/docx/to/jpg?Secret=EPZWPzuwe6jlyHVG',formData,{
      processData: false,
      contentType: false, 
    }).then(response=>{
      console.log(response)
      this.images=response.data
      
    })
    const canvas = this.$refs.doc
    canvas.onmousemove = (e) => {
      this.setMousePosition(e);
      if (this.isElement) {
        const ind = this.rects[this.currPage].length-1
        this.rects[this.currPage][ind].width = Math.abs(this.mouse.x - this.mouse.startX);
        this.rects[this.currPage][ind].height = Math.abs(this.mouse.y - this.mouse.startY);
        this.rects[this.currPage][ind].left = (this.mouse.x - this.mouse.startX < 0) ? this.mouse.x : this.mouse.startX;
        this.rects[this.currPage][ind].top = (this.mouse.y - this.mouse.startY < 0) ? this.mouse.y : this.mouse.startY;
      }
    }
  }
}
</script>


<style scoped lang='sass'>
.cont
  .documents-cont
    background-color: #707279
    width: 100vw
    height: calc(100vh - 48px)
    position: relative
    .pages
      position: absolute
      bottom: 15px
      right: 15px
      padding: 10px 15px
      border-radius: 15px
      background-color: #292A2F
      color: #fff
      width: 150px
      display: flex
      justify-content: space-between
      align-items: center
      .arrow
        user-select: none
        &:hover
          cursor: pointer
    .actions
      position: absolute
      left: 15px
      bottom: 15px
      display: flex
      justify-content: space-between
      width: 195px
      .btn
        padding: 8px 20px
        background-color: #E91E63
        color: #fff
        border-radius: 8px
        box-shadow: 0 0 10px rgba(0,0,0,.4)
        transition: box-shadow .3s
        text-decoration: none
        &:hover
          cursor: pointer
          box-shadow: 0 0 20px rgba(0,0,0,.6)
    .users
      position: absolute
      top: 15px
      right: 15px
      background-color: #fff
      border-radius: 15px
      padding: 2px 7px
      width: fit-content
      div
        padding: 4px 10px
        margin: 10px 0px
        color: #fff
        img
          width: 40px
          height: 40px
          border-radius: 50%
    .document
      width: 500px
      height: 708px
      position: absolute
      box-shadow: 0 0 20px rgba(0,0,0,0.5)
      left: calc(50% - 250px)
      top: 5px
      img
        width: 100%
      .options
        position: absolute
        top: 0
        left: 15px
        visibility: hidden
        z-index: 4
        &-cont
          position: relative
          .img
            background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU4IDU4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1OCA1ODsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik01Nyw2SDFDMC40NDgsNiwwLDYuNDQ3LDAsN3Y0NGMwLDAuNTUzLDAuNDQ4LDEsMSwxaDU2YzAuNTUyLDAsMS0wLjQ0NywxLTFWN0M1OCw2LjQ0Nyw1Ny41NTIsNiw1Nyw2eiBNNTYsNTBIMlY4aDU0VjUweiIgZmlsbD0iI0ZGRkZGRiIvPgoJPHBhdGggZD0iTTE2LDI4LjEzOGMzLjA3MSwwLDUuNTY5LTIuNDk4LDUuNTY5LTUuNTY4QzIxLjU2OSwxOS40OTgsMTkuMDcxLDE3LDE2LDE3cy01LjU2OSwyLjQ5OC01LjU2OSw1LjU2OSAgIEMxMC40MzEsMjUuNjQsMTIuOTI5LDI4LjEzOCwxNiwyOC4xMzh6IE0xNiwxOWMxLjk2OCwwLDMuNTY5LDEuNjAyLDMuNTY5LDMuNTY5UzE3Ljk2OCwyNi4xMzgsMTYsMjYuMTM4cy0zLjU2OS0xLjYwMS0zLjU2OS0zLjU2OCAgIFMxNC4wMzIsMTksMTYsMTl6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8cGF0aCBkPSJNNyw0NmMwLjIzNCwwLDAuNDctMC4wODIsMC42Ni0wLjI0OWwxNi4zMTMtMTQuMzYybDEwLjMwMiwxMC4zMDFjMC4zOTEsMC4zOTEsMS4wMjMsMC4zOTEsMS40MTQsMHMwLjM5MS0xLjAyMywwLTEuNDE0ICAgbC00LjgwNy00LjgwN2w5LjE4MS0xMC4wNTRsMTEuMjYxLDEwLjMyM2MwLjQwNywwLjM3MywxLjA0LDAuMzQ1LDEuNDEzLTAuMDYyYzAuMzczLTAuNDA3LDAuMzQ2LTEuMDQtMC4wNjItMS40MTNsLTEyLTExICAgYy0wLjE5Ni0wLjE3OS0wLjQ1Ny0wLjI2OC0wLjcyLTAuMjYyYy0wLjI2NSwwLjAxMi0wLjUxNSwwLjEyOS0wLjY5NCwwLjMyNWwtOS43OTQsMTAuNzI3bC00Ljc0My00Ljc0MyAgIGMtMC4zNzQtMC4zNzMtMC45NzItMC4zOTItMS4zNjgtMC4wNDRMNi4zMzksNDQuMjQ5Yy0wLjQxNSwwLjM2NS0wLjQ1NSwwLjk5Ny0wLjA5LDEuNDEyQzYuNDQ3LDQ1Ljg4Niw2LjcyMyw0Niw3LDQ2eiIgZmlsbD0iI0ZGRkZGRiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)
            background-color: #102237
            background-position: center center
            background-repeat: no-repeat
            background-size: 60% 60%
          .text
            background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDM1Ni40ODQgMzU2LjQ4NCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzU2LjQ4NCAzNTYuNDg0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTI5My45ODQsNy4yM0g2Mi41QzI4LjAzNyw3LjIzLDAsMzUuMjY4LDAsNjkuNzMxdjE0Mi43OGMwLDM0LjQ2MywyOC4wMzcsNjIuNSw2Mi41LDYyLjVsMTQ3LjQ0MywwLjAwMWw3MC41ODEsNzAuNTggICAgYzIuMzkyLDIuMzkzLDUuNTg4LDMuNjYyLDguODQyLDMuNjYyYzEuNjEsMCwzLjIzNC0wLjMxMiw0Ljc4LTAuOTUzYzQuNjcxLTEuOTM0LDcuNzE3LTYuNDksNy43MTctMTEuNTQ3di02Mi4yMzcgICAgYzMwLjc1OS0zLjg4NSw1NC42MjEtMzAuMjExLDU0LjYyMS02Mi4wMDZWNjkuNzMxQzM1Ni40ODQsMzUuMjY4LDMyOC40NDcsNy4yMywyOTMuOTg0LDcuMjN6IE0zMzEuNDg0LDIxMi41MTIgICAgYzAsMjAuNjc4LTE2LjgyMiwzNy41LTM3LjUsMzcuNWgtNC42MjFjLTYuOTAzLDAtMTIuNSw1LjU5OC0xMi41LDEyLjV2NDQuMDY0bC01Mi45MDMtNTIuOTAzICAgIGMtMi4zNDQtMi4zNDUtNS41MjItMy42NjEtOC44MzktMy42NjFINjIuNWMtMjAuNjc4LDAtMzcuNS0xNi44MjItMzcuNS0zNy41VjY5LjczMmMwLTIwLjY3OCwxNi44MjItMzcuNSwzNy41LTM3LjVoMjMxLjQ4NCAgICBjMjAuNjc4LDAsMzcuNSwxNi44MjIsMzcuNSwzNy41VjIxMi41MTJ6IiBmaWxsPSIjRkZGRkZGIi8+CgkJPHBhdGggZD0iTTI3MC4yNDIsOTUuNzQzaC0xODRjLTYuOTAzLDAtMTIuNSw1LjU5Ni0xMi41LDEyLjVjMCw2LjkwMyw1LjU5NywxMi41LDEyLjUsMTIuNWgxODRjNi45MDMsMCwxMi41LTUuNTk3LDEyLjUtMTIuNSAgICBDMjgyLjc0MiwxMDEuMzM5LDI3Ny4xNDYsOTUuNzQzLDI3MC4yNDIsOTUuNzQzeiIgZmlsbD0iI0ZGRkZGRiIvPgoJCTxwYXRoIGQ9Ik0yNzAuMjQyLDE2NS43NDNoLTE4NGMtNi45MDMsMC0xMi41LDUuNTk2LTEyLjUsMTIuNXM1LjU5NywxMi41LDEyLjUsMTIuNWgxODRjNi45MDMsMCwxMi41LTUuNTk3LDEyLjUtMTIuNSAgICBTMjc3LjE0NiwxNjUuNzQzLDI3MC4yNDIsMTY1Ljc0M3oiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)
            background-color: #102237
            background-position: center center
            background-repeat: no-repeat
            background-size: 60% 60%
            margin: 10px 0
          .sign
            background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgLTEgNDAxLjUyMjg5IDQwMSIgd2lkdGg9IjI0cHgiPjxwYXRoIGQ9Im0zNzAuNTg5ODQ0IDI1MC45NzI2NTZjLTUuNTIzNDM4IDAtMTAgNC40NzY1NjMtMTAgMTB2ODguNzg5MDYzYy0uMDE5NTMyIDE2LjU2MjUtMTMuNDM3NSAyOS45ODQzNzUtMzAgMzBoLTI4MC41ODk4NDRjLTE2LjU2MjUtLjAxNTYyNS0yOS45ODA0NjktMTMuNDM3NS0zMC0zMHYtMjYwLjU4OTg0NGMuMDE5NTMxLTE2LjU1ODU5NCAxMy40Mzc1LTI5Ljk4MDQ2OSAzMC0zMGg4OC43ODkwNjJjNS41MjM0MzggMCAxMC00LjQ3NjU2MyAxMC0xMCAwLTUuNTE5NTMxLTQuNDc2NTYyLTEwLTEwLTEwaC04OC43ODkwNjJjLTI3LjYwMTU2Mi4wMzEyNS00OS45Njg3NSAyMi4zOTg0MzctNTAgNTB2MjYwLjU5Mzc1Yy4wMzEyNSAyNy42MDE1NjMgMjIuMzk4NDM4IDQ5Ljk2ODc1IDUwIDUwaDI4MC41ODk4NDRjMjcuNjAxNTYyLS4wMzEyNSA0OS45Njg3NS0yMi4zOTg0MzcgNTAtNTB2LTg4Ljc5Mjk2OWMwLTUuNTIzNDM3LTQuNDc2NTYzLTEwLTEwLTEwem0wIDAiIGZpbGw9IiNGRkZGRkYiLz48cGF0aCBkPSJtMzc2LjYyODkwNiAxMy40NDE0MDZjLTE3LjU3NDIxOC0xNy41NzQyMTgtNDYuMDY2NDA2LTE3LjU3NDIxOC02My42NDA2MjUgMGwtMTc4LjQwNjI1IDE3OC40MDYyNWMtMS4yMjI2NTYgMS4yMjI2NTYtMi4xMDU0NjkgMi43MzgyODItMi41NjY0MDYgNC40MDIzNDRsLTIzLjQ2MDkzNyA4NC42OTkyMTljLS45NjQ4NDQgMy40NzI2NTYuMDE1NjI0IDcuMTkxNDA2IDIuNTYyNSA5Ljc0MjE4NyAyLjU1MDc4MSAyLjU0Njg3NSA2LjI2OTUzMSAzLjUyNzM0NCA5Ljc0MjE4NyAyLjU2NjQwNmw4NC42OTkyMTktMjMuNDY0ODQzYzEuNjY0MDYyLS40NjA5MzggMy4xNzk2ODctMS4zNDM3NSA0LjQwMjM0NC0yLjU2NjQwN2wxNzguNDAyMzQzLTE3OC40MTAxNTZjMTcuNTQ2ODc1LTE3LjU4NTkzNyAxNy41NDY4NzUtNDYuMDU0Njg3IDAtNjMuNjQwNjI1em0tMjIwLjI1NzgxMiAxODQuOTA2MjUgMTQ2LjAxMTcxOC0xNDYuMDE1NjI1IDQ3LjA4OTg0NCA0Ny4wODk4NDQtMTQ2LjAxNTYyNSAxNDYuMDE1NjI1em0tOS40MDYyNSAxOC44NzUgMzcuNjIxMDk0IDM3LjYyNS01Mi4wMzkwNjMgMTQuNDE3OTY5em0yMjcuMjU3ODEyLTE0Mi41NDY4NzUtMTAuNjA1NDY4IDEwLjYwNTQ2OS00Ny4wOTM3NS00Ny4wOTM3NSAxMC42MDkzNzQtMTAuNjA1NDY5YzkuNzYxNzE5LTkuNzYxNzE5IDI1LjU4OTg0NC05Ljc2MTcxOSAzNS4zNTE1NjMgMGwxMS43MzgyODEgMTEuNzM0Mzc1YzkuNzQ2MDk0IDkuNzczNDM4IDkuNzQ2MDk0IDI1LjU4OTg0NCAwIDM1LjM1OTM3NXptMCAwIiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+Cg==)
            background-color: #102237
            background-position: center center
            background-repeat: no-repeat
            background-size: 60% 60%
        div
          width: 32px
          height: 32px
          border-radius: 50%
        &-vis
          visibility: visible
.rectangle
  z-index: 3
  opacity: .9
  position: absolute
  display: flex
  align-items: center
  justify-content: center
  input
    background-color: transparent
    border-width: 0
    border-bottom: 3px solid #fff
    width: 80%
    font-size: 18px
    outline: none
    color: #fff
  img
    max-width: 80%
    max-height: 80%
</style>