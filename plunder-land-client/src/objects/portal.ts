import { GameObject } from './gameobject'
import { Sprite, Point, Texture } from 'pixi.js'

export class Portal extends GameObject {
  constructor (radius: number, up: boolean) {
    super()

    this.radius = radius
    const texture = Texture.from('portal.png')
    const targetScale = (radius * 2) / texture.frame.width

    this.main = new Sprite(texture)
    this.main.scale = new Point(targetScale, targetScale)
    this.main.anchor = new Point(0.5, 0.5)

    if (!up) { this.main.rotation = Math.PI }

    this.addChild(this.main)

    this.DEBUG_DRAW_COLLIDER()
  }
}
