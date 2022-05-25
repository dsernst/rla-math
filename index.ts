// COMBIN($C$3 - $B$7, E3) / COMBIN($C$3, E3)
// total_votes: $C$3
// margin_of_error: $B$7
// num_checked: E3
function rla_confidence(
  total_votes: bigint,
  margin_of_error: bigint,
  num_checked: bigint
): number {
  return (
    1 -
    NchooseR(total_votes - margin_of_error, num_checked) /
      NchooseR(total_votes, num_checked)
  )
}

// re-implementing COMBIN function
function NchooseR(N: bigint, R: bigint): number {
  var numerator = 1n
  var denom = 1n
  for (var i = 0n; i < R; i++) {
    numerator *= N - i
    denom *= R - i
  }
  console.log(numerator / denom)
  return Number(numerator / denom)
}

const toy_votes = 15
const toy_margin = 3

const georgia_votes = 4_999_958
const georgia_margin = 5_889

const cases = [
  //   [toy_votes, toy_margin, 1], // Correct
  //   [toy_votes, toy_margin, 8], // Correct
  //   [toy_votes, toy_margin, 12], // Correct
  [georgia_votes, georgia_margin, 1], // Correct
  [georgia_votes, georgia_margin, 10], // Correct
  [georgia_votes, georgia_margin, 100], // fails: NaN
  [georgia_votes, georgia_margin, 1000], // fails: NaN
]

cases
  .map((c) => c.map(BigInt))
  .map(([t, m, c]) =>
    console.log(
      [t, m, c].map(Number),
      `${(rla_confidence(t, m, c) * 100).toFixed(2)}%`
    )
  )
