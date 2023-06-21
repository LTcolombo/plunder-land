import { Container, Point, type Sprite, type Text, Texture } from 'pixi.js'
import { TapHandler } from '../elements/taphandler'
import AnimationClip from '../../animation/animationclip'
import { BrowserProvider, type JsonRpcSigner } from 'ethers'
import { TokenService } from '../../services/token.service'
import { ToolKit } from '../components/toolkit'
import { Game } from '../../game'

export default class GameEnterPopup extends Container {
  callback: (address: string) => Promise<void>
  bg: Sprite
  container: Container
  title: Text
  balanceValue: Text
  gearContainer: any

  constructor (callback: (address: string) => Promise<void>) {
    super()
    this.callback = callback

    this.container = new Container()
    this.addChild(this.container)
    this.bg = ToolKit.createSprite(Texture.from('UI/elements/bg.png'), new Point(0, 0), new Point(2, 2), ToolKit.TOP_LEFT_ANCHOR)
    this.container.addChild(this.bg)

    this.container.x = -this.bg.width / 2
    this.container.y = -this.bg.height / 2

    this.title = ToolKit.createText('PLUNDERLAND', new Point(this.bg.width / 2, 35))
    this.container.addChild(this.title)

    const playerPanel = new Container()
    playerPanel.position = new Point((this.bg.width - playerPanel.width) / 2, 110)

    playerPanel.addChild(ToolKit.createSprite(Texture.from('UI/elements/cell.png'), new Point(0, 0), new Point(2, 2)))

    const playerAnim = new AnimationClip('player/idle/idle', 0.2, true)
    playerAnim.play()
    playerPanel.addChild(playerAnim)

    this.container.addChild(playerPanel)

    this.container.addChild(ToolKit.createText('gear:', new Point(this.bg.width / 2, 160), 14))

    this.gearContainer = new Container()
    this.gearContainer.position = new Point(this.bg.width / 2, 190)
    this.container.addChild(this.gearContainer)

    this.container.addChild(ToolKit.createText('balance:', new Point(this.bg.width / 2, 220), 14))

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const addBalance = new TapHandler(this.onTopUpLoot.bind(this))
    addBalance.addChild(ToolKit.createSprite(Texture.from('UI/elements/cell.png')))
    addBalance.addChild(ToolKit.createSprite(Texture.from('UI/elements/plus.png'), new Point(0, 0), new Point(2.5, 2.5)))
    addBalance.position = new Point(218, 265)
    this.container.addChild(addBalance)

    const balancePanel = new Container()
    balancePanel.position = new Point(this.bg.width / 2, 260)
    balancePanel.addChild(ToolKit.createSprite(Texture.from('UI/elements/text_panel.png'), new Point(0, 0), new Point(2, 2)))
    this.container.addChild(balancePanel)

    this.balanceValue = ToolKit.createText('...', new Point(0, 5), 14)
    balancePanel.addChild(this.balanceValue)

    balancePanel.addChild(ToolKit.createSprite(Texture.from('UI/elements/coin.png'), new Point(25, 5), new Point(1, 1)))

    void this.checkState()
  }

  async checkState (): Promise<void> {
    const eth = (window as any).ethereum
    const provider = new BrowserProvider(eth)

    Game.loader.enable()
    const accs = await provider.listAccounts()
    Game.loader.disable()
    if (accs.length > 0) {
      void this.processAddress(accs[0].address)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const connectButton = new TapHandler(this.onConnectClick.bind(this))

      connectButton.addChild(ToolKit.createSprite(Texture.from('UI/elements/button.png'), new Point(0, 0), new Point(1, 1)))
      connectButton.addChild(ToolKit.createText('connect'))

      connectButton.position = new Point((this.bg.width) / 2, (this.bg.height) - 45)
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
    void this.processAddress(value.address)
  }

  async processAddress (address: string): Promise<void> {
    TokenService.instance.address = address

    Game.loader.enable()

    this.balanceValue.text = await TokenService.instance.getLootBalance()
    this.title.text = `${address.slice(0, 4)}.${address.slice(-2)}`

    await this.renderGear()

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const connectButton = new TapHandler(this.onStartClick.bind(this))

    connectButton.addChild(ToolKit.createSprite(Texture.from('UI/elements/button.png'), new Point(0, 0), new Point(1, 1)))
    connectButton.addChild(ToolKit.createText('start'))

    connectButton.position = new Point((this.bg.width) / 2, (this.bg.height) - 45)
    this.container.addChild(connectButton)

    Game.loader.disable()
  }

  async renderGear (): Promise<void> {
    // ultra primitive VBOX thing
    const getX = (i: number, total: number): number => {
      return (-total / 2 + i) * 40
    }

    this.gearContainer.removeChildren()

    const gear = await TokenService.instance.getGearImages()
    let i = 0
    for (const img of gear) {
      const gearSlot = new Container()
      gearSlot.addChild(ToolKit.createSprite(Texture.from('UI/elements/cell.png')))
      gearSlot.addChild(ToolKit.createSprite(Texture.from(img), new Point(0, 0), new Point(0.9, 0.9)))
      gearSlot.x = getX(i++, gear.length)
      this.gearContainer.addChild(gearSlot)
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const mintButton = new TapHandler(this.onMintGear.bind(this))
    mintButton.addChild(ToolKit.createSprite(Texture.from('UI/elements/cell.png')))
    mintButton.addChild(ToolKit.createSprite(Texture.from('UI/elements/plus.png'), new Point(0, 0), new Point(2.5, 2.5)))
    mintButton.x = getX(i, gear.length)
    this.gearContainer.addChild(mintButton)
  }

  async onStartClick (): Promise<void> {
    if (TokenService.instance.address !== undefined) { void this.callback(TokenService.instance.address) }
    this.parent?.removeChild(this)
  }

  async onMintGear (): Promise<void> {
    Game.loader.enable()
    const result = await TokenService.instance.mintGear()
    console.log('minted', 'https://explorer.testnet.aurora.dev/tx/' + result.receipt.transactionHash)
    await this.renderGear()
    Game.loader.disable()
  }

  async onTopUpLoot (): Promise<void> {
    Game.loader.enable()
    const result = await TokenService.instance.getLoot()
    console.log('debited', 'https://explorer.testnet.aurora.dev/tx/' + result.transactionHash)
    this.balanceValue.text = await TokenService.instance.getLootBalance()
    Game.loader.disable()
  }
}
