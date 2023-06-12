import { Graphics } from 'pixi.js'
import { Game } from '../game'

export class MiniMap extends Graphics {
  mapWidth: number
  mapHeight: number
  updateRate: number
  _timeSinceRedraw: number = 0
  constructor (width: number, height: number, updateRate: number) {
    super()

    this.mapWidth = width
    this.mapHeight = height

    this.updateRate = updateRate

    this.alpha = 0.5
    this.redraw()
  }

  update (dt) {
    this._timeSinceRedraw += dt
    if (this._timeSinceRedraw > this.updateRate) {
      this.redraw()
    }
  }

  redraw () {
    this._timeSinceRedraw = 0
    this
      .clear()
      .beginFill(0)
      .drawRect(0, 0, this.mapWidth, this.mapHeight)
      .endFill()

    const ownPlayer = Game.PLAYER
    if (ownPlayer == null) { return }

    this.beginFill(0xFF6666)
    for (const mob of Game.MOBS) {
      if (mob.tag === mob.tag && !mob.destroyed) {
        this.drawCircle(mob.x * this.mapWidth / 4000, mob.y * this.mapHeight / 4000, mob.maxHP > 100 ? 3 : 1)
      }
    }
    this.endFill()

    this.beginFill(0xFFFF66)
    for (const consumable of Game.CONSUMABLES) {
      if (consumable.tag === consumable.tag && !consumable.destroyed) {
        this.drawCircle(consumable.x * this.mapWidth / 4000, consumable.y * this.mapHeight / 4000, 1)
      }
    }
    this.endFill()

    for (const player of Game.PLAYERS) {
      if (player.tag === player.tag && !player.destroyed) {
        this.beginFill(player === ownPlayer ? 0x33FF99 : 0xFF00FF)
        this.drawCircle(player.x * this.mapWidth / 4000, player.y * this.mapHeight / 4000, 3)
        this.endFill()
      }
    }
  }
}
