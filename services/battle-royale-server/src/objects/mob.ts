import { Unit } from './unit'
import { ObjectType } from './gameobject'
import GuardPosition from '../ai/guardposition'
import Multiplayer from '../network/multiplayer'

export default class Mob extends Unit {
  static Cooldown = 1000

  constructor (x: number, y: number, tag: number) {
    super(ObjectType.Mob, x, y, 0, tag)
    this.radius = 30
    this.hp = this.maxHP()
    this.maxVelocity = 100
    this.loot = 50

    this.addAIRoutine(new GuardPosition(this))

    Multiplayer.Instance.create(this)
  }

  maxHP () {
    return 50
  }

  getDamage () {
    return 10
  }

  onCollideWithPlayer (target: Unit): void {
    if (this.canAttack) {
      setTimeout(() => { this.canAttack = true }, Mob.Cooldown)

      this.canAttack = false
      if (target.hit(this.getDamage())) { this.onKill(target) }
    }
  }
}
