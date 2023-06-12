import { Skill } from './skill'
import { ObjectType } from '../objects/gameobject'
import Multiplayer from '../network/multiplayer'
import World from '../objects/world'

export class MeleeAttack extends Skill {
  constructor (owner) {
    super(owner, 1000)
  }

  execute () {
    if (!super.execute()) return false

    for (const collidee of World.FIND_AROUND(
      this.owner.position.x,
      this.owner.position.y,
      this.owner.tag,
      100,
      ObjectType.Player | ObjectType.Mob
    )) {
      if (collidee !== this.owner) {
        if (collidee.hit(World.config.melee[this.owner.level])) { this.owner.onKill(collidee) }
      }
    }

    Multiplayer.Instance.effect(2, this.owner, 1)
    return true
  }
}
