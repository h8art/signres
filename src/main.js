// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import App from './App'
import router from './router'
import vueSignature from "vue-signature"

Vue.use(vueSignature)
Vue.use(Vuex);
Vue.config.productionTip = false


const store = new Vuex.Store({
  state: {
    count: 0,
    user: {
      address: '',
      public: '',
      sign: ''
    },
    doc: {
      file: '',
      endInput: '',
      name: '',
      endPoints: [],
      images: [],
      inputs: []
    },
  },
  mutations: {
    updateInputs(state,inputs){
      state.doc.inputs=inputs
    },
    updateImages(state,images){
      state.doc.images=images
    },
    addEndAddress (state) {
      state.doc.endPoints.push({
        adr: state.doc.endInput, 
        color: '#'+Math.floor(Math.random()*16777215).toString(16)
      })
      state.doc.endInput=''
    },
    updateDocName (state,input){
      state.doc.name=input
    },
    updateEndInput (state,input){
      state.doc.endInput=input
    },
    updateFile (state, file) {
      state.doc.file = file
    },
    auth(state, body){
      state.user=body
    }
  },
  actions: {
    saveDocs({commit,state}){
      function lzw_encode(s) {
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i=1; i<data.length; i++) {
            currChar=data[i];
            if (dict[phrase + currChar] != null) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase=currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (var i=0; i<out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
      }
      var images = state.doc.images
      var encode = lzw_encode(JSON.stringify(images).toString())
      var charsItems = encode.match(/.{1,7500}/g)
      var counter=0
      var blocksCount = Math.ceil(charsItems.length/4)
      for(var i=0;i<blocksCount;i+=4){
        var tempData = [{ type: 'string', key: 'blockname', value: counter.toString() },]
        var loopCount = 0
        if(blocksCount-i>4) loopCount=4
        else loopCount = blocksCount-i
        //тут чуть чанки сбились, мы пофиксим
        for(var j=0;j<loopCount;j++){
          tempData.push({
            type: 'string', 
            key: 'SIGNES_'+state.user.address+'_DOC_'+state.doc.name+'_BLOCK'+j, 
            value: charsItems[i+j]
          })
        }
        Waves.signAndPublishTransaction({
          type: 12,
          data:{
            fee: {
              assetId: 'WAVES',
              tokens: 0.095
            },
            data: tempData,
          },
          recipient: state.user.address
        }).then((res,err)=>{
          console.log(res)
          console.log(err)
        })
        counter++
      }
      for (var k in state.doc.inputs){
        var structure = JSON.stringify(state.doc.inputs[k]).toString()
        Waves.signAndPublishTransaction({
          type: 12,
          data:{
            fee: {
              assetId: 'WAVES',
              tokens: 0.095
            },
            data: [{
              type: 'string',
              key: 'SIGNES_'+state.user.address+'_INPUT_'+state.doc.name+'_'+k,
              value: structure
            }],
          },
          recipient: state.user.address
        }).then((res,err)=>{
          console.log(res)
          console.log(err)
        })
      }
    }
  }
})

sync(store, router)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
