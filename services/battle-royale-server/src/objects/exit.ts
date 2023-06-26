import Multiplayer from '../network/multiplayer'
import { GameObject, ObjectType } from './gameobject'
import Player from './player'

export default class Exit extends GameObject {
  constructor (x: number, y: number, tag: number) {
    super(ObjectType.Exit, x, y, 50, tag)
    Multiplayer.Instance.create(this)
  }

  onCollide (target: GameObject): void {
    super.onCollide(target)
    if (target instanceof Player) { target.exit() }
  }
}
