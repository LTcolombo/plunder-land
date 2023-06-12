import { type GameObject } from '../objects/gameobject'
import Buff from './buff'

export default class Slowdown extends Buff {
  static Intencity = 2

  constructor (target: GameObject, lifetime: number) {
    super(target, lifetime)
  }

  start () {
    this.target.maxVelocity /= Slowdown.Intencity
  }

  stop () {
    this.target.maxVelocity *= Slowdown.Intencity
  }
}
