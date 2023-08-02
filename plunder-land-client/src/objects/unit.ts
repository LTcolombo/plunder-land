import { ProgressBar } from '../ui/elements/progressbar'
import { type Texture, Sprite, Point, ColorMatrixFilter } from 'pixi.js'
import { type Vector } from '../utils/vector'
import { GameObject } from './gameobject'
import { TextEffect } from '../ui/elements/texteffect'

export default class Unit extends GameObject {
  shadow: Sprite | undefined
  _velocity: number = 0
  loot: number = 0
  progressBar: ProgressBar | undefined
  level: number = 0
  hp: number | undefined
  moveTarget: Vector | undefined

  becameIdleAt: number = 0

  maxHP: number = 0
  runAnimation: string | undefined
  idleAnimation: string | undefined

  constructor (radius: number = 0) {
    super()

    if (radius > 0) {
      this.radius = radius
      this.DEBUG_DRAW_COLLIDER()
    }

    this.initAnimation()

    if (this.animation !== undefined) {
      this.shadow = new Sprite(
        this.animation.textures[this.animation.currentFrame] as Texture
      )
      const colorMatrix = new ColorMatrixFilter()
      this.shadow.filters = [colorMatrix]
      colorMatrix.desaturate()
      colorMatrix.brightness(0, true)
      this.shadow.alpha = 0.3
      this.shadow.anchor.x = 0.5
      this.shadow.anchor.y = 1
      this.shadow.skew = new Point(0.5, 0)

      this.addChild(this.shadow)

      this.animation.y += this.animation.height / 3
      this.shadow.y += this.animation.height / 3
    }

    this.progressBar = new ProgressBar()
    this.addChild(this.progressBar.graphics)
  }

  initAnimation (): void {}

  setHP (value: number): void {
    if (this.maxHP === 0) {
      this.maxHP = value

      if (this.progressBar !== undefined) {
        this.progressBar.width = this.maxHP
        this.progressBar.graphics.x = -this.progressBar.width / 2
        this.progressBar.graphics.y = this.radius + 5
      }

      console.log(this.constructor.name, this.hp, this.maxHP, value)
    }

    if (this.hp === value) return
    if (this.hp !== undefined) {
      if (this.visible && this.parent !== null && value < this.hp) {
      // eslint-disable-next-line no-new
        new TextEffect(
        `${value - this.hp}`,
        this.parent,
        this.x,
        this.y,
        24,
        'red',
        400
        )
      }
    }

    this.hp = value
    this.progressBar?.setValue(this.hp / this.maxHP)
  }

  update (dt: number): void {
    if (this.moveTarget === undefined) { return }

    const now = Date.now()

    if (this.becameIdleAt !== 0 && now - this.becameIdleAt > 100) { this.animation?.setDefault(this.idleAnimation) }

    const dx = this.moveTarget.x - this.x
    const dy = this.moveTarget.y - this.y

    // cheap ABS
    if (dx < 1 && dy < 1 && dx > -1 && dy > -1) {
      if (this.becameIdleAt === 0) { this.becameIdleAt = now }
      return
    }

    this.becameIdleAt = 0

    this.animation?.setDefault(this.runAnimation)

    this.DEBUG_COLLIDER.x = this.moveTarget.x - this.x
    this.DEBUG_COLLIDER.y = this.moveTarget.y - this.y

    if (this.animation != null && this.shadow != null) {
      this.animation.scale.x = Math.abs(this.animation.scale.x) * (dx < 0 ? -1 : 1)
      this.shadow.scale = new Point(this.animation.scale.x * 1.1, this.animation.scale.y * 1.1)
    }

    if (!this.killed && this.moveTarget !== undefined) {
      const dir = this.moveTarget.subElem(this.x, this.y).normalised()

      this.x += dir.x * dt * this._velocity
      this.y += dir.y * dt * this._velocity
    }

    if (this.animation == null || this.shadow == null) return

    this.shadow.texture = this.animation.textures[
      this.animation.currentFrame
    ] as Texture
    this.zIndex = this.position.y
  }

  setMoveTarget (value: Vector): void {
    if ((this.timeSinceUpdate) > 0) { this._velocity = value.subElem(this.x, this.y).getMagnitude() / (this.timeSinceUpdate) }
    this.moveTarget = value
  }
}
