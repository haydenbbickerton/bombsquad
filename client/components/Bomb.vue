<style scoped>
.bomb {
  border-radius: 24px;
  width: 48px;
  height: 48px;
  text-align: center;
  line-height: 48px;
  font-size: 1rem;
  color: white;
  background-color: black;

  &.bomb--blue {
    background-color: blue;
  }
  &.bomb--green {
    background-color: green;
  }
  &.bomb--red {
    background-color: red;
  }

  /* TODO: a cute little explosion animation, if time allows */
}
</style>

<template>
  <div class="bomb-wrapper">
    <div class="bomb" v-bind:class="[bombColorClass]">
      <div class="lifetime">
        <countdown :time="bomb.lifetime * 1000" :leadingZero="false" v-on:countdownend="explode">
          <template slot-scope="props">{{ props.seconds }}</template>
        </countdown>
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
      bombColorClass: `bomb--${this.bomb.color}`
    }
  },
  components: {
    'countdown': VueCountdown
  },
  methods: {
    explode() {
      this.bomb.live = false;
      this.$store.commit('removeBombFromGrid', {bomb: this.bomb})
    }
  }
}
</script>
