import { type Texture } from 'pixi.js'
import { Game } from '../game'
import { type GameObject } from '../objects/gameobject'

export class Skill {
  name: string
  uiTexture: Texture

  owner: GameObject
  index: number
  cooldown: number

  constructor (owner: GameObject) {
    this.owner = owner
  }

  execute (): void {
    Game.socket.emit('skill', this.index)
  }
}
