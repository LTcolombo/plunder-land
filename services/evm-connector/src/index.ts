import { config } from 'dotenv'
import express from 'express'
import { LootRoutes } from './routes/loot.routes'
import { GearRoutes } from './routes/gear.routes'

config()

const app = express()
const PORT = 8001

// Now we add the auth router to our app to set up the necessary auth routes
app.use('/loot', new LootRoutes().router)
app.use('/gear', new GearRoutes().router)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
