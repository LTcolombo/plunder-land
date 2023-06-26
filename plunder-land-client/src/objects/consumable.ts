import { GameObject } from './gameobject'
import { Sprite, Point, type Texture } from 'pixi.js'

export class Consumable extends GameObject {
  shadow: Sprite
  loot: number

  constructor (texture: Texture, loot: number, radius: number) {
    super()

    this.radius = radius
    const targetScale = (radius * 2) / texture.frame.width

    this.shadow = this.createShadow(texture)

    this.shadow.scale = new Point(targetScale * 1.1, targetScale * 1.1)
    this.addChild(this.shadow)
    this.main = new Sprite(texture)
    this.main.scale = new Point(targetScale, targetScale)
    this.main.anchor = new Point(0.5, 1)
    this.addChild(this.main)
    this.loot = loot

    this.main.y += radius
    this.shadow.y += radius

    this.DEBUG_DRAW_COLLIDER()
  }
}
