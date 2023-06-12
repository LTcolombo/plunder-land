export class Random {
  static RangeInt (v1, v2) {
    return Math.floor(v1 + Math.random() * (v2 - v1))
  }

  static Chance (v) {
    return Math.random() < v
  }
}
