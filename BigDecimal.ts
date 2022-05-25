type AcceptableTypes = number | bigint | BigDecimal | string

// Adapted from https://stackoverflow.com/a/66939244/2348750
export class BigDecimal {
  // Configuration: constants
  static DECIMALS = 18 // number of decimals on all instances
  static ROUNDED = false // numbers are truncated (false) or rounded (true)
  static SHIFT = BigInt('1' + '0'.repeat(BigDecimal.DECIMALS)) // derived constant
  private _n!: bigint

  constructor(value: AcceptableTypes) {
    if (value instanceof BigDecimal) return value
    const [ints, decis] = String(value).split('.').concat('')
    this._n =
      BigInt(
        ints +
          decis.padEnd(BigDecimal.DECIMALS, '0').slice(0, BigDecimal.DECIMALS)
      ) + BigInt(BigDecimal.ROUNDED && decis[BigDecimal.DECIMALS] >= '5')
  }
  static fromBigInt(bigint: bigint) {
    return Object.assign(Object.create(BigDecimal.prototype), { _n: bigint })
  }
  add(num: AcceptableTypes) {
    return BigDecimal.fromBigInt(this._n + new BigDecimal(num)._n)
  }
  subtract(num: AcceptableTypes) {
    return BigDecimal.fromBigInt(this._n - new BigDecimal(num)._n)
  }
  static _divRound(dividend: bigint, divisor: bigint) {
    return BigDecimal.fromBigInt(
      dividend / divisor +
        (BigDecimal.ROUNDED ? ((dividend * 2n) / divisor) % 2n : 0n)
    )
  }
  multiply(num: AcceptableTypes) {
    return BigDecimal._divRound(
      this._n * new BigDecimal(num)._n,
      BigDecimal.SHIFT
    )
  }
  divide(num: AcceptableTypes) {
    return BigDecimal._divRound(
      this._n * BigDecimal.SHIFT,
      new BigDecimal(num)._n
    )
  }
  toString() {
    const s = this._n.toString().padStart(BigDecimal.DECIMALS + 1, '0')
    return (
      s.slice(0, -BigDecimal.DECIMALS) +
      '.' +
      s.slice(-BigDecimal.DECIMALS).replace(/\.?0+$/, '')
    )
  }
}

// Demo
// const a = new BigDecimal('123456789123456789876')
// const b = a.divide('10000000000000000000')
// const c = b.add('9.000000000000000004')
// console.log(b.toString())   // 12.345678912345678987
// console.log(c.toString())   // 21.345678912345678991

// loss of precision when converting to number:
// console.log(+c) // 21.34567891234568
