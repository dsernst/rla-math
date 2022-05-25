import { BigDecimal } from './BigDecimal.ts'

function rla_confidence(
  total_votes: number,
  margin_of_error: number,
  num_checked: number
): number {
  const [total, margin, checked] = [
    total_votes,
    margin_of_error,
    num_checked,
  ].map(BigInt)
  return 1 - NchooseR(total - margin, checked).divide(NchooseR(total, checked))
}

// Equivalent to COMBIN function from gSheets
function NchooseR(N: bigint, R: bigint): BigDecimal {
  let numerator = 1n
  let denom = 1n
  for (let i = 0n; i < R; i++) {
    numerator *= N - i
    denom *= R - i
  }
  return new BigDecimal(numerator).divide(denom)
}

// const toy_votes = 15
// const toy_margin = 3

const georgia_votes = 4_999_958
const georgia_margin = 5_889

const cases = [
  //   [toy_votes, toy_margin, 1], // Correct: 20.0%
  //   [toy_votes, toy_margin, 8], // Correct: 92.31%
  //   [toy_votes, toy_margin, 12], // Correct: 99.78%
  [georgia_votes, georgia_margin, 1], // Correct: 0.12%
  [georgia_votes, georgia_margin, 10], // Correct: 1.17%
  [georgia_votes, georgia_margin, 100], // 11.12%
  [georgia_votes, georgia_margin, 1000], // 69.23%
  [georgia_votes, georgia_margin, 5000], // 99.7248%
  [georgia_votes, georgia_margin, 7500], // 99.9856%
  [georgia_votes, georgia_margin, 10000], // 99.9992%
]

cases.map(([t, m, c]) =>
  console.log([t, m, c], `${(rla_confidence(t, m, c) * 100).toFixed(4)}%`)
)
