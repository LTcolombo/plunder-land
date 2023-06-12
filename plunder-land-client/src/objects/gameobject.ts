import { Container, Sprite, Point, filters, Graphics, type Texture, type RenderTexture, type LoaderResource, SCALE_MODES } from 'pixi.js'
import TWEEN from '@tweenjs/tween.js'
import { type Vector } from '../utils/vector'
import { type AnimationStates } from '../animation/animationstates'
import { Game } from '../game'

export class GameObject extends Container {
  DEBUG_COLLIDER: Graphics
  radius: number
  destroyed = false
  lastUpdate: number = 0
  tag: number | undefined
  main: Sprite | undefined

  direction: Vector | undefined
  animation: AnimationStates | undefined

  constructor () {
    super()
    this.DEBUG_COLLIDER = new Graphics()
    this.DEBUG_COLLIDER.alpha = 0.3
    this.radius = 10
  }

  DEBUG_DRAW_COLLIDER (): void {
    this.DEBUG_COLLIDER.clear()
    if (this.radius !== undefined) {
      this.DEBUG_COLLIDER.beginFill(0xff00ff)
        .drawCircle(0, 0, this.radius)
        .endFill()
    }
  }

  static SHADOW_CACHE: Record<string, RenderTexture> = {}

  createShadow (texture: Texture): Sprite {
    const cacheId = `${(texture.baseTexture.resource as unknown as LoaderResource).url}@${texture.frame.x}:${texture.frame.y}`
    let renderTexture = GameObject.SHADOW_CACHE[cacheId]
    if (renderTexture === undefined) {
      const sprite = new Sprite(texture)
      const colorMatrix = new filters.ColorMatrixFilter()
      sprite.filters = [colorMatrix]
      colorMatrix.desaturate()
      colorMatrix.brightness(0, true)
      sprite.alpha = 0.3
      renderTexture = Game.RENDERER.generateTexture(sprite, SCALE_MODES.NEAREST, 1)
      Game.RENDERER.render(sprite, renderTexture)
      GameObject.SHADOW_CACHE[cacheId] = renderTexture
    }
    const shadowSprite = new Sprite(renderTexture)
    shadowSprite.anchor = new Point(0.5, 1)
    shadowSprite.skew = new Point(0.5, 0)
    return shadowSprite
  }

  update (dt: number): void {
    const global = this.toGlobal(new Point(0, 0))
    this.visible = global.x > 0 && global.x < window.innerWidth && global.y > 0 && global.y < window.innerHeight
    this.zIndex = this.position.y
  }

  destroy (): void {
    new TWEEN.Tween(this.scale)
      .to({ x: 0, y: 0 }, 200)
      .onComplete(() => {
        this.parent?.removeChild(this)
      })
      .start()

    this.destroyed = true
  }
}
