/**
 * A directive to make vue elements draggable.
 *
 * I don't like doing it this way, but the HTML5 drag/drop spec
 * turns the dragged bomb into a static image - which would
 * freeze the timer on the dragged bomb.
 */

export const Draggable = {
  bind: function (el, binding, vnode) {
    el.style.position = 'absolute'
    var startX, startY, initialMouseX, initialMouseY
    const onDrop = binding.value

    function mousemove (e) {
      var dx = e.clientX - initialMouseX
      var dy = e.clientY - initialMouseY
      el.style.top = startY + dy + 'px'
      el.style.left = startX + dx + 'px'
      return false
    }

    function reset () {
      el.style.top = startY + 'px'
      el.style.left = startX + 'px'
    }

    function mouseup () {
      const doReset = onDrop(el, vnode)

      if (doReset) {
        reset()
      }
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }

    el.addEventListener('mousedown', function (e) {
      startX = el.offsetLeft
      startY = el.offsetTop
      initialMouseX = e.clientX
      initialMouseY = e.clientY
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
      return false
    })
  }
}
