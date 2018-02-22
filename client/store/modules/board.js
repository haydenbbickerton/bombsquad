import Vue from 'vue'
import _ from 'lodash'

const state = {
  grid: null
}

// getters
const getters = {
  grid: state => state.grid,

  placedBombs: (state, getters, rootState, rootGetters) => {
    const bombs = rootGetters.bombs
    return getters.grid.data.map(bombId => bombs[bombId])
  }
}

// actions
const actions = {
  addBombToBoard ({ state, commit }, bomb) {
    if (!bomb.isArmed) {
      commit('pushBombToGrid', bomb)
    }
  }
}

// mutations
const mutations = {
  pushBombToGrid (state, { bomb }) {
    state.grid.set(bomb.coords[0], bomb.coords[1], bomb.id)
  },

  removeBombFromGrid (state, { bomb }) {
    state.grid.remove(bomb.coords[0], bomb.coords[1])
  },

  setBoardGrid (state, grid) {
    state.grid = grid
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
