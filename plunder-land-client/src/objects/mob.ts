import { Point } from 'pixi.js'
import Unit from './unit'
import { AnimationStates } from '../animation/animationstates'

export default class Mob extends Unit {
  initAnimation (): void {
    this.runAnimation = 'mob/mob'

    this.animation = new AnimationStates(
      this.runAnimation,
      0.1,
      new Point(0.5, 1)
    )
    this.animation.play()
    this.addChild(this.animation)

    const targetScale = (this.radius * 3) / 64
    this.animation.scale = new Point(targetScale, targetScale)
  }
}
