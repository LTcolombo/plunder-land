import { type GameObject } from '../objects/gameobject'
import { type Vector } from '../utils/vector'
import Area from './area'

export default class SectorArea extends Area {
  sqRadius: number
  angle: number

  constructor (target: GameObject, radius: number, angle: number) {
    super(target)
    this.sqRadius = radius * radius
    this.angle = angle
  }

  overlaps (value: Vector) {
    const delta = value.sub(this)
    return (
      delta.getSquareMagnitude() < this.sqRadius &&
			Math.abs(delta.getAngleTo(this.target.direction.getAngle())) < this.angle
    )
  }
}
