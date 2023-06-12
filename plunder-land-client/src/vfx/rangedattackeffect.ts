import TWEEN from '@tweenjs/tween.js'
import { Graphics } from 'pixi.js'
import { Game } from '../game'
import { type GameObject } from '../objects/gameobject'

export class RangedAttackEffect {
  constructor (owner: GameObject) {
    if (owner.direction === undefined) return

    const rangedAttackEffect = new Graphics()
      .lineStyle(4, 0x88ffff22)
      .moveTo(0, 0)
      .lineTo(owner.direction.x * 10, owner.direction.y * 10)
      .closePath()
      .endFill()

    rangedAttackEffect.position = owner.position

    new TWEEN.Tween(rangedAttackEffect.position)
      .to(
        {
          x: owner.position.x + owner.direction.x * 1000,
          y: owner.position.y + owner.direction.y * 1000
        },
        500
      )
      .onStart(() => {
        Game.CONTAINER.addChild(rangedAttackEffect)
      })
      .onComplete(() => {
        rangedAttackEffect.parent.removeChild(rangedAttackEffect)
      })
      .start()
  }
}
