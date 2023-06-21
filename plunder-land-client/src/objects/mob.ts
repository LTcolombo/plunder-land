import { ProgressBar } from '../ui/elements/progressbar'
import {
  Texture,
  AnimatedSprite,
  Sprite,
  Point,
  Assets,
  ColorMatrixFilter
} from 'pixi.js'
import { Vector } from '../utils/vector'
import { GameObject } from './gameobject'
import { TextEffect } from '../ui/elements/texteffect'

export default class Mob extends GameObject {
  animationSprite: AnimatedSprite
  maxHP: number
  shadow: Sprite
  hp: number | undefined
  progressBar: ProgressBar | undefined
  impulse: Vector = new Vector(0, 0)
  maxVelocity: number | undefined
  moveTarget: GameObject | undefined
  private _targetAge: number = 0
  private _lastTargetAge: number = 0

  constructor (radius: number, hp: number) {
    super()
    const sheet = Assets.get('./res/atlas.json')
    const tex = new Array<Texture>()

    for (const frame of radius < 31
      ? sheet.data.animations['mob/mob']
      : sheet.data.animations['boss/boss']) { tex.push(Texture.from(frame)) }

    this.animationSprite = new AnimatedSprite(tex, true)
    this.animationSprite.anchor = new Point(0.5, 1)
    this.animationSprite.animationSpeed = 0.1 + Math.random() / 10
    this.animationSprite.play()

    const targetScale = (radius * 3) / 64
    this.animationSprite.scale = new Point(targetScale, targetScale)

    this.addChild(this.animationSprite)
    this.maxHP = hp

    // generalise with player into "unit"
    this.shadow = new Sprite(
      this.animationSprite.textures[
        this.animationSprite.currentFrame
      ] as Texture
    )
    const colorMatrix = new ColorMatrixFilter()
    this.shadow.filters = [colorMatrix]
    colorMatrix.desaturate()
    colorMatrix.brightness(0, true)
    this.shadow.alpha = 0.3
    this.shadow.anchor = new Point(0.5, 1)
    this.shadow.skew = new Point(0.5, 0)
    this.shadow.scale = new Point(targetScale * 1.1, targetScale * 1.1)

    this.addChild(this.shadow)

    this.animationSprite.y += this.animationSprite.height / 2
    this.shadow.y += this.animationSprite.height / 2

    this.init()
  }

  init () {
    this.hp = this.maxHP
    this.progressBar = new ProgressBar()
    this.addChild(this.progressBar.graphics)
    this.progressBar.width = this.animationSprite.width / 2
    this.progressBar.graphics.x = -this.progressBar.width / 2
    this.progressBar.graphics.y = this.animationSprite.height / 2
    this.progressBar.setValue(this.hp / this.maxHP)
  }

  setHP (value: number): void {
    if (this.hp === value) return

    if (this.hp && this.visible && this.parent && value < this.hp) {
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

    this.hp = value
    this.progressBar?.setValue(this.hp / this.maxHP)
  }

  getNextPos (dt: number) {
    if ((this.direction == null) || !this.maxVelocity) return new Vector(this.x, this.y)

    const translate = this.direction
      .add(this.impulse)
      .normalised()
      .multiply(dt * this.maxVelocity)
    return new Vector(this.x + translate.x, this.y + translate.y)
  }

  getDirectionTo (target_x: number, target_y: number) {
    return new Vector(target_x - this.x, target_y - this.y).normalised()
  }

  setDirectionTo (target_x: number, target_y: number) {
    this.direction = this.getDirectionTo(target_x, target_y)
  }

  setDirection (x: number, y: number) {
    this.direction = new Vector(x, y).normalised()
  }

  update (dt: number) {
    this._targetAge++
    this.moveToTarget()
    this.shadow.texture = this.animationSprite.textures[
      this.animationSprite.currentFrame
    ] as Texture
    this.zIndex = -this.position.x
  }

  setMoveTarget (value: GameObject) {
    this.moveTarget = value
    if (!this.visible) {
      this.x = this.moveTarget.x
      this.y = this.moveTarget.y
      this._targetAge = this._lastTargetAge = 1
    } else {
      this._lastTargetAge =
        Math.max(this._lastTargetAge - 1, this._targetAge) || 1
      this._targetAge = 1
    }
  }

  moveToTarget () {
    if (this.direction != null) {
      this.animationSprite.scale = new Point(
        Math.abs(this.animationSprite.scale.x) *
          (this.direction.x > 0 ? 1 : -1),
        this.animationSprite.scale.y
      )

      this.shadow.scale = new Point(
        this.animationSprite.scale.x * 1.1,
        this.animationSprite.scale.y * 1.1
      )
    }
    // translate
    if (this.moveTarget?.x) {
      this.x +=
        (this.moveTarget.x - this.x) /
        Math.max(1, this._lastTargetAge - this._targetAge)
      this.y +=
        (this.moveTarget.y - this.y) /
        Math.max(1, this._lastTargetAge - this._targetAge)
    }
  }
}
