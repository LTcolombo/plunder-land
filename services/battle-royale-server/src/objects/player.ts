import { Unit } from './unit'
import { Dash } from '../skills/dash'
import { type GameObject, ObjectType } from './gameobject'
import { Vector } from '../utils/vector'
import Mob from './mob'
import Boss from './boss'
import { Defend } from '../skills/defend'
import { RangedAttack } from '../skills/rangedattack'
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

  setProfile (data) {
    // this.profileData = data;

    // if (!this.profileData.equipment)
    //     return;

    // var bestArmor = {
    //     0: 0,
    //     1: 0,
    //     4: 0,
    //     5: 0,
    // }

    // for (var slotId in this.profileData.equipment) {
    //     var cardId = this.profileData.equipment[slotId];
    //     var cardData = global.firebaseData.config[cardId];

    //     if (!cardData) {
    //         console.log(cardId);
    //         continue;
    //     }

    //     var cardArmor = this.getArmorValue(cardData);
    //     if (bestArmor[slotId] != undefined)
    //         bestArmor[slotId] = cardArmor;
    // }

    // var armoredSlotCount = 0;
    // var totalArmor = 0;
    // for (var slot in bestArmor) {
    //     totalArmor += bestArmor[slot];
    //     armoredSlotCount++
    // }

    // var armoredSlotCount = 0;
    // var totalArmor = 0;
    // for (var slot in bestArmor) {
    //     totalArmor += bestArmor[slot];
    //     armoredSlotCount++
    // }
    // this.armor = Math.ceil(totalArmor / armoredSlotCount);
  }

  // getArmorValue(card) {
  //     if (!card.buffs)
  //         return 0;

  //     for (var buff of card.buffs) {
  //         if (buff.param === "armor")
  //             return buff.value;
  //     }
  //     return 0;
  // }

  update (dt: number) {
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

        // if (this.canAttack) {
        //     setTimeout(() => {
        //         this.canAttack = true;
        //     }, 1000);

        //     this.canAttack = false;

        //     if (mob.hit(this.getDamage()))
        //         this.onKill(mob);
        // }
      }
    }
  }

  addXP (value: number) {
    if (this.level === Player.LEVEL_THRESHOLDS.length - 1) { return }

    this.xp += value

    if (this.xp > Player.LEVEL_THRESHOLDS[this.level]) { this.setLevel(++this.level) }
  }

  setLevel (value: number) {
    this.level = value
    this.hp = this.maxHP()
    this.radius = 2 * Math.sqrt(this.maxHP())
    this.xp = 0
  }

  tryExecuteSkill (index) {
    if (!this.skills || this.skills.length <= index) { return }

    this.skills[index].execute()
  }

  onCollideWithPlayer (target: GameObject) {

  }

  onKill (value: GameObject) {
    super.onKill(value)

    this.stats.kills++

    if (value instanceof Boss) { this.stats.bossKills++ }

    if (value instanceof Mob) { this.stats.mobKills++ }
  }
}
