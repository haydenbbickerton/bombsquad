<style scoped>
.board {
  height: 100%;
  width: 100%;
  max-width: 1200px;
  text-align: center;
  font-size: 1rem;
  display: grid;
  margin: auto;
}

.grid {
  display: grid ;
  grid-row: 1 / span 3;
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  margin: auto;
  user-select: none;
  z-index: 75;

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

.bins {
  margin-top: 50px;
  display: grid;
  grid-row: 4;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 12px;
  z-index: 50;
  align-self: end;
  user-select: none;
}
</style>

<template>
    <div class="board">
      <div class="grid" v-if="this.grid" v-bind:style="gridStyle">
          <div class="grid__item" v-for="(bomb, index) in placedBombs">
              <bomb :bomb="bomb" v-if="bomb && bomb.live" v-draggable:onDrop="bombDropped"></bomb>
          </div>
      </div>
      <div class="bins">
          <div class="bin__item" v-for="(bin, index) in bins">
             <bin :bin="bin"
                  :ref="'bin-' + bin.color"></bin>
          </div>
      </div>
    </div>

</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Bin from './Bin'
import Bomb from './Bomb'
import VueCountdown from '@xkeshi/vue-countdown'
import BoardGrid from '../services/board-grid'
import { generateBombs } from '../services/bomb-creator'
import async from 'neo-async'
import { Draggable } from '../utils/draggable-directive'

const delay = ms => new Promise(r => setTimeout(r, ms))

export default {
  components: { Bin, Bomb, 'countdown': VueCountdown },
  directives: { Draggable },
  data () {
    return {
      rows: 6,
      cols: 6,
      playing: false
    }
  },
  created () {
    const data = Array(this.rows * this.cols).fill(null)
    const grid = new BoardGrid(data, [this.rows, this.cols])
    this.$store.commit('setBoardGrid', grid)
  },
  mounted () {
    this.playing = true;
    this.startBombingRun()
    this.startBinShuffle()
  },
  computed: {
    gridStyle() {
      return {
        'grid-template-columns': `repeat(${this.cols}, auto)`
      }
    },
    placedBombs () {
       return this.grid.data.map(bombId => this.bombs[bombId])
    },
    ...mapGetters([
      'grid',
      'bombs',
      'bins'
    ])
  },
  methods: {
    bombDropped (el, vnode) {
      const bomb = vnode.componentOptions.propsData.bomb;
      const rect = el.getBoundingClientRect()
      const bombX = rect.left + (rect.width / 2)
      const bombY = rect.top + (rect.height / 2)

      // Figure out which bin the bomb was dropped into, if any
      const droppedInto = this.bins.filter(bin => {
        return (
          (bin.rect.left <= bombX && bin.rect.right >= bombX) &&
          (bin.rect.top <= bombY && bin.rect.bottom >= bombY)
        )
      })

      if (_.isEmpty(droppedInto)) {
        // The dropped it outside of a bin, return true to send bomb back to tile alive
        return true
      }

      if (bomb.color != droppedInto[0].color) {
        // Wrong bin, whoops
        this.$store.dispatch('detonateBomb', bomb)
        return false
      }

      this.$store.dispatch('disarmBomb', bomb)
      return false
    },

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
            }, 250)
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

      const bombs = generateBombs()
      /**
       * Map every bomb to an async function that's delayed according to the bombs interval.
       * We'll wait until coordinates are available before pushing.
       *
       * So if the player sucks and the board is full, all bombs wait.
       */
      const steps = bombs.map((bomb, index) => async function (done) {
        // console.log(bomb)
          const timeout = (index == 0) ? 0 : (bomb.interval * 1000);  // No delay for the first bomb
          await delay(timeout)
          bomb['coords'] = await self.getRandomUnoccupied()
          self.$store.commit('addBomb', {bomb})
          self.$store.commit('pushBombToGrid', {bomb})
          done(null)
        }
      )
      async.series(steps)
    },

    startBinShuffle () {
      async.whilst(
        () => (this.playing === true),
        (done) => {
          delay(40 * 1000).then(() => {
            this.$store.dispatch('shuffleBins')
            done()
          })
        }
      )
    }
  }
}
</script>
