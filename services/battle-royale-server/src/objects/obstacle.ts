import { GameObject, ObjectType } from './gameobject'
import { Random } from '../utils/random'
import Multiplayer from '../network/multiplayer'

export default class Obstacle extends GameObject {
  constructor (x: number, y: number, tag: number, radius: number | undefined = undefined, lifetime: number | undefined = undefined) {
    super(ObjectType.Obstacle, x, y, radius || Random.RangeInt(10, 45), tag, lifetime)
    Multiplayer.Instance.create(this)
  }
}
