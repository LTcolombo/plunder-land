import {
  TilingSprite,
  Texture,
  Text,
  Container,
  Graphics,
  Point,
  type Renderer,
  Assets
} from 'pixi.js'
import { TextEffect } from './ui/texteffect'
import { Consumable } from './objects/consumable'
import { Obstacle } from './objects/obstacle'
import { Vector } from './utils/vector'
import { Timer } from './ui/timer'
import { type Throwable } from './objects/throwable'
import { Portal } from './objects/portal'
import TWEEN from '@tweenjs/tween.js'
import { CloudsLayer } from './objects/cloudslayer'
import Mob from './objects/mob'
import Player from './objects/player'
import GameEnterPopup from './popups/gameenterpopup'

import { FireBreathEffect } from './vfx/firebreatheffect'
import { IceBreathEffect } from './vfx/icebreatheffect'
import { MeleeAttackEffect } from './vfx/meleeattackeffect'
import { RangedAttackEffect } from './vfx/rangedattackeffect'
import { DefendEffect } from './vfx/defendeffect'
import { type GameObject } from './objects/gameobject'
import { type HUD } from './ui/hud'
import { type Socket } from 'socket.io-client'
import { type PopupManager } from './popups/popupmanager'

export class Game extends Container {
  mapSize: number
  layers: Container[] | undefined
  static CONTAINER: Container
  tags: number[] | undefined
  static OBSTACLES: GameObject[]
  static CONSUMABLES: Consumable[]
  static PLAYERS: Player[]
  static FIREBALLS: Throwable[]
  static MOBS: Mob[]
  LOOKUP: Record<string, GameObject> = {}
  cloudsLayer: CloudsLayer | undefined
  static socket: Socket
  static hud: HUD
  static socketBytes: number
  static PLAYER: Player | undefined
  static RENDERER: Renderer
  static popups: PopupManager
  static Instance: Game
  static simulate: boolean

  constructor () {
    super()
    this.mapSize = 4000
  }

  clear () {
    if (this.layers != null) {
      for (const layer of this.layers) { while (layer && layer.children.length > 0) layer.removeChildAt(0) }
    }

    while (Game.CONTAINER && Game.CONTAINER.children.length > 0) { Game.CONTAINER.removeChildAt(0) }
  }

  createLayer (tex: Texture, size: number): TilingSprite {
    const res = new TilingSprite(tex, size, size)
    res.anchor = new Point(0, 0)
    return res
  }

  start () {
    this.clear()

    // todo remove static accessors
    Game.OBSTACLES = []
    Game.CONSUMABLES = []
    Game.PLAYERS = []
    Game.FIREBALLS = []
    Game.MOBS = []

    // main container
    if (!Game.CONTAINER) {
      Game.CONTAINER = new Container()
      this.addChild(Game.CONTAINER)
    }
    // map
    this.tags = [-1, 0, 1]
    this.layers = [
      this.createLayer(Texture.from('ground.png'), this.mapSize),
      this.createLayer(Texture.from('grass.png'), this.mapSize),
      new Container()
    ]

    for (const layer of this.layers) {
      layer.alpha = 0
      layer.sortableChildren = true
      Game.CONTAINER.addChild(layer)
    }

    this.cloudsLayer = new CloudsLayer(this.mapSize)
    Game.CONTAINER.addChild(this.cloudsLayer)
    this.cloudsLayer.alpha = 0

    Game.socket.off('create')
    Game.socket.off('create_own')
    Game.socket.off('effect')
    Game.socket.off('update')
    Game.socket.off('destroy')
    Game.popups.show(new GameEnterPopup(this.onStartRequested.bind(this)))
  }

  onStartRequested () {
    Game.socket.on('create', this.onObjectsCreated.bind(this))
    Game.socket.on('create_own', this.onOwnObjectsCreated.bind(this))
    Game.socket.on('effect', this.onEffects.bind(this))
    Game.socket.on('update', this.onObjectsUpdated.bind(this))
    Game.socket.on('destroy', this.onObjectsDestroyed.bind(this))
    Game.socket.emit('start_requested')

    Game.hud.setupGameUI()
  }

  onObjectsCreated (data: ArrayBuffer[]) {
    for (const entry of data) this.onObjectCreated(entry)
  }

  onOwnObjectsCreated (data: ArrayBuffer[]) {
    for (const entry of data) this.onObjectCreated(entry, true)
  }

