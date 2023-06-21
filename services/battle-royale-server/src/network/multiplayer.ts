import { type Socket } from 'socket.io'
import { type GameObject, ObjectType } from '../objects/gameobject'
import { type Unit } from '../objects/unit'
import type Player from '../objects/player'
import World from '../objects/world'
import axios from 'axios'

class Connection {
  socket: Socket
  player: Player | undefined
  pendingObjectIDs: Record<string, boolean> | undefined

  get id (): string {
    return this.socket?.id
  }
}

export default class Multiplayer {
  static order = ['create', 'update', 'effect', 'destroy']

  static Instance: Multiplayer
  private readonly _connections: Connection[]
  private _buffer: Record<string, { create: Buffer[], create_own: Buffer[], effect: Buffer[], update: Buffer[], destroy: Buffer[] }>

  constructor () {
    Multiplayer.Instance = this
    this._connections = []
    this._buffer = {}
  }

  onConnect (socket: Socket): void {
    const connection = new Connection()
    connection.socket = socket

    socket.on('start_requested', (address) => {
      void this.onStart(connection, address)
    })
    this._connections.push(connection)
  }

  // incoming traffic ========
  async onStart (connection: Connection, address: string): Promise<void> {
    connection.socket.on('pointer', (data) => {
      this.onPointer(connection, data)
    })
    connection.socket.on('skill', (data) => {
      this.onSkill(connection, data)
    })

    const player = World.createPlayer()

    const response = await axios.get(`http://localhost:8001/gear/equipment/${address}`)
    if (response.status === 200) {
      player.setGear(response.data)
    }

    connection.player = player
    console.log('player', player)

    this._buffer[connection.id] = { create: [], create_own: [], effect: [], update: [], destroy: [] }

    for (const obj of World.OBSTACLES.concat(
      World.CONSUMABLES.concat(World.PLAYERS).concat(World.MOBS)
    )) {
      if (obj !== undefined) {
        if (connection.player === obj) {
          this._buffer[connection.id].create_own.push(obj.serialiseBinary(obj.allFields))
        } else {
          this._buffer[connection.id].create.push(obj.serialiseBinary(obj.allFields))
        }
      }
    }

    this.flush(connection)
  }

  flush (connection: Connection): void {
    if (this._buffer[connection.id] === undefined) return

    if (connection.player == null) return

    for (const event in this._buffer[connection.id]) {
      connection.socket.emit(event, this._buffer[connection.id][event])
    }
    this._buffer[connection.id] = undefined

    if (connection.player.destroyed) connection.player = undefined
  }

  onPointer (connection: Connection, data): void {
    if (connection.player != null) {
      connection.player.setDirection(data.x, data.y)
    }
  }

  onSkill (connection: Connection, data): void {
    if (connection.player != null) {
      connection.player.tryExecuteSkill(data)
    }
  }

  // outgoing traffic ========
  create (obj: GameObject): void {
    const data = obj.serialiseBinary(obj.allFields)
    for (const connection of this._connections) {
      if (this._buffer[connection.id] === undefined) this._buffer[connection.id] = { create: [], create_own: [], effect: [], update: [], destroy: [] }

      this._buffer[connection.id].create.push(data)
    }
    obj.dirtyFields.clear()
  }

  update (obj: GameObject): void {
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
        // update nearby players even if they dont do anything
        if (obj.type === ObjectType.Player && !obj.dirtyFields.has('id')) {
          obj.dirtyFields.add('id')
        }

        if (connection.pendingObjectIDs?.[obj.id]) {
          if (fullData == null) {
            fullData = obj.serialiseBinary(
              connection.player === obj ? obj.allFieldsOwn : obj.allFields
            )
          }
          data = fullData
          connection.pendingObjectIDs[obj.id] = false
        } else {
          if (changedData == null) changedData = obj.serialiseBinary(obj.dirtyFields)
          data = changedData
        }

        if (data == null) continue

        if (this._buffer[connection.id] === undefined) { this._buffer[connection.id] = { create: [], create_own: [], effect: [], update: [], destroy: [] } }

        this._buffer[connection.id].update.push(data)
      } else {
        if (obj.dirtyFields.size > 0) {
          if (connection.pendingObjectIDs === undefined) {
            connection.pendingObjectIDs = {}
            connection.pendingObjectIDs[obj.id] = true
          }
        }
      }
    }
    obj.dirtyFields.clear()
  }

  effect (type: number, originator: Unit, lifetime: number): void {
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
        if (this._buffer[connection.id] === undefined) this._buffer[connection.id] = { create: [], create_own: [], effect: [], update: [], destroy: [] }

        this._buffer[connection.id].effect.push(data)
      }
    }
  }

  destroy (obj): void {
    const data = obj.serialiseBinary(obj.dirtyFields)
    for (const connection of this._connections) {
      if (this._buffer[connection.id] === undefined) this._buffer[connection.id] = { create: [], create_own: [], effect: [], update: [], destroy: [] }
      this._buffer[connection.id].destroy.push(data)

      if (connection.player === obj) {
        const stats = obj.stats
        stats.games = 1
        stats.lifeTime = Math.ceil((Date.now() - obj.createdAt) / 1000)
      }
    }
    obj.dirtyFields.clear()
  }

  flushAll (): void {
    for (const connection of this._connections) this.flush(connection)
  }

  onDisconnect (connection: Connection): void {
    if (connection.player != null) connection.player.destroy()
    this._connections.splice(this._connections.indexOf(connection), 1)
  }
}
