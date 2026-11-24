import React from 'react';
import type { MonthlyEarningPoint } from '../../types/parkease';
import { formatInr } from '../../utils/geo';

interface MonthlyLineChartProps {
  readonly data: readonly MonthlyEarningPoint[];
  readonly height?: number;
}

export const MonthlyLineChart: React.FC<MonthlyLineChartProps> = ({ data, height = 200 }) => {
  if (data.length === 0) return null;

  const width = 500;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const amounts = data.map((d) => d.amount);
  const minAmount = 0;
  const maxAmount = Math.max(...amounts, 5000);

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) =>
    paddingTop + chartHeight - ((val - minAmount) / (maxAmount - minAmount)) * chartHeight;

  // Build points for SVG path
  const points = data.map((d, i) => `${getX(i)},${getY(d.amount)}`).join(' ');

  // Build closed area path for nice gradient fill
  const firstX = getX(0);
  const lastX = getX(data.length - 1);
  const bottomY = paddingTop + chartHeight;
  const areaPath = `M ${firstX},${bottomY} L ${points} L ${lastX},${bottomY} Z`;

  // Horizontal guide lines
  const gridTicks = [0, 1500, 3000, 4500];

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E6B43" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1E6B43" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#94A3B8"
                className="tabular-nums"
              >
                ₹{tick}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#greenAreaGrad)" />

        {/* Green Line */}
        <polyline
          fill="none"
          stroke="#1E6B43"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points and labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.amount);
          return (
            <g key={d.month} className="group cursor-pointer">
              {/* Point circle */}
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="#FFFFFF"
                stroke="#1E6B43"
                strokeWidth="3"
                className="transition-transform group-hover:scale-125"
              />
              {/* Month label */}
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="12"
                fontWeight="500"
                fill="#64748B"
              >
                {d.month}
              </text>
              {/* Value hover badge */}
              <title>{`${d.month}: ${formatInr(d.amount)}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
