import * as PIXI from 'pixi.js'
import TWEEN from '@tweenjs/tween.js'

export class Timer extends PIXI.Graphics {
  constructor (value: number, radius = 10) {
    super()

    const tweenTarget = { value: 0 }
    new TWEEN.Tween(tweenTarget)
      .to({ value }, value * 1000)
      .onUpdate(o => {
        this
          .clear()
          .beginFill(0x000000)
          .drawCircle(0, 0, radius)
          .endFill()
          .beginFill(0xBB4444)
          .lineTo(0, -0.9 * radius)
          .arc(0, 0, 0.9 * radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * o.value / value)
          .closePath()
          .endFill()
      })
      .onComplete(() => { if (this.parent) this.parent.removeChild(this) })
      .start()
  }
}
