import TWEEN from '@tweenjs/tween.js'
import { Sprite, Texture, Point } from 'pixi.js'
import { type GameObject } from '../objects/gameobject'
import { Game } from '../game'

export class IceBreathEffect {
  constructor (owner: GameObject, lifetime: number) {
    if (owner.direction === undefined) return

    const particleLifetime = 550
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const snowflake = new Sprite(Texture.from('UI/controls/snowflake.png'))
        snowflake.x = owner.x + 50 * owner.direction!.x
        snowflake.y = owner.y + 50 * owner.direction!.y
        snowflake.scale = new Point(0, 0)

        new TWEEN.Tween(snowflake.scale)
          .to({
            x: 2,
            y: 2
          })
          .start()

        new TWEEN.Tween(snowflake)
          .to(
            {
              alpha: 0,
              x: owner.x + 100 * (1 + 2 * Math.random()) * owner.direction!.x,
              y: owner.y + 100 * (1 + 2 * Math.random()) * owner.direction!.y
            },
            particleLifetime
          )
          .onStart(() => {
            Game.CONTAINER.addChild(snowflake)
          })
          .onComplete(() => {
            Game.CONTAINER.removeChild(snowflake)
          })
          .start()
        return snowflake
      }, (lifetime - particleLifetime) * Math.random())
    }
  }
}
