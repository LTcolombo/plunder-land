import Now from 'performance-now'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
import Multiplayer from './network/multiplayer'
import World from './objects/world'
dotenv.config()

function startGame () {
  const httpserver = http.createServer((req, res) => {
    res.writeHead(req.method === 'GET' && req.url === '/healthcheck' ? 200 : 404)
    res.end()
  })
  httpserver.listen(process.env.PORT, () => {
    console.log(`listening to ${process.env.PORT}..`)
  })

  const server = new Server(httpserver, { cors: { origin: '*' } })

  const multiplayer = new Multiplayer()

  server.on('connection', function (socket) {
    multiplayer.onConnect(socket)

    socket.on('disconnect', function () {
      multiplayer.onDisconnect(socket)
    })
  })

  const world = new World(4000)

  const tickLengthMs = 1000 / 10

  // timestamp of each loop
  let previousTick = Date.now()
  // number of times gameLoop gets called
  let actualTicks = 0

  function gameLoop () {
    const now = Date.now()

    actualTicks++
    if (previousTick + tickLengthMs <= now) {
      const dt = (now - previousTick) / 1000
      previousTick = now

      const start = Now()
      world.update(dt)
      // console.log((Now() - start).toFixed(3), (process.memoryUsage().rss / 1024 / 1024).toFixed(3), (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(3), (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(3));
      multiplayer.flushAll()
      actualTicks = 0
    }

    if (Date.now() - previousTick < tickLengthMs - 16) {
      setTimeout(gameLoop)
    } else {
      setImmediate(gameLoop)
    }
  }

  gameLoop()
}

startGame()
