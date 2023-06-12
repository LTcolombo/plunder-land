import { type Socket } from 'socket.io'
import { type GameObject, ObjectType } from '../objects/gameobject'
import { type Unit } from '../objects/unit'
import type Player from '../objects/player'
import World from '../objects/world'

class Connection {
  socket: Socket
  player: Player | undefined
  pendingObjectIDs: { number: boolean } | {}

  get id () {
    return this.socket?.id
  }
}

export default class Multiplayer {
  static order = ['create', 'update', 'effect', 'destroy']

  static Instance: Multiplayer
  private readonly _connections: Connection[]
  private _buffer: {}

  constructor () {
    Multiplayer.Instance = this
    this._connections = []
    this._buffer = {}
  }

  onConnect (socket: Socket) {
    const connection = new Connection()
    connection.socket = socket

    socket.on('start_requested', () => {
      this.onStart(connection)
    })
    this._connections.push(connection)
  }

  // incoming traffic ========
  onStart (connection: Connection) {
    connection.socket.on('pointer', (data) => {
      this.onPointer(connection, data)
    })
    connection.socket.on('skill', (data) => {
      this.onSkill(connection, data)
    })

    const player = World.createPlayer()
    console.log(JSON.stringify(connection.socket.handshake.query))

    player.maxVelocity = 180

    connection.player = player

    this._buffer[connection.id] = { create: [], create_own: [] }

    for (const obj of World.OBSTACLES.concat(
      World.CONSUMABLES.concat(World.PLAYERS).concat(World.MOBS)
    )) {
      if (obj) {
        this._buffer[connection.id][
          connection.player === obj ? 'create_own' : 'create'
        ].push(obj.serialiseBinary(obj.allFields))
      }
    }

    this.flush(connection)
  }

  flush (connection: Connection) {
    if (!this._buffer[connection.id]) return

    if (connection.player == null) return

    for (const event in this._buffer[connection.id]) {
      connection.socket.emit(event, this._buffer[connection.id][event])
    }
    this._buffer[connection.id] = null

    if (connection.player.destroyed) connection.player = undefined
  }

  onPointer (connection: Connection, data) {
    if (connection.player != null) {
      connection.player.setDirection(data.x, data.y)
    }
  }

  onSkill (connection: Connection, data) {
    if (connection.player != null) {
      connection.player.tryExecuteSkill(data)
    }
  }

  // outgoing traffic ========
  create (obj: GameObject) {
    const data = obj.serialiseBinary(obj.allFields)
    for (const connection of this._connections) {
      if (!this._buffer[connection.id]) this._buffer[connection.id] = {}
      if (!this._buffer[connection.id].create) { this._buffer[connection.id].create = [] }

      this._buffer[connection.id].create.push(data)
    }
    obj.dirtyFields.clear()
  }

  update (obj: GameObject) {
    let fullData
    let changedData
    let data

    for (const connection of this._connections) {
      if (
        (connection.player != null) &&
        connection.player.tag === obj.tag &&
        connection.player.position.withinBounds(
          obj.position.x,
          obj.position.y,
          500
        )
      ) {
        if (obj.type === ObjectType.Player && !obj.dirtyFields.has('id'))
        // update nearby players even if they dont do anything
        { obj.dirtyFields.add('id') }

        if (connection.pendingObjectIDs?.[obj.id]) {
          if (fullData == null) {
            fullData = obj.serialiseBinary(
              connection.player === obj ? obj.allFieldsOwn : obj.allFields
            )
          }
          data = fullData
          connection.pendingObjectIDs[obj.id] = undefined
        } else {
          if (changedData == null) changedData = obj.serialiseBinary(obj.dirtyFields)
          data = changedData
        }

        if (data == null) continue

        if (!this._buffer[connection.id]) this._buffer[connection.id] = {}
        if (!this._buffer[connection.id].update) { this._buffer[connection.id].update = [] }

        this._buffer[connection.id].update.push(data)
      } else {
        if (obj.dirtyFields.size) {
          if (!connection.pendingObjectIDs) connection.pendingObjectIDs = {}
          connection.pendingObjectIDs[obj.id] = true
        }
      }
    }
    obj.dirtyFields.clear()
  }

  effect (type: number, originator: Unit, lifetime: number) {
    const data = Buffer.alloc(4)
    data.writeInt8(type)
    data.writeUInt16BE(originator.id, 1)
    data.writeInt8(Math.floor(lifetime / 100), 3)

    for (const connection of this._connections) {
      if (
        connection.player?.position.withinBounds(
          originator.position.x,
          originator.position.y,
          500
        )
      ) {
        if (!this._buffer[connection.id]) this._buffer[connection.id] = {}
        if (!this._buffer[connection.id].effect) { this._buffer[connection.id].effect = [] }

        this._buffer[connection.id].effect.push(data)
      }
    }
  }

  destroy (obj) {
    const data = obj.serialiseBinary(obj.dirtyFields)
    for (const connection of this._connections) {
      if (!this._buffer[connection.id]) this._buffer[connection.id] = {}
      if (!this._buffer[connection.id].destroy) { this._buffer[connection.id].destroy = [] }

      this._buffer[connection.id].destroy.push(data)

      if (connection.player === obj) {
        const stats = obj.stats
        stats.games = 1
        stats.lifeTime = Math.ceil((Date.now() - obj.createdAt) / 1000)
      }
    }
    obj.dirtyFields.clear()
  }

  flushAll () {
    for (const connection of this._connections) this.flush(connection)
  }

  onDisconnect (connection: Connection) {
    if (connection.player != null) connection.player.destroy()
    this._connections.splice(this._connections.indexOf(connection), 1)
  }
}
