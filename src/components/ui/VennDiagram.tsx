import type { Persona } from '../../types'

interface Props {
  personas: Persona[]
  ux: number
  uy: number
  sims: number[]
}

const LABEL_OFFSETS = [
  { dx: 0, dy: -8 },
  { dx: 0, dy: -8 },
  { dx: 0, dy: -8 },
  { dx: 0, dy: -8 },
  { dx: 0, dy: -8 },
]
const ANCHORS = ['middle', 'middle', 'middle', 'middle', 'middle'] as const

export default function VennDiagram({ personas, ux, uy, sims }: Props) {
  const R = 90
  const maxSim = Math.max(...sims)

  return (
    <svg viewBox="0 0 500 370" xmlns="http://www.w3.org/2000/svg">
      {personas.map((p, i) => {
        const op = (0.12 + sims[i] * 0.18).toFixed(2)
        const strokeOp = (0.3 + sims[i] * 0.5).toFixed(2)
        return (
          <g key={p.id}>
            <circle cx={p.px} cy={p.py} r={R} fill={p.col} opacity={op} />
            <circle cx={p.px} cy={p.py} r={R} fill="none" stroke={p.col}
              strokeWidth={sims[i] === maxSim ? 2 : 1} opacity={strokeOp} />
          </g>
        )
      })}

      {personas.map((p, i) => {
        const off = LABEL_OFFSETS[i]
        const lx = p.px + off.dx
        const ly = p.py + off.dy
        const isTop = sims[i] === maxSim
        const col = isTop ? p.col : 'var(--tx2)'
        return (
          <g key={`lbl-${p.id}`}>
            <text x={lx} y={ly} textAnchor={ANCHORS[i]} fontSize={11}
              fontWeight={isTop ? 600 : 400} fill={col} fontFamily="sans-serif">
              {p.icon} {p.name}
            </text>
            <text x={lx} y={ly + 13} textAnchor={ANCHORS[i]} fontSize={9}
              fill="var(--tx3)" fontFamily="sans-serif">
              {p.keys}
            </text>
          </g>
        )
      })}

      <circle cx={ux.toFixed(1)} cy={uy.toFixed(1)} r={16}
        fill="none" stroke="#1D9E75" strokeWidth={2} opacity={0.4} />
      <circle cx={ux.toFixed(1)} cy={uy.toFixed(1)} r={8} fill="#1D9E75" />
      <text x={(ux + 20).toFixed(1)} y={(uy + 4).toFixed(1)}
        fontSize={11} fontWeight={600} fill="#0F6E56" fontFamily="sans-serif">
        you
      </text>
    </svg>
  )
}
