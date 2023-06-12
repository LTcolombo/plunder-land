import { Container, Point, Sprite, Text, Texture } from 'pixi.js'
import { TapHandler } from '../ui/taphandler'
import AnimationClip from '../animation/animationclip'

export default class GameEnterPopup extends Container {
  callback: () => void
  bg: Sprite

  constructor (callback: () => void) {
    super()
    this.callback = callback

    const container = new Container()
    this.addChild(container)

    this.bg = new Sprite(Texture.from('UI/elements/BG.png'))
    this.bg.scale = new Point(2, 2)
    console.log(this.bg.width)
    container.x = -this.bg.width / 2
    container.y = -this.bg.height / 2
    container.addChild(this.bg)

    const cell = new Container()

    const cellBg = new Sprite(Texture.from('UI/elements/cell.png'))
    cellBg.scale = new Point(2, 2)
    cell.addChild(cellBg)

    const player1 = new AnimationClip('player/idle/idle', 0.2, true)
    player1.play()

    player1.x = cell.width / 2
    player1.y = cell.height / 2
    cell.addChild(player1)

    container.addChild(cell)

    cell.x = (this.bg.width - cell.width) / 2
    cell.y = (this.bg.height - cell.height) / 2

    const startButton = new TapHandler(this.onStartClick.bind(this))

    const buttonBg = new Sprite(Texture.from('UI/elements/button.png'))
    startButton.addChild(buttonBg)
    const label = new Text('START', { fill: '0xFFFFFF' })
    label.anchor = new Point(0.5, 0.5)
    label.position = new Point(buttonBg.width / 2, buttonBg.height / 2)
    startButton.addChild(label)

    container.addChild(startButton)

    startButton.x = (this.bg.width - buttonBg.width) - 20

    startButton.y = (this.bg.height - buttonBg.height) - 30
  }

  onStartClick (): void {
    this.callback()
    this.emit('close')
  }
}
