import Vue from 'vue'
import _ from 'lodash'

const state = {
  bombs: {}
}

// getters
const getters = {
  bombs: state => state.bombs,

  disarmedBombs: (state, getters) => {
    return _.filter(getters.bombs, (bomb, key) => !bomb.live && !bomb.detonated)
  }
}

// actions
const actions = {
  addBomb ({ state, commit }, bomb) {
    commit('addBomb', bomb)
  },

  detonateBomb ({ state, commit }, bomb) {
    if (bomb.live && !bomb.detonated) {
      state.bombs[bomb.id].detonated = true
      setTimeout(() => {
        state.bombs[bomb.id].live = false
      }, 1000)
    }
  },
  disarmBomb ({ state, commit }, bomb) {
    commit('disarmBomb', { bomb })
  }
}

// mutations
const mutations = {
  addBomb (state, { bomb }) {
    Vue.set(state.bombs, bomb.id, bomb)
  },

  disarmBomb (state, { bomb }) {
    state.bombs[bomb.id].live = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
