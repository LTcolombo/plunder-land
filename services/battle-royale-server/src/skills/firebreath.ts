import { Skill } from './skill'
import SectorArea from '../area/sectorarea'
import { type Unit } from '../objects/unit'
import World from '../objects/world'
import Multiplayer from '../network/multiplayer'

export class FireBreath extends Skill {
  constructor (owner: Unit) {
    super(owner, 3000)
  }

  execute () {
    if (!super.execute()) return false

    const area = new SectorArea(this.owner, 200, Math.PI / 4)
    area.setEffect(World.config.fire, true)
    World.AREA_EFFECT.push(area)
    const lifetime = 1000
    Multiplayer.Instance.effect(0, this.owner, lifetime)

    setTimeout(
      (a) => {
        const idx = World.AREA_EFFECT.indexOf(area)
        if (idx >= 0) World.AREA_EFFECT.splice(idx, 1)
      },
      lifetime,
      area
    )

    return true
  }
}
