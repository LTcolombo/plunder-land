import { Router, type Request, type Response } from 'express'
import Redis from 'ioredis'

export class StatsRoutes {
  private _router: Router
  redis: Redis

  constructor () {
    this.redis = new Redis(parseInt(process.env.REDIS_PORT ?? '6379'), process.env.REDIS_HOST ?? 'redis')
  }

  get router (): Router {
    if (this._router == null) {
      this._router = Router()

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._router.get('/', async (req: Request, res: Response) => {
        try {
          const keys = await this.redis.keys('stats-*')

          const data = {}
          for (const key of keys) {
            data[key] = await this.redis.hgetall(key)
          }

          res.json(data)
        } catch (e: any) {
          console.error(e)
          res.status(500).send(e.message)
        }
      })
    }

    return this._router
  }
}
