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
}
