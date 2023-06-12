import { Texture, Sprite, Point } from 'pixi.js'

export class Cloud extends Sprite {
  movementSpeed: number
  constructor () {
    super(Texture.from('cloud.png'))
    this.anchor = new Point(0.5, 0.5)
    this.movementSpeed = 30 * Math.random() + 10
    const scale = 0.5 + Math.random()
    this.scale = new Point(scale, scale)
  }

  update (dt: number): void {
    this.x += this.movementSpeed * dt
  }
}
