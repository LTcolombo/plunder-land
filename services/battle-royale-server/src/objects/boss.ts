import Mob from './mob'
import UseSkillOnTarget from '../ai/useskillontarget'
import { FireBreath } from '../skills/firebreath'
import Multiplayer from '../network/multiplayer'

export default class Boss extends Mob {
  static Cooldown = 1000

  constructor (x: number, y: number, tag: number) {
    super(x, y, tag)
    this.radius = 40
    this.xp = 500
    this.level = 0

    this.addAIRoutine(new UseSkillOnTarget(this, new FireBreath(this)))

    Multiplayer.Instance.create(this)
  }

  maxHP () {
    return 250
  }

  getDamage () {
    return 40
  }
}
