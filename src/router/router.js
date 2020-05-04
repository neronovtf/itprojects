import Vue from 'vue'
import VueRouter from 'vue-router'

import VueNotes from '../components/VueNotes'
import VueEditNote from '../components/VueEditNote'

Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'notes',
      component: VueNotes
    },
    {
      path: '/note/:id',
      name: 'note',
      component: VueEditNote,
      props: true,
    }
  ]
})

export default router