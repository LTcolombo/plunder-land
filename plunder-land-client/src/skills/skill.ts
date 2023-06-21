import { type Texture } from 'pixi.js'
import { Game } from '../game'
import { type GameObject } from '../objects/gameobject'

export class Skill {
  name: string | undefined
  uiTexture: Texture

  owner: GameObject
  index: number | undefined
  cooldown: number | undefined

  constructor (owner: GameObject) {
    this.owner = owner
  }

  execute (): void {
    Game.socket.emit('skill', this.index)
  }
}
