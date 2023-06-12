import { Skill } from './skill'

export class Dash extends Skill {
  constructor (owner) {
    super(owner, 2000)
  }

  execute () {
    if (!super.execute()) return false
    this.owner.impulse = this.owner.direction.multiply(1.5)
    return true
  }
}
