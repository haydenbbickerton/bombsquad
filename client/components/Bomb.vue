<style scoped>
.bomb {
  pointer-events: none;
  width: 48px;
  height: 48px;
  text-align: center;
  line-height: 48px;
  background-color: black;
  z-index: 100;
  background: url('/static/img/sprites/bombs.png') no-repeat;
  background-size: 48px auto;
  background-position: center auto;

  .lifetime {
    color: white;
    padding-top: 5px;
    font-size: 0.5rem;
  }

  &.bomb--blue {
    background-position: 0px -0px;
  }
  &.bomb--green {
    background-position: 0px -56px;
  }
  &.bomb--red {
    background-position: 0px -112px;
  }
}

.explosion {
  width: 96px;
  height: 96px;
  margin-top:-48px;
  margin-left: -24px;
  background: url('/static/img/sprites/explosion-4.png') left center;
  background-size: 1152px 96px;
  animation: explode 1s steps(12) 1;
  z-index: 100;
}

@keyframes explode {
    100% { background-position: -1152px; }
}
</style>

<template>
  <div class="bomb-wrapper">
    <div v-if="!exploding">
      <div class="bomb" v-bind:class="[bombColorClass]">
        <div class="lifetime">
          <countdown :time="bomb.lifetime * 1000" :leadingZero="false" v-on:countdownend="timesUp">
            <template slot-scope="props">{{ props.seconds }}</template>
          </countdown>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="explosion">
      </div>
    </div>
  </div>
</template>


<script>
import VueCountdown from '@xkeshi/vue-countdown'

export default {
  props: ['bomb'],
  data () {
    return {
      bombColorClass: `bomb--${this.bomb.color}`,
      exploding: false,
      armedNoise: new Audio('/static/audio/extraShip.wav'), // From asteroids arcade game
      explosionNoise: new Audio('/static/audio/bangSmall.wav')
    }
  },
  computed: {
    hasBeenDetonated () {
      return this.bomb.detonated
    }
  },
  components: {
    'countdown': VueCountdown
  },
  mounted () {
    this.armedNoise.play()
  },
  destroyed () {
    this.$store.commit('removeBombFromGrid', {bomb: this.bomb})
  },
  methods: {
    timesUp() {
      this.$store.dispatch('detonateBomb', this.bomb)
    },
    explode() {
      this.exploding = true
      this.explosionNoise.play()
    }
  },
  watch: {
    hasBeenDetonated: function (val, oldVal) {
      if (val === true && oldVal === false) {
        this.explode()
      }
    }
  }
}
</script>
