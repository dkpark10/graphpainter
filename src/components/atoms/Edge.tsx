import { useArrowStore } from '@/store';

interface EdgeProps {
  from: number[];
  to: number[];
  cost: string;
  color: string;
}

const calculCostCoord = (from: number[], to: number[]) => {
  const maxY = Math.max(from[0], to[0]);
  const maxX = Math.max(from[1], to[1]);
  const minY = Math.min(from[0], to[0]);
  const minX = Math.min(from[1], to[1]);

  // cost 위치 미세조정
  let gap = 0;
  if (to[0] > from[0] && to[1] > from[1]) gap += 15;
  else if (to[0] < from[0] && to[1] < from[1]) gap += 12;

  return [(maxY - minY) / 2 + minY - gap, (maxX - minX) / 2 + minX + gap];
};

export default function Edge({ from, to, cost, color }: EdgeProps) {
  const isArrow = useArrowStore((state) => state.isArrow);

  const [fromY, fromX] = from;
  const [toY, toX] = to;
  const [costY, costX] = calculCostCoord(from, to);

  return (
    <g>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="24"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#020617" />
        </marker>
      </defs>
      <path
        d={`M ${fromY} ${fromX} L ${toY} ${toX}`}
        strokeWidth="2"
        stroke={color}
        markerEnd={isArrow === true ? 'url(#arrow)' : ''}
      />
      <text
        className="pointer-events-none"
        y={costX}
        x={costY}
        dx=".3em"
        dy=".9em"
        fontSize="14"
        fill={color}
        textAnchor="right"
      >
        {cost}
      </text>
    </g>
  );
}
