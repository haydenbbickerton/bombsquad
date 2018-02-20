import _ from 'lodash'

const state = {
  grid: null
}

// getters
const getters = {
  grid: state => state.grid
}

// actions
const actions = {
  addBombToBoard ({ state, commit }, bomb) {
    // console.log(`adding bomb to board ${bomb.id} at ${bomb.coords}`)
    if (!bomb.isArmed) {
      commit('pushBombToGrid', bomb)
    }
  }
}

// mutations
const mutations = {
  pushBombToGrid (state, { bomb }) {
    state.grid.set(bomb.coords[0], bomb.coords[1], bomb)
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
