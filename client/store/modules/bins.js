import Vue from 'vue'
import _ from 'lodash'

const state = {
  bins: ['blue', 'green', 'red'].map(color => ({
    hovering: false,
    rect: null, // will hold getBoundingClientRect()
    color
  }))
}

// getters
const getters = {
  bins: state => state.bins
}

// actions
const actions = {
  shuffleBins ({ state, commit }) {
    console.log('shuffling bins')
    _.shuffle(state.bins).forEach((bin, index) => {
      Vue.set(state.bins, index, bin)
    })
  }
}

// mutations
const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
