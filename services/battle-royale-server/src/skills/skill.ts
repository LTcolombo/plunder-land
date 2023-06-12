import { type Unit } from '../objects/unit'

export class Skill {
  owner: Unit
  cooldown: number
  executeTime: number
  constructor (owner: Unit, cooldown: number) {
    this.owner = owner
    this.cooldown = cooldown
  }

  execute () {
    if (this.executeTime > Date.now() - this.cooldown) { return false }

    this.executeTime = Date.now()
    return true
  }
}
