<style scoped>
.board {
  width: 500px;
  height: 500px;
  text-align: center;
  font-size: 1rem;
  background-color: #f2f2f2;
}

.grid {
  display: grid;
  grid-column-gap: 12px;
  grid-row-gap: 12px;

  &__item {
    height: 48px;
    width: 48px;
    border: 2px solid #333;

    &:nth-child(odd) {
      background-color: #ccc;
    }
    &:nth-child(even) {
      background-color: #999;
    }
  }
}
</style>

<template>
    <div class="board">
      <div class="grid" v-if="this.grid" v-bind:style="gridStyle">
          <div class="grid__item" v-for="(bomb, index) in grid.data">
            <bomb v-if="bomb && bomb.live" :bomb="bomb"></bomb>
          </div>
      </div>
      <p v-if="this.grid">{{this.grid.data}}</p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Bomb from './Bomb'
import BoardGrid from '../services/board-grid'
import { generateBombs } from '../services/bomb-creator'
import async from 'neo-async'

export default {
  components: {
      Bomb
  },
  data () {
    return {
      rows: 6,
      cols: 6
    }
  },

  created () {
    const data = Array(this.rows * this.cols).fill(null)
    const grid = new BoardGrid(data, [this.rows, this.cols])
    this.$store.commit('setBoardGrid', grid)
  },
  mounted () {
    this.startBombingRun()
  },
  computed: {
    gridStyle() {
      return {
        'grid-template-columns': `repeat(${this.cols}, auto)`
      }
    },
    ...mapGetters([
      'grid'
    ])
  },
  methods: {

    getRandomUnoccupied () {
      /**
       * This gets random unoccupied coordinates. If the board is full and there aren't
       * any open tiles, we'll check again every 0.5 sec and resolve once available.
       */
      return new Promise(resolve => {
        let coords = this.grid.getRandomUnoccupiedCoords()
        async.until(
          () => (coords !== undefined),
          (done) => {
            console.log('coords undefined, trying again')
            setTimeout(() => {
              coords = this.grid.getRandomUnoccupiedCoords()
              done()
            }, 500)
          },
          (err, results) =>  resolve(coords)
        )
      })
    },

    startBombingRun (amount) {
      /**
       * Triggers the bomb run. Each bomb gets pushed into a delayed queue, and once
       * ready (and a spot is available) it will be pushed onto the boards grid.
       */
      const self = this;
      const bombs = generateBombs();
      const delay = ms => new Promise(r => setTimeout(r, ms))

      /**
       * Map every bomb to an async function that's delayed according to the bombs interval.
       * We'll wait until coordinates are available before pushing.
       *
       * So if the player sucks and the board is full, all bombs wait.
       */
      const steps = bombs.map((bomb, index) => async function (done) {
          const timeout = (index == 0) ? 0 : (bomb.interval * 1000);  // No delay for the first bomb
          await delay(timeout)
          bomb['coords'] = await self.getRandomUnoccupied()
          self.$store.commit('pushBombToGrid', {bomb})
          done(null)
        }
      )

      async.series(steps)
    }
  }
}
</script>
