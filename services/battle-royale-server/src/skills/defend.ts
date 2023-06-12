import Multiplayer from '../network/multiplayer'
import World from '../objects/world'
import { Skill } from './skill'

export class Defend extends Skill {
  constructor (owner) {
    super(owner, 8000)
  }

  execute () {
    if (!super.execute()) return false

    // set damage reduction to
    this.owner.damageReduction = World.config.defend[this.owner.level]

    const lifetime = 5000
    Multiplayer.Instance.effect(4, this.owner, lifetime)

    setTimeout(() => {
      this.owner.damageReduction = 0
    }, lifetime)

    return true
  }
}
