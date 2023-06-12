import * as PIXI from 'pixi.js'
import TWEEN from '@tweenjs/tween.js'

export class TextEffect extends PIXI.Text {
  constructor (value: string, container: PIXI.Container, x: number, y: number, fontSize = 64, color = 'red', delay = 800) {
    super(value, {
      fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
      fontSize,
      fill: color,
      stroke: 'black',
      strokeThickness: 4
    })

    this.anchor = new PIXI.Point(0.5, 0.5)
    this.x = x
    this.y = y
    container.addChild(this)

    new TWEEN.Tween(this)
      .to({ y: y - 100, alpha: 0 }, 300)
      .onComplete(() => { container.removeChild(this) })
      .delay(delay)
      .start()
  }
}
