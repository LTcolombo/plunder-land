import { type GameObject } from '../objects/gameobject'
import { type Vector } from '../utils/vector'
import Area from './area'

export default class CircleArea extends Area {
  sqRadius: number

  constructor (target: GameObject, radius: number) {
    super(target)
    this.sqRadius = radius * radius
  }

  overlaps (value: Vector): boolean {
    return this.sub(value).getSquareMagnitude() < this.sqRadius
  }
}
