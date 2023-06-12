import { ProgressBar } from '../ui/progressbar'
import { type Texture, Sprite, Point, ColorMatrixFilter } from 'pixi.js'
import { Vector } from '../utils/vector'
import { GameObject } from './gameobject'
import { TextEffect } from '../ui/texteffect'
import { Dash } from '../skills/dash'
import { MeleeAttack } from '../skills/meleeattack'
import { type RangedAttack } from '../skills/rangedattack'
import { type Defend } from '../skills/defend'
import { AnimationStates } from '../animation/animationstates'

export default class Player extends GameObject {
  targetAquiredAt: number
  target: null
  isDragon: boolean
  canAttack: boolean
  skills: Array<Defend | Dash | MeleeAttack | RangedAttack>
  shadow: Sprite
  maxVelocity: number | undefined
  xp: number | undefined
  progressBar: ProgressBar | undefined
  impulse = new Vector(0, 0)
  level: number = 0
  hp: number | undefined
  _targetAge: number = 0
  moveTarget: GameObject | undefined
  _lastTargetAge: number = 0

  constructor () {
    super()

    this.targetAquiredAt = 0
    this.target = null
    this.isDragon = true
    this.canAttack = true

    this.skills = [
    //   new Defend(this),q
      new Dash(this),
      new MeleeAttack(this)
    //   new RangedAttack(this),
    ]
    for (let i = 0; i < this.skills.length; i++) this.skills[i].index = i

    this.animation = new AnimationStates(
      'player/idle/idle',
      0.2,
      new Point(0.5, 1)
    )
    this.animation.addClip('player/run/run', 0.2, new Point(0.5, 1), true)
    this.animation.addClip('player/melee_1/attack', 0.2, new Point(0.5, 1))
    this.animation.addClip('player/melee_2/attack', 0.2, new Point(0.5, 1))
    this.animation.addClip('player/melee_3/attack', 0.2, new Point(0.5, 1))
    this.animation.addClip('player/melee_4/attack', 0.2, new Point(0.5, 1))
    this.animation.addClip('player/die/die', 0.1, new Point(0.36, 1))
    this.animation.play()
    this.addChild(this.animation)

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

  init () {
    this.maxVelocity = 140
    this.xp = 0
    this.progressBar = new ProgressBar()
    this.addChild(this.progressBar.graphics)

    this.impulse = new Vector(0, 0)
    this.setLevel(1)
  }

  maxHP () {
    return [120, 180, 250, 350][this.level]
  }

  setHP (value: number) {
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
    this.progressBar?.setValue(this.hp / this.maxHP())
  }

  getNextPos (dt: number) {
    if (!this.maxVelocity || (this.direction == null)) return new Vector(this.x, this.y)
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
    if (!(x || y)) {
      stop()
      return
    }

    this.direction = new Vector(x, y).normalised()
    this.animation?.setDefault('player/run/run')
  }

  stop () {
    this.direction = undefined
    this.animation?.setDefault('player/idle/idle')
  }

  update (dt: number) {
    this._targetAge++
    this.moveToTarget()

    if (this.animation == null) return

    this.shadow.texture = this.animation.textures[
      this.animation.currentFrame
    ] as Texture
    this.zIndex = this.position.y
  }

  setMoveTarget (value: GameObject) {
    this.moveTarget = value
    if (!this.visible && this.moveTarget) {
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
    // rotate

    if ((this.animation != null) && (this.direction != null)) {
      this.animation.scale.x = this.direction.x < 0 ? -1 : 1
	  this.shadow.scale = new Point(this.animation.scale.x * 1.1, this.animation.scale.y * 1.1)
    }

    // translate
    if (this.moveTarget?.x) {
      const damper = (this.direction != null) ? 4 : 1
      this.x += (this.moveTarget.x - this.x) / damper
      this.y += (this.moveTarget.y - this.y) / damper
    }
  }

  setLevel (value: number) {
    if (this.level === value) return
    this.level = value
    this.hp = this.maxHP()
    if ((this.progressBar == null) || (this.animation == null)) return

    const size = 50

    this.progressBar.width = size / 2
    this.progressBar.graphics.x = -this.progressBar.width / 2
    this.progressBar.graphics.y = size / 2
    this.progressBar.setValue(this.hp / this.maxHP())
  }

  destroy () {
    this.animation?.playClip('player/die/die')
    this.animation?.setDefault(undefined)

    if (this.progressBar != null) { this.removeChild(this.progressBar.graphics) }

    const self = this
    setTimeout(() => {
      if (self.parent) this.parent.removeChild(self)
    }, 1700)

    this.destroyed = true
  }
}
