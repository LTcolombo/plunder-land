import { Container, Graphics, Point } from 'pixi.js'
import { Game } from '../../game'

export class Joystick extends Container {
  radius: number
  fore: Graphics
  pointerDown: boolean = false
  constructor (radius: number) {
    super()
    this.interactive = true
    this.radius = radius
    const back = new Graphics()
      .beginFill('0xA39171', 0.4)
      .drawCircle(0, 0, this.radius)
      .endFill()
    back.alpha = 0.5
    this.addChild(back)

    this.fore = new Graphics()
      .beginFill(0)
      .drawCircle(0, 0, radius / 4)
      .endFill()
    this.fore.alpha = 0.5
    this.addChild(this.fore)

    this.on('pointerdown', this.onPointerDown.bind(this))
    this.on('pointermove', this.onPointerMove.bind(this))
    this.on('pointerup', this.onPointerUp.bind(this))
    this.on('mouseupoutside', this.onPointerUp.bind(this))
  }

  onPointerDown (event: Event): void {
    this.pointerDown = true
    event.stopPropagation()
  }

  // figure out the event type
  onPointerMove (event: { data: { global: { x: number, y: number } }, stopPropagation: () => void }): void {
    if (this.pointerDown) {
      const global = this.toGlobal(new Point(0, 0))
      const dx = event.data.global.x - global.x
      const dy = event.data.global.y - global.y

      if (Game.PLAYER != null) {
        const data = { x: dx, y: dy }
        // ADD_TO_BENCHMARK(data);
        Game.socket.emit('pointer', data)
        Game.PLAYER.setDirection(data.x, data.y)
      }

      event.stopPropagation()
    }

    if ((Game.PLAYER?.direction) == null) { return }

    const dir = Game.PLAYER.direction.multiply(this.radius)
    const point = Game.PLAYER.direction.rotateBy(Math.PI / 2).multiply(this.radius / 4)

    this.fore
      .clear()
      .moveTo(dir.x, dir.y)
      .beginFill(0)
      .lineTo(point.x, point.y)
      .arc(0, 0, this.radius / 4, point.getAngle(), point.getAngle() + Math.PI)
      .closePath()
      .endFill()
  }

  onPointerUp (): void {
    this.pointerDown = false
  }
}
