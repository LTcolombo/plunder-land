import { type GameObject } from '../objects/gameobject'
import { type Unit } from '../objects/unit'
import World from '../objects/world'

export interface IAIRoutine {
  update: (dt: number) => void
}

export default class FindNearestConsumable implements IAIRoutine {
  TARGET_REFRESH_RATE: number
  targetAquiredAt: number
  target: GameObject | undefined
  owner: Unit

  constructor (owner: Unit) {
    this.TARGET_REFRESH_RATE = 3000
    this.targetAquiredAt = 0
    this.target = undefined
    this.owner = owner
  }

  update (dt: number) {
    const now = new Date().getTime()
    if (this.targetAquiredAt < now - this.TARGET_REFRESH_RATE) {
      this.target = World.FIND_NEAREST_FN(this.owner, 0, World.CONSUMABLES)
      this.targetAquiredAt = now
    }

    if ((this.target != null) && !this.target.destroyed) { this.owner.setDirectionTo(this.target.position.x, this.target.position.y) }
  }
}
