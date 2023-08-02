import { Graphics, Point } from 'pixi.js'
import { ToolKit } from './toolkit'
import axios from 'axios'

export class Leaderboard extends Graphics {
  label

  constructor () {
    super()
    this.label = ToolKit.createText('test', new Point(0, 0), 20)
    this.label.style.fill = 'black'
    this.label.anchor = ToolKit.TOP_LEFT_ANCHOR
    this.label.x = 10

    this.addChild(this.label)
    void this.refresh()

    window.addEventListener('resize', this.onResize.bind(this))
    this.onResize()
  }

  async refresh (): Promise<void> {
    const response = await axios.get('http://localhost:8001/stats')
    this.setData(response.data)

    setTimeout(() => { void this.refresh() }, 3000)
  }

  setData (value: Record<string, { kills: number, mobKills: number, bossKills: number, games: number, lootCollected: number, lifeTime: number }>): void {
    const lines = ['Leaderboard:']
    for (const address in value) {
      lines.push(`${address.slice(-6)}: kills: ${value[address].kills}`)
    }

    this.label.text = lines.join('\n')
    this
      .clear()
      .beginFill(0xA39171, 0.4)
      .drawRect(0, 0, this.label.width + 20, this.label.height + 10)
      .endFill()

    this.onResize()
  }

  onResize (): void {
    this.x = window.innerWidth - this.width - 10
    this.y = 10
  }
}
