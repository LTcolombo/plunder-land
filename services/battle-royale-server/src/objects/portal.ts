import Multiplayer from '../network/multiplayer'
import { GameObject, ObjectType } from './gameobject'

export default class Portal extends GameObject {
  constructor (x: number, y: number, to: number | undefined, tag: number) {
    super(ObjectType.Portal, x, y, 50, tag, undefined, to)
    Multiplayer.Instance.create(this)
  }

  onCollide (target: GameObject) {
    super.onCollide(target)
    target.tag = this.to
  }
}
