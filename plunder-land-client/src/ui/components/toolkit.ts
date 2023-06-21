import { Point, type Texture, type Resource, ObservablePoint, Sprite, Text } from 'pixi.js'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ToolKit {
  static CENTER_ANCHOR = new ObservablePoint(() => { }, 0, 0.5, 0.5)
  static TOP_LEFT_ANCHOR = new ObservablePoint(() => { }, 0, 0, 0)

  static createText (text: string, pos: Point = new Point(0, 0), fontSize = 24): Text {
    const result = new Text(text, { fill: '0xA39171', fontFamily: 'Lilliput Steps', fontSize })
    result.anchor = ToolKit.CENTER_ANCHOR

    result.position = pos
    return result
  }

  static createSprite (tex: Texture<Resource>, pos: Point = new Point(0, 0), scale: Point = new Point(1, 1), anchor: ObservablePoint = ToolKit.CENTER_ANCHOR): any {
    const result = new Sprite(tex)
    result.scale = scale
    result.position = pos
    result.anchor = anchor

    return result
  }
}
