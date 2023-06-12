import { Container, Point, Sprite, Text, Texture } from 'pixi.js'
import { TapHandler } from '../ui/taphandler'
import AnimationClip from '../animation/animationclip'
import { BrowserProvider, type JsonRpcSigner } from 'ethers'

export default class GameEnterPopup extends Container {
  callback: () => void
  bg: Sprite
  container: Container

  constructor (callback: () => void) {
    super()
    this.callback = callback

    this.container = new Container()
    this.addChild(this.container)

    this.bg = new Sprite(Texture.from('UI/elements/BG.png'))
    this.bg.scale = new Point(2, 2)
    this.container.x = -this.bg.width / 2
    this.container.y = -this.bg.height / 2
    this.container.addChild(this.bg)

    const cell = new Container()

    const cellBg = new Sprite(Texture.from('UI/elements/cell.png'))
    cellBg.scale = new Point(2, 2)
    cell.addChild(cellBg)

    const player1 = new AnimationClip('player/idle/idle', 0.2, true)
    player1.play()

    player1.x = cell.width / 2
    player1.y = cell.height / 2
    cell.addChild(player1)

    this.container.addChild(cell)

    cell.x = (this.bg.width - cell.width) / 2
    cell.y = (this.bg.height - cell.height) / 2

    this.checkState()
  }

  async checkState (): Promise<void> {
    const eth = (window as any).ethereum
    const provider = new BrowserProvider(eth)
    const accs = await provider.listAccounts()
    console.log('accs', accs)
    if (accs.length > 0) {
      alert(accs[0].address)

      const startButton = new TapHandler(this.onStartClick.bind(this))

      const buttonBg = new Sprite(Texture.from('UI/elements/button.png'))
      startButton.addChild(buttonBg)

      startButton.x = (this.bg.width - buttonBg.width) - 20
      startButton.y = (this.bg.height - buttonBg.height) - 30

      const label = new Text('START', { fill: '0xFFFFFF' })
      label.anchor = new Point(0.5, 0.5)
      label.position = new Point(buttonBg.width / 2, buttonBg.height / 2)

      startButton.addChild(label)
      this.container.addChild(startButton)
    } else {
      const connectButton = new TapHandler(this.onConnectClick.bind(this))

      const buttonBg = new Sprite(Texture.from('UI/elements/button.png'))
      connectButton.addChild(buttonBg)

      connectButton.x = (this.bg.width - buttonBg.width) - 20
      connectButton.y = (this.bg.height - buttonBg.height) - 30

      const label = new Text('CONNECT', { fill: '0xFFFFFF' })
      label.anchor = new Point(0.5, 0.5)
      label.position = new Point(buttonBg.width / 2, buttonBg.height / 2)

      connectButton.addChild(label)
      this.container.addChild(connectButton)
    }
  }

  async onConnectClick (): Promise<void> {
    const eth = (window as any).ethereum
    if (eth !== undefined) {
      const provider = new BrowserProvider(eth)

      await provider.send('eth_requestAccounts', [])

      this.onAccountsChanged(await provider.getSigner())
    } else {
      alert('Please Install Metamask!!!')
    }
  }

  onAccountsChanged (value: JsonRpcSigner): void {
    alert(value.address)
  }

  async onStartClick (): Promise<void> {
    this.callback()
    this.emit('close')
  }
}
