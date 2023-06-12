import { Skill } from './skill'
import { Texture } from 'pixi.js'

export class Defend extends Skill {
  constructor (owner) {
    super(owner)
    this.name = 'Defend'
    this.uiTexture = Texture.from('UI/controls/defend.png')
    this.cooldown = 8
  }

  execute () {
    super.execute()
    this.owner.animation.playClip('player/magic/frame')
  }
}
