import { Unit } from './unit'
import { Dash } from '../skills/dash'
import { type GameObject, ObjectType } from './gameobject'
import { Vector } from '../utils/vector'
import Mob from './mob'
import Boss from './boss'
import { MeleeAttack } from '../skills/meleeattack'
import { type Skill } from '../skills/skill'
import World from './world'
import Multiplayer from '../network/multiplayer'

export default class Player extends Unit {
  static LEVEL_THRESHOLDS = [100, 300, 750, 1500]
  skills: Skill[]
  createdAt: number
  stats: { kills: number, mobKills: number, bossKills: number }

  constructor (x: number, y: number, tag: number) {
    console.log(x, y, tag)

    super(ObjectType.Player, x, y, 0, tag)
    this.maxVelocity = 140
    this.xp = 100

    this.setLevel(1)

    // this.skills = [new Defend(this), new Dash(this), new MeleeAttack(this), new RangedAttack(this)];
    this.skills = [new Dash(this), new MeleeAttack(this)]

    this.createdAt = Date.now()
    this.stats = { kills: 0, mobKills: 0, bossKills: 0 }

    Multiplayer.Instance.create(this)
  }

  setGear (data: { damage: number, armor: number, speed: number }): void {
    this.weapon = data.damage
    this.armor = data.armor
    this.maxVelocity = 180 + data.speed * 10
  }

  update (dt: number): void {
    super.update(dt)

    for (let i = 0; i < World.CONSUMABLES.length; i++) {
      const obj = World.CONSUMABLES[i]
      if (obj.tag !== this.tag) { continue }
      const sumWidth = obj.radius + this.radius
      const sqr = obj.position.sub(this.position).getSquareMagnitude()
      if (sqr < sumWidth * sumWidth) {
        this.addXP(obj.xp)
        obj.destroy()
        World.CONSUMABLES.splice(i, 1)
        break
      }
    }

    for (const mob of World.MOBS) {
      if (mob === this) { continue }

      if (mob.tag !== this.tag) { continue }

      const sumWidth = mob.radius + this.radius
      const delta = mob.position.sub(this.position)
      const sqr = delta.getSquareMagnitude()
      if (sqr < sumWidth * sumWidth) {
        const magnitude = Math.sqrt(sqr)

        this.position = new Vector(
          mob.position.x - sumWidth * delta.x / magnitude,
          mob.position.y - sumWidth * delta.y / magnitude)
      }
    }
  }

  addXP (value: number): void {
    if (this.level === Player.LEVEL_THRESHOLDS.length - 1) { return }

    this.xp += value

    if (this.xp > Player.LEVEL_THRESHOLDS[this.level]) { this.setLevel(++this.level) }
  }

  setLevel (value: number): void {
    this.level = value
    this.hp = this.maxHP()
    this.radius = 2 * Math.sqrt(this.maxHP())
    this.xp = 0
  }

  tryExecuteSkill (index: number): void {
    if (this.skills === undefined || this.skills.length <= index) { return }

    this.skills[index].execute()
  }

  onCollideWithPlayer (target: GameObject): void {

  }

  onKill (value: GameObject): void {
    super.onKill(value)

    this.stats.kills++

    if (value instanceof Boss) { this.stats.bossKills++ }

    if (value instanceof Mob) { this.stats.mobKills++ }
  }
}
