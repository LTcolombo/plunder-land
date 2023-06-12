export class Vector {
  x: number
  y: number
  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  withinBounds (x: number, y: number, value: number) {
    return (this.x - x) < value && (this.x - x) > -value && (this.y - y) < value && (this.y - y) > -value
  }

  getSquareMagnitude () {
    return this.x * this.x + this.y * this.y
  }

  getMagnitude () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  getAngle () {
    return Math.atan2(this.y, this.x)
  }

  getAngleTo (value: number) {
    let angle = this.getAngle() - value
    if (Math.abs(angle) > Math.PI) { angle += 2 * Math.PI * -Math.sign(angle) }
    return angle
  }

  normalised () {
    const magnitude = this.getMagnitude()
    if (magnitude === 0) { return this }
    return new Vector(this.x / magnitude, this.y / magnitude)
  }

  invert () {
    return new Vector(-this.x, -this.y)
  }

  add (value: { x: number, y: number }) {
    return new Vector(value.x + this.x, value.y + this.y)
  }

  sub (value: { x: number, y: number }) {
    return new Vector(this.x - value.x, this.y - value.y)
  }

  reduceBy (value: number) {
    let sign = Math.sign(this.x)
    let x = this.x - value * sign
    if (sign !== Math.sign(x)) { x = 0 }

    sign = Math.sign(this.y)
    let y = this.y - value * sign
    if (sign !== Math.sign(y)) { y = 0 }

    return new Vector(x, y)
  }

  multiply (value: number) {
    return new Vector(value * this.x, value * this.y)
  }

  rotateBy (value: number) {
    return new Vector(
      this.x * Math.cos(value) - this.y * Math.sin(value),
      this.x * Math.sin(value) + this.y * Math.cos(value)
    )
  }

  limit (value: number) {
    const magnitude = this.getMagnitude()
    if (magnitude > value) { return this.multiply(value / magnitude) }

    return this
  }
}
