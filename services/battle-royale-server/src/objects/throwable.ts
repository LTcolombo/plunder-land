import Multiplayer from '../network/multiplayer'
import { type Vector } from '../utils/vector'
import { GameObject, ObjectType } from './gameobject'

export default class Throwable extends GameObject {
  velocity: number
  destroyCallback: (value: GameObject) => void
  constructor (
    x: number,
    y: number,
    lifetime: number,
    direction: Vector,
    velocity: number,
    tag: number,
    destroyCallback: (value: GameObject) => void
  ) {
    super(ObjectType.Throwable, x, y, 50, tag)

    this.lifetime = lifetime
    this.direction = direction
    this.velocity = velocity
    this.destroyCallback = destroyCallback

    Multiplayer.Instance.create(this)
  }

  update (dt: number) {
    this.position = this.position.add(
      this.direction.multiply(dt * this.velocity)
    )
    super.update(dt)
  }

  onCollide (target: GameObject) {
    super.onCollide(target)
    this.destroy()
  }

  destroy () {
    if (this.destroyCallback) this.destroyCallback(this)
    super.destroy()
  }
}
