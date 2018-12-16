import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import AddDocument from '@/components/AddDocument'
import EditDocument from '@/components/EditDocument'
import ShowYourDocument from '@/components/ShowYourDocument'
import ShowGlobalDocument from '@/components/ShowGlobalDocument'
import FillDocument from '@/components/FillDocument'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },{
      path: '/add',
      name: 'AddDocument',
      component: AddDocument
    },{
      path: '/editDocs',
      name: 'EditDocument',
      component: EditDocument
    },{
      path: '/yourDoc/:name',
      name: 'ShowYourDocument',
      component: ShowYourDocument
    },{
      path: '/globalDoc/:name/:adr',
      name: 'ShowGlobalDocument',
      component: ShowGlobalDocument
    },{
      path: '/fillDoc/:name/:adr',
      name: 'FillDocument',
      component: FillDocument
    },
  ]
})
