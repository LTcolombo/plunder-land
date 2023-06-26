import { AuroraTestnet } from '@thirdweb-dev/chains'
import { ThirdwebSDK, type Erc20, type ContractEvent } from '@thirdweb-dev/sdk/evm'
import { Router, type Request, type Response } from 'express'
import { type BaseERC20 } from '@thirdweb-dev/sdk/dist/declarations/src/evm/types/eips'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'

export class RewardRoutes {
  decimals: number
  contract: Erc20<BaseERC20>
  private _router: Router
  private _paid: Record<string, BigNumber> = {}

  get router (): Router {
    if (this._router == null) {
      this._router = Router()

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._router.post('/payout/:address', /* authorizeAPI, */async (req: Request, res: Response) => {
        try {
          if (this._paid[req.params.address].lte(0)) {
            res.status(403).send('payout forbidden; game not funded')
            return
          }

          if (req.body.amount > 0) {
            const percentage = this._paid[req.params.address].div(BigNumber.from(10).pow(this.decimals)).toNumber()
            const transferValue = req.body.amount * percentage * 0.01
            const receipt = (await this.contract.transfer(req.params.address, transferValue)).receipt
            res.json(receipt)
          } else { res.json('ok') }
          this._paid[req.params.address] = BigNumber.from(0)
        } catch (e: any) {
          console.error(e)
          res.status(500).send(e.message)
        }
      })
    }

    return this._router
  }

  constructor () {
    void this.init()
  }

  private async init (): Promise<void> {
    // throw somethign if needed
    if (this.contract === undefined && process.env.PRIVATE_KEY !== undefined) {
      const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, AuroraTestnet)
      const contractBase = await sdk.getContract('0x198543B8f9b83d2477F1eD897834D6890f98e6f1')
      contractBase.events.addEventListener('Transfer', this.onTransfer.bind(this))
      this.contract = contractBase.erc20
      this.decimals = (await this.contract.get()).decimals
    }
  }

  onTransfer (event: ContractEvent): void {
    if (event.data.to === process.env.PUBLIC_KEY) {
      this._paid[event.data.from] = event.data.value
    }
  }
}
