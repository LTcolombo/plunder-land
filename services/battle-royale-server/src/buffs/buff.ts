import { type GameObject } from '../objects/gameobject'

export default class Buff {
  endTime: number
  target: GameObject

  constructor (target: GameObject, lifetime: number) {
    this.endTime = Date.now() + lifetime
    this.target = target
    this.start()
  }

  start () {

  }

  update (dt: number) {
    if (this.endTime && Date.now() > this.endTime) {
      this.stop()
      return true
    }
    return false
  }

  stop () {

  }
}
