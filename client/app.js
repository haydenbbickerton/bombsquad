import Vue from 'vue'
import Home from './views/Home'
import store from './store'

const app = new Vue({
  store,
  ...Home
})

export { app, store }
