import TWEEN from '@tweenjs/tween.js'
import { Texture, Sprite, Point } from 'pixi.js'
import { type GameObject } from '../objects/gameobject'

export class DefendEffect {
  constructor (owner: GameObject, lifetime: number) {
    const defendEffect = new Sprite(Texture.from('shield.png'))
    defendEffect.anchor = new Point(0.5, 0.7)
    defendEffect.width = defendEffect.height = defendEffect.alpha = 0

    new TWEEN.Tween(defendEffect)
      .to({ width: owner.radius * 5, height: owner.radius * 5, alpha: 1 }, 1000)
      .onStart(() => {
        owner.addChild(defendEffect)
      })
      .start()

    setTimeout(() => {
      owner.removeChild(defendEffect)
    }, lifetime)
  }
}
