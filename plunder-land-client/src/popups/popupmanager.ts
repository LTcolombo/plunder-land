import { Container } from 'pixi.js'

export class PopupManager extends Container {
  queue: Container[] = []

  show (value: Container): void {
    this.addChild(value)
    this.queue.push(value)

    value.x = window.innerWidth / 2
    value.y = window.innerHeight / 2

    value.on('close', this.hide.bind(this, value))

    this.updateVisibility()
  }

  hide (value: Container): void {
    this.removeChild(value)
    this.queue.splice(this.queue.indexOf(value))

    this.updateVisibility()
  }

  updateVisibility (): void {
    for (let i = 0; i < this.queue.length; i++) {
      this.queue[i].visible = i === this.queue.length - 1
    }
  }
}
