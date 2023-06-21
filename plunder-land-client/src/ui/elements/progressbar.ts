import * as PIXI from 'pixi.js'

export class ProgressBar {
  graphics: PIXI.Graphics
  width: number
  height: number
  border: number
  fillColor: number
  changeColor: number
  bgColor: number
  private _timeoutId: NodeJS.Timeout

  constructor () {
    this.graphics = new PIXI.Graphics()
    this.width = 50
    this.height = 5
    this.border = 1
    this.fillColor = 0x44dd44
    this.changeColor = 0xff0000
    this.bgColor = 0

    this.setValue(1)
  }

  setValue (value: number) {
    clearTimeout(this._timeoutId)
    this.graphics
      .clear()
      .beginFill(this.bgColor)
      .drawRect(0, 0, this.width, this.height)
      .endFill()
      .beginFill(this.changeColor)
      .drawRect(
        this.border,
        this.border,
        value * (this.width - 2 * this.border),
        3
      )

    this._timeoutId = setTimeout(() => {
      this.graphics
        .beginFill(this.fillColor)
        .drawRect(
          this.border,
          this.border,
          value * (this.width - 2 * this.border),
          3
        )
    }, 300)
  }
}
