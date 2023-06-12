import TWEEN from '@tweenjs/tween.js'
import AnimationClip from '../animation/animationclip'
import { Game } from '../game'
import { type GameObject } from '../objects/gameobject'

export class FireBreathEffect {
  constructor (owner: GameObject, lifetime: number) {
    const particleLifetime = 550
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        if (owner.direction == null) return null
        const expl = new AnimationClip('explosion/expl')
        expl.x = owner.x + 50 * owner.direction.x
        expl.y = owner.y + 50 * owner.direction.y

        new TWEEN.Tween(expl)
          .to(
            {
              x: owner.x + 100 * (1 + 2 * Math.random()) * owner.direction.x,
              y: owner.y + 100 * (1 + 2 * Math.random()) * owner.direction.y
            },
            particleLifetime
          )
          .onStart(() => {
            Game.CONTAINER.addChild(expl)
            expl.play()
          })
          .onComplete(() => {
            Game.CONTAINER.removeChild(expl)
          })
          .start()
        return expl
      }, (lifetime - particleLifetime) * Math.random())
    }
  }
}
