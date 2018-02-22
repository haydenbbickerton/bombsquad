/**
 * Functions for the creation of bombs
 */
import _ from 'lodash'

const BOMBS = 120
const START_INTERVAL = 5 // seconds
const END_INTERVAL = 0.5
const MIN_LIFETIME = 5
const MAX_LIFETIME = 10

export function calculateBombIntervals (bombs, start, end) {
  /**
   * This doesn't work quite right. The goal is to start with 5 seconds, end with 0.5.
   *
   * There are better ways to do this, I just did a log down until it hits the end.
   * More important things to tackle first.
   *
   * TODO
   */

  // Starts out 5 seconds, ends up being 0.5 second interval
  var startl = Math.log(start)
  var endl = Math.log(end)
  var scale = (endl - startl) / (bombs * 0.5)

  return _.transform(_.range(bombs), function (result, n) {
    var interval = Math.exp(startl + scale * n)
    result.push(Math.max(interval, end)) // Don't drop below 0.5
  }, [])
}

export function calculateBombLifetimes (bombs, min, max) {
  return _.transform(_.range(bombs), function (result, n) {
    var lifetime = _.round(_.random(min, max))
    result.push(lifetime)
  }, [])
}

export function calculateBombTimings () {
  var intervals = calculateBombIntervals(BOMBS, START_INTERVAL, END_INTERVAL)
  var lifetimes = calculateBombLifetimes(BOMBS, MIN_LIFETIME, MAX_LIFETIME)

  // Combine into objects
  var timings = _.zipWith(intervals, lifetimes, function (interval, lifetime) {
    return {
      'interval': interval,
      'lifetime': lifetime
    }
  })

  // Add a key for cumulative interval times
  return _.transform(timings, function (result, bomb) {
    var isFirst = _.isEmpty(result)
    var lastTime = _.get(_.last(result), 'entrance_time', 0)

    bomb['entrance_time'] = isFirst ? 0 : (bomb['interval'] + lastTime)
    result.push(bomb)
  }, [])
}

export function generateColors () {
  const colors = _.concat(
    _.range(40).fill('blue'),
    _.range(40).fill('green'),
    _.range(40).fill('red')
  )

  return _.shuffle(colors)
}

export function generateBombs () {
  const timings = calculateBombTimings()
  const colors = generateColors()

  return _.transform(timings, (result, bomb, n) => {
    bomb['id'] = `bomb-${n}`
    bomb['live'] = true
    bomb['detonated'] = false
    bomb['color'] = colors[n]

    result.push(bomb)
  }, [])
}

export default { generateBombs }
