import { Point, Sprite, type Texture } from 'pixi.js'
import { GameObject } from './gameobject'

export class Obstacle extends GameObject {
  shadow: Sprite
  constructor (texture: Texture, radius: number) {
    super()
    this.radius = radius

    const targetScale = (radius * 3) / texture.frame.width

    this.shadow = this.createShadow(texture)

    this.shadow.scale = new Point(targetScale * 1.1, targetScale * 1.1)
    this.addChild(this.shadow)

    this.main = new Sprite(texture)
    this.main.scale = new Point(targetScale, targetScale)
    this.main.anchor.x = 0.5
    this.main.anchor.y = 1

    this.main.y += radius
    this.shadow.y += radius

    this.addChild(this.main)
    this.DEBUG_DRAW_COLLIDER()
  }
}