  deserialiseBinary (raw: ArrayBuffer): any {
    const allFields = [
      'id',
      'type',
      'position',
      'direction',
      'hp',
      'impulse',
      'level',
      'xp',
      'tag',
      'to',
      'radius',
      'lifetime',
      'maxVelocity',
      'name',
      'race',
      'portrait'
    ]

    const buffer = new Uint8Array(raw)
    Game.socketBytes += buffer.length
    const data: Record<string, number | Vector> = {}
    let value
    let offset = 0
    while (offset < buffer.length) {
      const keyIndex = buffer[offset++]
      const key = allFields[keyIndex]

      // console.log(offset, key, keyIndex);

      switch (key) {
        case 'id':
          value = (buffer[offset++] << 8) + buffer[offset++]
          break
        case 'type':
          value = buffer[offset++]
          break
        case 'position':
          value = new Vector(
            (buffer[offset++] << 8) + buffer[offset++],
            (buffer[offset++] << 8) + buffer[offset++]
          )
          break
        case 'direction':
          value = new Vector(
            this.overflow(buffer[offset++], 128) / 128,
            this.overflow(buffer[offset++], 128) / 128
          )
          break
        case 'hp':
          value = (buffer[offset++] << 8) + buffer[offset++]
          break
        case 'impulse':
          value = new Vector(buffer[offset++] / 64, buffer[offset++] / 64)
          break
        case 'level':
          value = buffer[offset++]
          break
        case 'xp':
          value = (buffer[offset++] << 8) + buffer[offset++]
          break
        case 'tag':
          value = this.overflow(buffer[offset++], 128)
          break
        case 'to':
          value = this.overflow(buffer[offset++], 128)
          break
        case 'radius':
          value = buffer[offset++]
          break
        case 'lifetime':
          value = buffer[offset++] * 100
          break
        case 'maxVelocity':
          value = buffer[offset++] * 10
          break
      }

      if (value !== undefined) data[key] = value
    }

    return data
  }

  onObjectCreated (raw: ArrayBuffer, own = false): void {
    let obj: GameObject | undefined

    const data = this.deserialiseBinary(raw)

    switch (data.type) {
      case 1:
        var sheet = Assets.get('./res/atlas.json')
        var frames =
          sheet.data.animations[
            data.tag == 0
              ? data.radius < 20
                ? 'obstacle_1/obstacle'
                : 'tree/tree'
              : 'obstacle_0/prop'
          ]
        var tex = Texture.from(
          frames[Math.floor(frames.length * Math.random())]
        )
        obj = new Obstacle(tex, data.radius)
        Game.OBSTACLES.push(obj)
        break

      case 1 << 4:
        // todo this should be handled by throwable class
        // if (this.PLAYER && this.PLAYER.type == "ice") obj = new Icicle();
        // else obj = new Throwable();
        // Game.FIREBALLS.push(obj);
        break

      case 1 << 5:
        obj = new Mob(data.radius, data.hp)
        Game.MOBS.push(obj as Mob)
        break

      case 1 << 3:
        obj = new Portal(data.radius, data.to > data.tag)
        break

      case 1 << 1:
        var sheet = Assets.get('./res/atlas.json')
        var frames = sheet.data.animations['resource/resource']
        var tex = Texture.from(
          frames[Math.floor(frames.length * Math.random())]
        )
        const consumable = new Consumable(tex, data.radius, data.radius)
        Game.CONSUMABLES.push(consumable)
        obj = consumable
        break

      case 1 << 2:
        const player = new Player()
        player.init()
        player.setHP(data.hp)
        Game.PLAYERS.push(player)
        obj = player
        break
    }

    if (obj === undefined) return

    if (data.maxVelocity) (obj as any).maxVelocity = data.maxVelocity

    if (own) {
      Game.PLAYER = obj as Player

      Game.hud.setupStats(data)
      Game.hud.setupSkills(Game.PLAYER.skills)

      console.log(data)
      this.updateLayerVisibility(data.tag)
    }

    if (data.lifetime) {
      obj.addChild(new Timer(data.lifetime / 1000))
      if (obj.main != null) obj.main.tint = 0xffbb00
    }

    if (data.name) {
      const label = new Text(data.name, {
        fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
        fontSize: 10,
        fill: 'white',
        stroke: 'black',
        strokeThickness: 1
      })

      // move into name component of gameobject
      const name = new Container()
      const graphics = new Graphics()
      graphics.alpha = 0.4
      graphics
        .beginFill(0x000000)
        .drawRect(-3, 0, label.width + 5, label.height + 2)
        .endFill()
      name.addChild(graphics)
      name.addChild(label)

      name.x = -(label.width + 5) / 2
      name.y = -50
      obj.addChild(name)
    }

    if (data.position) {
      obj.x = data.position.x
      obj.y = data.position.y
    }

    obj.tag = data.tag

    if ((this.layers != null) && (this.tags != null)) { this.layers[this.tags.indexOf(obj.tag ?? 0)].addChild(obj) }

    if (data.radius && obj.radius !== data.radius) {
      obj.radius = data.radius
      obj.DEBUG_DRAW_COLLIDER()
    }

    this.LOOKUP[data.id] = obj
  }

  overflow (value: number, limit: number) {
    if (value >= limit) value -= 2 * limit
    return value
  }

  updateLayerVisibility (tag: number) {
    if ((this.layers == null) || (this.tags == null)) return

    for (const layer of this.layers) {
      const tagIndex = this.tags.indexOf(tag)
      const layerIndex = this.layers.indexOf(layer)

      let layerAlpha = tagIndex === layerIndex ? 1 : 0
      let layerScale = 1

      if (tagIndex === 2 && layerIndex === 1) {
        layerAlpha = 0.5
        layerScale = 0.7
      }

      new TWEEN.Tween(layer).to({ alpha: layerAlpha }, 500).start()
      new TWEEN.Tween(layer.scale)
        .to({ x: layerScale, y: layerScale }, 500)
        .start()
    }

    if (this.cloudsLayer != null) {
      new TWEEN.Tween(this.cloudsLayer)
        .to({ alpha: tag === 1 ? 1 : 0 }, 500)
        .start()
    }
  }

