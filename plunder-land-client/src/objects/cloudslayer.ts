import { Container } from 'pixi.js'
import { Cloud } from './cloud'

export class CloudsLayer extends Container {
  size: number
  constructor (size: number) {
    super()
    this.size = size
    for (let i = 0; i < 60; i++) {
      const cloud = new Cloud()
      cloud.x = Math.random() * this.size
      cloud.y = Math.random() * this.size
      this.addChild(cloud)
    }
  }

  update (dt: number): void {
    for (const child of this.children) {
      if (child instanceof Cloud) child.update(dt)
      if (child.x > this.size) child.x = 0
    }
  }
}
