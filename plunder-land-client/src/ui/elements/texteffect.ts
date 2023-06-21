import * as PIXI from 'pixi.js'
import TWEEN from '@tweenjs/tween.js'
import { ToolKit } from '../components/toolkit'

export class TextEffect extends PIXI.Text {
  constructor (value: string, container: PIXI.Container, x: number, y: number, fontSize = 64, color = 'red', delay = 800) {
    super(value, {
      fontFamily: 'Lilliput Steps',
      fontSize,
      fill: color,
      stroke: 'black',
      strokeThickness: 4
    })

    this.anchor = ToolKit.CENTER_ANCHOR
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
