import TWEEN from '@tweenjs/tween.js'
import * as io from 'socket.io-client'
import Stats from 'stats.js'
import { PopupManager } from './popups/popupmanager'
import { Game } from './game'
import { HUD } from './ui/hud'
import { Application, Assets, Point, settings } from 'pixi.js'

const stats = new Stats()
const app = new Application()
const socketPanel = stats.addPanel(new Stats.Panel('b/s', '#ff8', '#221'))

settings.ROUND_PIXELS = true

start()

function start () {
  Game.socketBytes = 0
  stats.showPanel(3) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)

  document.body.appendChild(app.view)

  app.view.style.width = '100%'
  app.view.style.height = '100%'
  app.stage.interactive = true

  Game.RENDERER = app.renderer
  app.renderer.backgroundColor = 0

  Assets.load('./res/atlas.json').then(setup)
}

function setup () {
  const host = 'localhost:8000'

  let url = `${window.location.protocol}//${host}`

  if (window.location.href.lastIndexOf('?') > 0) {
    url += window.location.href.substring(
      window.location.href.lastIndexOf('?')
    )
  }

  Game.socket = io.connect(url)

  Game.socket.on('connect', () => {
    onConnect()
  })
}

function onConnect () {
  if (!Game.Instance) {
    Game.Instance = new Game()
    app.stage.addChild(Game.Instance)
  }

  if (!Game.hud) {
    Game.hud = new HUD()
    app.stage.addChild(Game.hud)
  }

  if (Game.popups) {
    Game.popups.removeChildren()
    app.stage.removeChild(Game.popups)
  }
  Game.popups = new PopupManager()
  app.stage.addChild(Game.popups)

  Game.Instance.start()

  if (true) {
    app.stage.on('pointermove', updatePointer)
    app.stage.on('pointerdown', updatePointer)
    app.stage.on('pointerup', updatePointer)
  }

  Game.simulate = false
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 's') Game.simulate = !Game.simulate
    },
    false
  )

  window.requestAnimationFrame(frame)

  window.addEventListener('resize', onResize)
  onResize()
}

function updatePointer (event: { data: { buttons: number, global: { x: number, y: number } } }): void {
  if (Game.PLAYER === undefined) return

  if (event.data.buttons !== 0) {
    const globalpos = Game.PLAYER.toGlobal(new Point(0, 0))

    const data = {
      x: event.data.global.x - globalpos.x,
      y: event.data.global.y - globalpos.y
    }

    Game.socket.emit('pointer', data)
    Game.PLAYER.setDirection(data.x, data.y)
  } else if (Game.PLAYER.direction != null) {
    Game.PLAYER.stop()
    Game.socket.emit('pointer', { x: 0, y: 0 })
  }
}

let _prevTime = 0
let _socketDump = 0

let maxSocketBytes = 1

function frame () {
  stats.begin()
  const now = Date.now()
  if (_prevTime) {
    const dt = now - _prevTime
    Game.Instance.update(dt / 1000)
    Game.hud.update(dt / 1000)
  }
  _prevTime = now
  TWEEN.update()
  stats.end()

  if (now > _socketDump + 1000) {
    maxSocketBytes = Math.max(Game.socketBytes, maxSocketBytes)
    socketPanel.update(Game.socketBytes, maxSocketBytes)
    Game.socketBytes = 0
    _socketDump = now
  }

  requestAnimationFrame(frame)
}

function onResize () {
  app.renderer.resize(window.innerWidth, window.innerHeight)
  Game.Instance.x = window.innerWidth / 2
  Game.Instance.y = window.innerHeight / 2
}
