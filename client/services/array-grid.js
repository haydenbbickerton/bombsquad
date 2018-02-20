import Vue from 'vue'

/**
 * This is copy pasted from https://github.com/mmckegg/array-grid
 *
 * They used es5-style function prototypes instead of a class, and
 * I need to extend it for BoardGrid and don't have time to mess
 * around with the inheritance atm. So I turned it into a class.
 *
 * @class      ArrayGrid (name)
 */
class ArrayGrid  {

  constructor (data, shape, stride, offset) {
    this.data = data
    this.shape = shape || [data.length, 1]
    this.stride = stride || [this.shape[1], 1]
    this.offset = offset || 0
  }

  set (row, col, value) {
    if (row < this.shape[0] && col < this.shape[1]){
      Vue.set(this.data, this.index(row, col), value)                  // https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
      // this.data[this.index(row, col)] = value
      return true
    } else {
      return false
    }
  }

  index (row, col){
    if (row < this.shape[0] && col < this.shape[1]){
      // handle negative stride
      row = this.stride[0] < 0 ? -this.shape[0] + row + 1 : row
      col = this.stride[1] < 0 ? -this.shape[1] + col + 1 : col
      return this.offset + (this.stride[0] * row) + (this.stride[1] * col)
    }
  }

  place (originRow, originCol, array){
    for (var r=0;r<array.shape[0];r++){
      for (var c=0;c<array.shape[1];c++){
        this.set(originRow + r, originCol + c, array.get(r, c))
      }
    }
  }

  lookup (value){
    var index = this.data.indexOf(value)
    if (~index){
      return this.coordsAt(index)
    }
  }

  coordsAt (index){
    var max = this.shape[0] * this.shape[1]
    if (index >= 0 && index < max){
      index = index - this.offset
      return [
        Math.floor(index / this.stride[0]) % this.shape[0],
        Math.floor(index / this.stride[1]) % this.shape[1]
      ]
    }
  }

  getRange (shape, offset) {
    offset = offset || [0, 0]
    var result = ArrayGrid([], shape)
    for (var r = 0; r < shape[0]; r++) {
      for (var c = 0; c < shape[1]; c++) {
        result.set(r, c, this.get(r + offset[0], c + offset[1]))
      }
    }
    return result
  }
}

export { ArrayGrid as default }
