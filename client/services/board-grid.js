import ArrayGrid from './array-grid'
import _ from 'lodash'

/**
 * This class is a 2d array used to keep track of which tiles on the board hold
 * which bombs, as well as speed up processing for fetching unoccupied tiles
 *
 * Normally it'd be nicer to keep track of occupied tiles, but the extra step
 * for diffing the arrays makes a performance difference, and we really only
 * care about knowing which tiles aren't taken (so we can put a bomb there)
 *
 * @class      BoardGrid
 */
class BoardGrid extends ArrayGrid {

  constructor(...args){
    super(...args)
    this.unoccupied = []
    this.scanForUnoccupied()
  }


  set (row, col, value) {
    const result = super.set(row, col, value)

    if (result) {
      // Remove index of added item from unoccupied list
      const newIndex = this.index(row, col)
      this.unoccupied = _.without(this.unoccupied, newIndex)

      return result
    }
  }

  remove (row, col) {
    const result = super.set(row, col, null)

    if (result) {
      // Add index of removed item to unoccupied list
      this.unoccupied.push(this.index(row, col))

      return result
    }
  }

  scanForUnoccupied () {
    this.unoccupied = this.data.reduce((acc, value, index) => (
      _.isNil(value) ? acc.concat(index) : acc
    ), [])
  }

  getOccupiedIndexes () {
    return _.without(this.data.keys(), this.unoccupied)
  }

  getUnoccupiedIndexes () {
    return this.unoccupied
  }

  getRandomUnoccupiedCoords () {
    let unoccupied = this.getUnoccupiedIndexes()
    unoccupied = unoccupied[_.random(unoccupied.length)]
    return this.coordsAt(unoccupied)
  }
}

export { BoardGrid as default }
