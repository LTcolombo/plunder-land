import { AnimatedSprite, type Point } from 'pixi.js'
import AnimationClip from './animationclip'

export class AnimationStates extends AnimatedSprite {
  clips: Record<string, AnimationClip>
  defaultClip: string | undefined
  current: string | undefined

  constructor (framesetName: string, speed: number, anchor: Point) {
    const defaultClip = new AnimationClip(framesetName, speed, true, anchor)

    super(defaultClip.tex, true)

    this.clips = {}
    this.clips[framesetName] = defaultClip
    this.defaultClip = framesetName
    this.playClip(framesetName)
    this.onComplete = this.playDefault.bind(this)
  }

  addClip (
    framesetName: string,
    speed: number,
    anchor: Point,
    loop: boolean = false
  ): void {
    this.clips[framesetName] = new AnimationClip(
      framesetName,
      speed,
      loop,
      anchor
    )
  }

  playClip (name: string): void {
    if (this.current === name) {
      return
    }

    if (!this.loop && this.playing) {
      return
    }

    if (this.clips[name] === undefined) console.error('no animation clip by name', name)
    else {
      this.textures = this.clips[name].tex
      this.anchor = this.clips[name].anchor
      this.animationSpeed = this.clips[name].animationSpeed
      this.loop = this.clips[name].loop
      this.play()

      this.current = name
    }
  }

  setDefault (value: string | undefined): void {
    if (this.defaultClip === value) { return }
    this.defaultClip = value
    this.playDefault()
  }

  playDefault (): void {
    if (this.defaultClip !== undefined) this.playClip(this.defaultClip)
  }
}
