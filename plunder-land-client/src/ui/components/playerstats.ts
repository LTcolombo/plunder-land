import { Container, Point, Graphics, Text } from 'pixi.js'

export class PlayerStats extends Container {
  level: number
  LEVEL_THRESHOLDS: number[]
  xpLabel: Text
  graphics: Graphics
  constructor () {
    super()

    this.level = 0
    this.LEVEL_THRESHOLDS = [100, 300, 750, 1500]

    this.xpLabel = new Text('0', {
      fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
      fontSize: 10,
      fill: 'white',
      stroke: 'black',
      strokeThickness: 1
    })

    this.xpLabel.x = 32
    this.xpLabel.anchor = new Point(0.5, 0)

    const xp = new Container()
    this.addChild(xp)

    this.graphics = new Graphics()
    this.graphics.alpha = 0.4
    xp.addChild(this.graphics)
    xp.y = 70
    xp.addChild(this.xpLabel)
  }

  update (data: { level: number, xp: number }): void {
    if (data?.level !== undefined) { this.level = data.level }

    this.graphics.clear()
    this.graphics.beginFill(0x000000).drawRect(0, 0, 64, 16).endFill()

    if (data !== undefined) {
      const progress = data.xp / this.LEVEL_THRESHOLDS[this.level]
      this.xpLabel.text = data.xp.toString()
      this.graphics.beginFill(0x880088).drawRect(0, 0, 64 * progress, 16).endFill()
    }
  }
}
