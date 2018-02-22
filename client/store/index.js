import Vue from 'vue'
import Vuex from 'vuex'
import bins from './modules/bins'
import board from './modules/board'
import bombs from './modules/bombs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    bins,
    board,
    bombs
  }
})
