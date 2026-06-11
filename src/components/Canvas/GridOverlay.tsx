import { Line } from 'react-konva';

interface GridOverlayProps {
  plotWidth: number;
  plotDepth: number;
  pxPerFoot: number;
}

export function GridOverlay({ plotWidth, plotDepth, pxPerFoot }: GridOverlayProps) {
  const lines: React.ReactNode[] = [];
  const w = plotWidth * pxPerFoot;
  const h = plotDepth * pxPerFoot;

  for (let x = 0; x <= plotWidth; x++) {
    lines.push(
      <Line
        key={`v${x}`}
        points={[x * pxPerFoot, 0, x * pxPerFoot, h]}
        stroke={x % 5 === 0 ? '#94a3b8' : '#e2e8f0'}
        strokeWidth={x % 5 === 0 ? 0.8 : 0.5}
        listening={false}
      />
    );
  }

  for (let y = 0; y <= plotDepth; y++) {
    lines.push(
      <Line
        key={`h${y}`}
        points={[0, y * pxPerFoot, w, y * pxPerFoot]}
        stroke={y % 5 === 0 ? '#94a3b8' : '#e2e8f0'}
        strokeWidth={y % 5 === 0 ? 0.8 : 0.5}
        listening={false}
      />
    );
  }

  return <>{lines}</>;
}
