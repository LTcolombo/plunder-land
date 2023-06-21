import { Skill } from './skill'
import { Texture } from 'pixi.js'
import { type GameObject } from '../objects/gameobject'

export class Dash extends Skill {
  constructor (owner: GameObject) {
    super(owner)
    this.name = 'Dash'
    this.uiTexture = Texture.from('UI/controls/dash.png')
    this.cooldown = 2
  }

  execute (): void {
    super.execute()

    if (this.owner.animation != null) {
      this.owner.animation.animationSpeed = 0.4

      setTimeout(() => {
        if (this.owner.animation != null) { this.owner.animation.animationSpeed = 0.2 }
      }, this.cooldown * 1000 / 2)
    }
  }
}
