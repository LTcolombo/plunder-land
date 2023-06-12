import { TapHandler } from './taphandler'
import { Sprite, Point, Text, Container } from 'pixi.js'
import { Joystick } from './joystick'
import { PlayerStats } from './playerstats'
import { MiniMap } from './minimap'
import { type Skill } from '../skills/skill'

export class HUD extends Container {
  controlsMap = new Map<string, TapHandler>()
  map: MiniMap | undefined
  joystick: Joystick | undefined
  playerStats: PlayerStats | undefined
  mainSkillBtn: TapHandler | undefined
  skillBar: Container | undefined
  constructor () {
    super()

    window.addEventListener('keydown', this.onKeyDown.bind(this), false)
    window.addEventListener('resize', this.updateLayout.bind(this))
    window.addEventListener(
      'contextmenu',
      this.onRightButton.bind(this),
      false
    )

    this.updateLayout()
  }

  setupGameUI () {
    this.map = new MiniMap(200, 200, 0.3)
    this.addChild(this.map)

    this.joystick = new Joystick(60)
    this.addChild(this.joystick)
  }

  setupStats (value: { race: any, portrait: any }) {
    if (this.playerStats != null) return
    this.playerStats = new PlayerStats(value)
    this.addChild(this.playerStats)
  }

  updateStats (data: { level: number, xp: number }) {
    if (this.playerStats == null) return
    this.playerStats.update(data)
  }

  setupSkills (value: any[]) {
    const keys = ['q', 'w', 'e', 'r', 't', 'y']

    const mainSkill = value.shift()
    this.mainSkillBtn = this.createSkillButton(mainSkill, keys.shift()!, 100, 100)
    this.addChild(this.mainSkillBtn)

    this.skillBar = new Container()
    for (const skill of value) {
      const key = keys.shift()
      const btn = this.createSkillButton(skill, key!, 60, 60)
      this.skillBar.addChild(btn)
    }

    this.updateLayout()
    this.addChild(this.skillBar)
  }

  createSkillButton (skill: Skill, key: string, width: number, height: number): TapHandler {
    const btn = new TapHandler(
      skill.execute.bind(skill),
      skill.cooldown,
      width,
      height,
      0x00000000
    )
    const sprite = new Sprite(skill.uiTexture)
    sprite.anchor = new Point(0.5, 0.5)
    const scale = Math.min(
      width / skill.uiTexture.frame.width,
      height / skill.uiTexture.frame.height
    )
    sprite.scale = new Point(scale, scale)
    btn.addChild(sprite)
    const btnLabel = new Text(key.toUpperCase(), {
      fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
      fontSize: 32,
      fill: 'white',
      stroke: 'black',
      strokeThickness: 4
    })
    btnLabel.x = width / 2 - btnLabel.width - 5
    btnLabel.y = height / 2 - btnLabel.height

    btn.addChild(btnLabel)
    this.controlsMap.set(key, btn)
    return btn
  }

  updateLayout () {
    if (this.map != null) {
      this.map.x = 20
      this.map.y = 20
    }

    if (this.joystick != null) {
      this.joystick.x = 120
      this.joystick.y = window.innerHeight - 120
    }

    if (this.playerStats != null) {
      this.playerStats.x = window.innerWidth - 84
      this.playerStats.y = 20
    }

    if (this.mainSkillBtn != null) {
      this.mainSkillBtn.x = window.innerWidth - 100
      this.mainSkillBtn.y = window.innerHeight - 100
    }

    if (this.skillBar != null) {
      for (let i = 0; i < this.skillBar.children.length; i++) {
        this.skillBar.children[i].x = -100 - 80 * i
      }
      this.skillBar.x = window.innerWidth - 100
      this.skillBar.y = window.innerHeight - 100
    }
  }

  onKeyDown (e: { key: string }) {
    this.invokeKeyBoundSkill(e.key)
  }

  onRightButton (e: { preventDefault: () => void }) {
    this.invokeKeyBoundSkill('rmb')
    e.preventDefault()
    return false
  }

  invokeKeyBoundSkill (value: string) {
    if (this.controlsMap.has(value)) {
      this.controlsMap.get(value)?.invoke()
    }
  }

  update (dt: number) {
    if (this.map != null) this.map.update(dt)
  }

  clearGameUI () {
    if (this.map != null) {
      this.removeChild(this.map)
      this.map = undefined
    }

    if (this.joystick != null) {
      this.removeChild(this.joystick)
      this.joystick = undefined
    }

    if (this.playerStats != null) {
      this.removeChild(this.playerStats)
      this.playerStats = undefined
    }

    if (this.mainSkillBtn != null) {
      this.removeChild(this.mainSkillBtn)
      this.mainSkillBtn = undefined
    }

    if (this.skillBar != null) {
      this.skillBar.removeChildren()
      this.removeChild(this.skillBar)
      this.skillBar = undefined
    }
  }
}
