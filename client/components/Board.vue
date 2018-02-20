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
import Sequenza from 'sequenza'

export default {
  components: {
      Bomb
  },
  data () {
    return {
      rows: 12,
      cols: 12
    }
  },

  created () {
    const data = Array(this.rows * this.cols).fill(null)
    const grid = new BoardGrid(data, [this.rows, this.cols])
    this.$store.commit('setBoardGrid', grid)
  },
  mounted () {
    this.startBombingRun(5)
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
      let unoccupied = this.grid.getUnoccupiedIndexes()
      unoccupied = unoccupied[_.random(unoccupied.length)]
      return this.grid.coordsAt(unoccupied)
    },

    startBombingRun (amount) {
      /**
       * Triggers the bomb run. Each bomb gets pushed into a delayed queue,
       * and once ready it will be pushed onto the boards grid.
       */
      const self = this;
      const bombs = generateBombs();
      var sequenza = new Sequenza();

      bombs.forEach((bomb, index) => {
        sequenza.queue({
          callback () {
            let coords = undefined;

            checkCoords: while (coords === undefined) {
              /**
               * Something is broken with the random coordinate function and it
               * passes undefined, but I'm on limited time so here is a quick
               * hack to keep things running
               */
                coords = self.getRandomUnoccupied()
                if (coords === undefined) {
                  coords = self.getRandomUnoccupied()
                }
            }

            bomb['coords'] = coords
            self.$store.commit('pushBombToGrid', {bomb})
          },
          delay: (index == 0) ? 0 : (bomb.interval * 1000)
        })
      })

      sequenza.start({
        iterations: 1
      });
    }
  }
}
</script>
