import { type Unit } from '../objects/unit'
import { type Skill } from '../skills/skill'
import { type IAIRoutine } from './findnearestconsumable'

export default class UseSkillOnTarget implements IAIRoutine {
  skill: Skill
  owner: Unit
  constructor (owner: Unit, skill: Skill) {
    this.owner = owner
    this.skill = skill
  }

  update (dt: number) {
    if (this.owner.target != null) {
      this.skill.execute()
    }
  }
}
