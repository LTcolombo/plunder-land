import { Skill } from './skill'
import SectorArea from '../area/sectorarea'
import Multiplayer from '../network/multiplayer'
import World from '../objects/world'

export class IceBreath extends Skill {
  static Damage = [25, 35, 45, 55]

  constructor (owner) {
    super(owner, 3000)
  }

  execute () {
    if (!super.execute()) return false

    const area = new SectorArea(this.owner, 200, Math.PI / 4)
    area.setEffect(IceBreath.Damage[this.owner.level], true)
    World.AREA_EFFECT.push(area)
    const lifetime = 1000
    Multiplayer.Instance.effect(1, this.owner, lifetime)

    return true
  }
}
