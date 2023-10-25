<style scoped>
.bin {
  display: grid;
  width: 82px;
  height: 64px;
  text-align: center;
  line-height: 48px;
  font-size: 0.8rem;
  color: white;
  background-color: black;
  z-index: 50;
  margin: auto;
  background: url('/bombsquad/static/img/sprites/carts.png') no-repeat;
  overflow: hidden;
  transform-origin: bottom;

  &.bin--blue {
    background-position: -5px -0px;
  }
  &.bin--green {
    background-position: -5px -69px;
  }
  &.bin--red {
    background-position: -5px -138px;
  }
  .disarmed-count {
    margin: auto;
  }
}
</style>

<template>
  <div class="bin-wrapper">
    <div class="bin" v-bind:class="[binColorClass]" v-bind:style="{transform: binSize, filter: binFilter}">
      <div class="disarmed-count">
        {{disarmedCount}}
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['bin'],
  computed: {
    binColorClass () {
      return `bin--${this.bin.color}`
    },
    binSize () {
      const increase = this.disarmedCount * 0.01
      return `scale(${1.25 + increase})`
    },
    binFilter () {
      const increase = this.disarmedCount * 10
      return `saturate(${100 + increase}%)`
    },
    disarmedCount () {
      return this.disarmedBombs.filter(bomb => {
        return bomb.color === this.bin.color
      }).length
    },
    ...mapGetters([
      'disarmedBombs'
    ])
  },
  updated() {
    this.reCalculatePosition()
  },
  methods: {
    reCalculatePosition () {
      this.bin.rect = this.$el.getBoundingClientRect();
    }
  }
}
</script>
