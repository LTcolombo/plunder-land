import { Texture, AnimatedSprite, Point, Assets } from 'pixi.js'

export default class AnimationClip extends AnimatedSprite {
  tex: Texture[]

  constructor (
    framesetName: string,
    speed: number = 0.5,
    loop: boolean = false,
    anchor = new Point(0.5, 0.5)
  ) {
    const sheet = Assets.get('./res/atlas.json')
    const tex = new Array<Texture>()
    for (const frame of sheet.data.animations[framesetName]) { tex.push(Texture.from(frame)) }

    super(tex, true)
    this.tex = tex
    this.anchor = anchor
    this.animationSpeed = speed
    this.loop = loop
  }
}
