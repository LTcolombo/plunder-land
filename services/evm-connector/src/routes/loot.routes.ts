import { AuroraTestnet } from '@thirdweb-dev/chains'
import { type BaseERC20 } from '@thirdweb-dev/sdk/dist/declarations/src/evm/types/eips'
import { ThirdwebSDK, type CurrencyValue, type Erc20 } from '@thirdweb-dev/sdk/evm'
import { type providers } from 'ethers'
import { Router, type Request, type Response } from 'express'

export class LootRoutes {
  contract: Erc20<BaseERC20>
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
      this._router.post('/debit/:address', async (req: Request, res: Response) => {
        try {
          res.json(await this.debit(req.params.address, req.body.amount))
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
      this.contract = (await sdk.getContract('0x198543B8f9b83d2477F1eD897834D6890f98e6f1')).erc20
    }
  }

  private async getBalance (address: string): Promise<CurrencyValue | undefined> {
    await this.lazyInit()
    return await this.contract.balanceOf(address)
  }

  private async debit (address: string, amount: number): Promise<providers.TransactionReceipt> {
    await this.lazyInit()
    return (await this.contract.transfer(address, amount)).receipt
  }
}
