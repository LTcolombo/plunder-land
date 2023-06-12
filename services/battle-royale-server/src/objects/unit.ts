import { GameObject } from './gameobject'
import { Vector } from '../utils/vector'
import World from './world'
import type Buff from '../buffs/buff'
import { type IAIRoutine } from '../ai/findnearestconsumable'

export class Unit extends GameObject {
  damageReduction: number = 0
  routines: IAIRoutine[] = []
  buffs: Buff[] = []
  canAttack: boolean = true
  target: GameObject | undefined
  armor: number = 0

  constructor (
    objType: number,
    x: number,
    y: number,
    lifetime: number,
    tag: number
  ) {
    super(objType, x, y, lifetime, tag)
    this.direction = new Vector(0, 0)
    this.impulse = new Vector(0, 0)
  }

  getDirectionTo (target_x, target_y) {
    return new Vector(
      target_x - this.position.x,
      target_y - this.position.y
    ).normalised()
  }

  getNextPos (dt) {
    if (this.direction.getSquareMagnitude() === 0) return this.position

    const translate = this.direction
      .normalised()
      .add(this.impulse)
      .multiply(dt * this.maxVelocity)
    return this.position.add(translate)
  }

  setDirection (direction_x, direction_y) {
    this.direction = new Vector(direction_x, direction_y).normalised()
  }

  setDirectionTo (target_x, target_y) {
    this.direction = this.getDirectionTo(target_x, target_y)
  }

  addAIRoutine (value) {
    this.routines.push(value)
  }

  update (dt) {
    for (const routine of this.routines) {
      routine.update(dt)
    }

    for (let i = this.buffs.length - 1; i >= 0; i--) {
      if (this.buffs[i].update(dt)) this.buffs.splice(i, 1)
    }

    if (!this.direction) return

    const pos = this.getNextPos(dt)
    for (const obstacle of World.OBSTACLES) {
      if (obstacle.tag !== this.tag) continue

      const sumWidth = obstacle.radius + this.radius
      const delta = obstacle.position.sub(pos)
      const sqr = delta.getSquareMagnitude()
      if (sqr < sumWidth * sumWidth) {
        const magnitude = Math.sqrt(sqr)

        pos.x = obstacle.position.x - (sumWidth * delta.x) / magnitude
        pos.y = obstacle.position.y - (sumWidth * delta.y) / magnitude

        obstacle.onCollide(this)
      }
    }

    for (const obj of World.PLAYERS) {
      if ((obj as Unit) === this) continue

      if (obj.tag !== this.tag) continue

      const sumWidth = obj.radius + this.radius
      const delta = obj.position.sub(pos)
      const sqr = delta.getSquareMagnitude()
      if (sqr < sumWidth * sumWidth) {
        this.onCollideWithPlayer(obj)
        const magnitude = Math.sqrt(sqr)

        pos.x = obj.position.x - (sumWidth * delta.x) / magnitude
        pos.y = obj.position.y - (sumWidth * delta.y) / magnitude
      }
    }

    for (const area of World.AREA_EFFECT) {
      if (area.tag !== this.tag) continue
      if (area.target === this) continue
      if (area.overlaps(this.position)) {
        const damage = area.getEffect(dt)
        this.hit(damage)
      }
    }

    pos.x = pos.x < 0 ? 0 : pos.x
    pos.x = pos.x > World.mapSize ? World.mapSize : pos.x

    pos.y = pos.y < 0 ? 0 : pos.y
    pos.y = pos.y > World.mapSize ? World.mapSize : pos.y

    const sqMagnitude = this.impulse.getSquareMagnitude()
    if (sqMagnitude > 0.001) {
      this.impulse = this.impulse.reduceBy(dt / sqMagnitude)
    } else if (sqMagnitude > 0) {
      this.impulse.x = 0
      this.impulse.y = 0
    }

    if (this.position.x !== pos.x || this.position.y !== pos.y) {
      this.position = pos
    }

    super.update(dt)
  }

  maxHP () {
    return World.config.hp[this.level]
  }

  getDamage () {
    return World.config.damage[this.level]
  }

  hit (value: number) {
    const inflictedDamage = Math.floor(
      value * (1 - (this.damageReduction || 0) - (this.armor || 0) / 10)
    )
    this.hp -= inflictedDamage

    if (this.hp <= 0) {
      this.hp = 0
      super.destroy()
      return true
    }

    super.update(0)
    return false
  }

  onCollideWithPlayer (target: GameObject) {}

  addBuff (value: Buff) {
    // dont stack same buffs?
    this.buffs.push(value)
  }

  onKill (obj: GameObject) {}
}