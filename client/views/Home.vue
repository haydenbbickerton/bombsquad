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
    background: url('/static/img/background.png') no-repeat;
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
</style>

<template>
  <div id="app">
      <h2  style="align-self:start">BOMBSQUAD</h2>
      <board></board>
      <div class="ground ground1--repeat" style="align-self:end"></div>
  </div>
</template>

<script>
import Scenery from 'components/Scenery'
import Board from 'components/Board'

export default {
  components: {
    Scenery,
    Board
  }
}
</script>
