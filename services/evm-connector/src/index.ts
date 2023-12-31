import { config } from 'dotenv'
import express from 'express'
import { LootRoutes } from './routes/loot.routes'
import { GearRoutes } from './routes/gear.routes'
import cors from 'cors'
import { RewardRoutes } from './routes/reward.routes'
import { StatsRoutes } from './routes/stats.routes'

config()

const app = express()
const PORT = 8001

app.use(cors())
app.use(express.json())

// Now we add the auth router to our app to set up the necessary auth routes
app.use('/loot', new LootRoutes().router)
app.use('/gear', new GearRoutes().router)
app.use('/rewards', new RewardRoutes().router)
app.use('/stats', new StatsRoutes().router)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
