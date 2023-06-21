import { AuroraTestnet } from '@thirdweb-dev/chains'
import { type NFT } from '@thirdweb-dev/sdk'
import { type BaseERC1155 } from '@thirdweb-dev/sdk/dist/declarations/src/evm/types/eips'
import { ThirdwebSDK, type Erc1155, type TransactionResultWithId } from '@thirdweb-dev/sdk/evm'
import { Router, type Request, type Response } from 'express'
import { GEAR_PRESET_METADATA } from '../data/metadata.presets'

type GearBoost = Record<'damage' | 'armor' | 'speed', number>

export class GearRoutes {
  contract: Erc1155<BaseERC1155>
  private _router: Router

  get router (): Router {
    if (this._router == null) {
      this._router = Router()
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._router.get('/balance/:address', async (req: Request, res: Response) => {
        try {
          res.json(await this.getBalance(req.params.address))
        } catch (e: any) {
          res.status(500).send(e.message)
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._router.post('/mint/:address', async (req: Request, res: Response) => {
        try {
          res.json(await this.mint(req.params.address))
        } catch (e: any) {
          res.status(500).send(e.message)
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._router.get('/equipment/:address', async (req: Request, res: Response) => {
        try {
          res.json(await this.equipment(req.params.address))
        } catch (e: any) {
          res.status(500).send(e.message)
        }
      })
    }

    return this._router
  }

  private async lazyInit (): Promise<void> {
    // throw somethign if needed
    if (this.contract === undefined && process.env.PRIVATE_KEY !== undefined) {
      const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, AuroraTestnet)
      this.contract = (await sdk.getContract('0x01c25BecA7B2548367d440FEBC11092446615AF4')).erc1155
    }
  }

  private async getBalance (address: string): Promise<NFT[]> {
    await this.lazyInit()
    return await this.contract.getOwned(address)
  }

  async equipment (address: string): Promise<GearBoost> {
    const nfts = await this.getBalance(address)

    const result: GearBoost = {
      damage: 0,
      armor: 0,
      speed: 0
    }

    for (const nft of nfts) {
      if (nft.metadata.attributes == null) { continue }
      const data = this.attributesToMap(nft.metadata.attributes as any)

      // todo check slots
      if (result.damage < data.damage) { result.damage = data.damage }
      if (result.armor < data.armor) { result.armor = data.armor }
      if (result.speed < data.speed) { result.speed = data.speed }
    }

    return result
  }

  attributesToMap (attributes: Array<{ trait_type: string, value: string }>): Record<string, number> {
    const result = {}
    for (const attibute of attributes) {
      result[attibute.trait_type] = parseInt(attibute.value)
    }

    return result
  }

  async mint (address: string): Promise<TransactionResultWithId<NFT>> {
    await this.lazyInit()

    console.log(address,
      {
        metadata: GEAR_PRESET_METADATA[Math.floor(Math.random() * GEAR_PRESET_METADATA.length)],
        supply: 1
      })

    return await this.contract.mintTo(address,
      {
        metadata: GEAR_PRESET_METADATA[Math.floor(Math.random() * GEAR_PRESET_METADATA.length)],
        supply: 1
      })
  }
}
