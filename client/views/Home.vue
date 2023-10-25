<style >
html, body {
    margin: 0;
    font-size: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'avenir next', avenir, helvetica, 'helvetica neue', Ubuntu, 'segoe ui', arial, sans-serif;
    height: 100%;
    width: 100%;
}

#app {
    height: 100%;
    width: 100%;
    display: grid;
    text-align: center;
    color: white;
    background: url('/bombsquad/static/img/background.png') no-repeat;
    background-position: center bottom;
    background-size: 100% auto;
    grid-template-rows: 200px 1fr auto;

    /* nesting for the need to test postcss */
    code {
        background-color: #f0f0f0;
        padding: 3px 5px;
        border-radius: 2px;
    }
}

header {
    padding: 0 0.5rem;
    display: grid;
    grid-auto-columns: 1fr;

    .score, .title {
        grid-row: 1;
        text-shadow: 3px 3px 1px black;
    }
    .score {
        text-align: left;
    }
    .title {
        text-align: right;
    }

}

.ground {
    align-self: end;
    text-align: right;
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: right;

    > span {
        text-shadow: 3px 3px 1px black;
        margin-right: 10%;
    }
}
</style>

<template>
  <div id="app">
      <header>
        <h6 class="score">SCORE: {{disarmedBombs.length}}</h6>
        <h3 class="title">BOMBSQUAD</h3>
      </app>
      </header>
      <board></board>
      <div class="ground ground1--repeat" style="align-self:end">
        <countdown :time="40 * 1000" :leadingZero="false" v-on:countdownend="shuffleBins" ref="countdown">
            <template slot-scope="props">Bin swap in: {{ props.seconds }}</template>
        </countdown>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Scenery from 'components/Scenery'
import Board from 'components/Board'

import VueCountdown from '@xkeshi/vue-countdown'
export default {
  components: {
    Scenery,
    Board,
    'countdown': VueCountdown
  },
  computed: {
    ...mapGetters([
      'disarmedBombs'
    ])
  },
  methods: {
    shuffleBins () {
        this.$store.dispatch('shuffleBins')
        this.$refs.countdown.init()
        this.$refs.countdown.start()
    }
  }
}
</script>