  onEffects (data: ArrayBuffer[]) {
    // ADD_TO_BENCHMARK(data);

    for (const entry of data) this.onEffect(entry)
  }

  onEffect (raw: ArrayBuffer) {
    const buffer = new Uint8Array(raw)
    Game.socketBytes += buffer.length

    let offset = 0

    const type = buffer[offset++]
    const targetid = (buffer[offset++] << 8) + buffer[offset++]
    const lifetime = buffer[offset++] * 100

    const target = this.LOOKUP[targetid]
    if (!target) {
      console.warn('target not found for effect', buffer)
      return
    }

    switch (type) {
      case 0:
        new FireBreathEffect(target, lifetime)
        break

      case 1:
        new IceBreathEffect(target, lifetime)
        break

      case 2:
        new MeleeAttackEffect(target, lifetime)
        break

      case 3:
        new RangedAttackEffect(target)
        break

      case 4:
        new DefendEffect(target, lifetime)
        break
    }
  }

  onObjectsUpdated (data: ArrayBuffer[]) {
    // ADD_TO_BENCHMARK(data);

    for (const entry of data) this.onObjectUpdated(entry)
  }

  onObjectUpdated (raw: ArrayBuffer) {
    const data = this.deserialiseBinary(raw)

    const obj = this.LOOKUP[data.id]
    if (obj) {
      // TODO generalise unit, move this into setData of relative descendant
      if (data.direction) obj.setDirection(data.direction.x, data.direction.y)

      if (data.position) {
        if (obj.setMoveTarget) { obj.setMoveTarget(new Vector(data.position.x, data.position.y)) } else {
          obj.x = data.position.x
          obj.y = data.position.y
        }
      }

      if (data.maxVelocity) obj.maxVelocity = data.maxVelocity

      if (data.hp && obj.setHP) obj.setHP(data.hp)

      if (data.level && obj.setLevel) {
        obj.setLevel(data.level)
        if (obj === Game.PLAYER) Game.hud.updateStats(data)
      }

      if (data.xp && data.xp !== obj.xp) {
        new TextEffect(
          `+${data.xp < obj.xp ? data.xp : data.xp - obj.xp}`,
          Game.CONTAINER,
          obj.x,
          obj.y,
          24,
          'teal',
          400
        )
        obj.xp = data.xp

        if (obj === Game.PLAYER) Game.hud.updateStats(data)
      }

      if (data.tag !== undefined && data.tag !== obj.tag) {
        obj.tag = data.tag
        this.layers[this.tags.indexOf(obj.tag)].addChild(obj)

        if (obj === Game.PLAYER) this.updateLayerVisibility(data.tag)
      }

      if (data.radius && obj.radius !== data.radius) {
        obj.radius = data.radius
        if (obj.DEBUG_DRAW_COLLIDER) obj.DEBUG_DRAW_COLLIDER()
      }

      obj.lastUpdate = Date.now()
    }
  }

  onObjectsDestroyed (data: ArrayBuffer[]) {
    for (const entry of data) this.onObjectDestroyed(entry)
  }

  onObjectDestroyed (raw: ArrayBuffer) {
    const data = this.deserialiseBinary(raw)

    if (this.LOOKUP[data.id]) {
      this.LOOKUP[data.id].destroy()
      if (this.LOOKUP[data.id] === Game.PLAYER) {
        new TextEffect('Game Over', this, 0, 0)
        setTimeout(this.start.bind(this), 2000)
        Game.PLAYER = undefined
        Game.hud.clearGameUI()
      }
      this.LOOKUP[data.id].destroy()
    }
  }

  update (dt: number) {
    for (const obj of Game.OBSTACLES) {
      obj.update(dt)
    }

    for (const obj of Game.FIREBALLS) {
      obj.moveToTarget(dt)
    }

    for (const obj of Game.CONSUMABLES) {
      obj.update(dt)
    }

    const noUpdateDelay = (Game.PLAYER != null) ? 500 : 2000

    for (const obj of Game.PLAYERS) {
      obj.visible = obj.lastUpdate > Date.now() - noUpdateDelay
      obj.update(dt)
    }

    for (const obj of Game.MOBS) {
      obj.visible = obj.lastUpdate > Date.now() - noUpdateDelay
      obj.update(dt)
    }

    if (Game.PLAYER != null) {
      Game.CONTAINER.x = -Game.PLAYER.x
      Game.CONTAINER.y = -Game.PLAYER.y

      // parallax (kinda)
      for (const layer of this.layers) {
        layer.x = Game.PLAYER.x * (1 - layer.scale.x)
        layer.y = Game.PLAYER.y * (1 - layer.scale.y)
      }
    }

    this.cloudsLayer.update(dt)
  }
}
