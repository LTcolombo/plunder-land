import { Unit } from './unit'
import { Dash } from '../skills/dash'
import { GameObject, ObjectType } from './gameobject'
import { Vector } from '../utils/vector'
import Mob from './mob'
import Boss from './boss'
import { MeleeAttack } from '../skills/meleeattack'
import { type Skill } from '../skills/skill'
import World from './world'
import Multiplayer from '../network/multiplayer'

export class Stats {
  kills?: number
  mobKills?: number
  bossKills?: number
  games?: number
  lootCollected?: number
  lifeTime?: number
}
export default class Player extends Unit {
  skills: Skill[]
  createdAt: number
  exited: boolean
  address: string

  constructor (x: number, y: number, tag: number, address: string) {
    super(ObjectType.Player, x, y, 0, tag)
    this.address = address
    this.maxVelocity = 140
    this.loot = 0

    this.setLevel(1)

    // this.skills = [new Defend(this), new Dash(this), new MeleeAttack(this), new RangedAttack(this)];
    this.skills = [new Dash(this), new MeleeAttack(this)]

    this.createdAt = Date.now()

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
        this.addLoot(obj.loot)
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

  addLoot (value: number): void {
    this.loot += value
  }

  setLevel (value: number): void {
    this.level = value
    this.hp = this.maxHP()
    this.radius = 2 * Math.sqrt(this.maxHP())
    this.loot = 0
  }

  tryExecuteSkill (index: number): void {
    if (this.skills === undefined || this.skills.length <= index) { return }

    this.skills[index].execute()
  }

  onCollideWithPlayer (target: GameObject): void {

  }

  onKill (value: GameObject): void {
    super.onKill(value)

    void this.updateKillStats(value)
  }

  async updateKillStats (value: GameObject): Promise<void> {
    const stats = new Stats()

    stats.kills = 1

    if (value instanceof Boss) { stats.bossKills = 1 }

    if (value instanceof Mob) { stats.mobKills = 1 }

    console.log('stats', stats)
    for (const key in stats) {
      if (stats[key] > 0) {
        await Multiplayer.Instance.redis.hincrby(`stats-${this.address}`, key, stats[key])
      }
    }
  }

  destroy (): void {
    super.destroy()
    void Multiplayer.Instance.reportLoss(this)
  }

  exit (): void {
    this.dirtyFields = new Set('id')
    Multiplayer.Instance.destroy(this)
    void Multiplayer.Instance.reportWin(this)
    this.exited = true

    // we need this time out because server sends out all data asynchronously,
    // and a new objectmight take an id of a destroyed object,
    // before clients were notified about it.
    // our server loop is 16ms, thin of a cleaner way to do this.
    setTimeout(() => {
      GameObject.FreedIDs.push(this.id)
    }, 1000)
  }
}
