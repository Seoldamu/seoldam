import { css } from 'styled-components'

const fontGenerator = (
  weight: number,
  size: number,
  lineHeight: number,
  letterSpacing: number
) => css`
  font-family: 'Paperlogy';
  font-weight: ${weight};
  font-size: ${size}px;
  line-height: ${lineHeight}%;
  letter-spacing: ${letterSpacing}%;
`

const font = {
  H1: fontGenerator(600, 16, 140, 1),
  H2: fontGenerator(700, 12, 140, 1),

  L1: fontGenerator(500, 16, 140, 1),
  L2: fontGenerator(500, 14, 140, 1),
  L3: fontGenerator(700, 13, 140, 1),
  L4: fontGenerator(400, 12, 140, 1),

  T1: fontGenerator(700, 30, 120, -1),
  T2: fontGenerator(700, 24, 120, 1),
  T3: fontGenerator(700, 20, 140, -1),
  T4: fontGenerator(700, 18, 120, 1),

  B1: fontGenerator(400, 16, 160, 1),
  B2: fontGenerator(400, 14, 140, 1),
  B3: fontGenerator(400, 12, 140, 1),

  C1: fontGenerator(400, 8, 140, 0)
}

export default font
