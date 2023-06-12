import { GameObject, ObjectType } from './gameobject'
import { Random } from '../utils/random'
import Multiplayer from '../network/multiplayer'

export default class Consumable extends GameObject {
  constructor (x: number, y: number, tag: number, radius = undefined) {
    super(ObjectType.Consumable, x, y, radius || Random.RangeInt(15, 25), tag)
    this.xp = this.radius

    Multiplayer.Instance.create(this)
  }
}
