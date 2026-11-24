import React from 'react';
import type { DailyEarningBar } from '../../types/parkease';
import { formatInr } from '../../utils/geo';

interface DailyEarningsBarChartProps {
  readonly data: readonly DailyEarningBar[];
  readonly height?: number;
}

export const DailyEarningsBarChart: React.FC<DailyEarningsBarChartProps> = ({
  data,
  height = 200,
}) => {
  if (data.length === 0) return null;

  const width = 450;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map((d) => d.amount), 2000);
  const barWidth = 44;
  const slotWidth = chartWidth / data.length;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E6B43" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>

        {/* Base axis */}
        <line
          x1={paddingLeft - 10}
          y1={paddingTop + chartHeight}
          x2={width - paddingRight + 10}
          y2={paddingTop + chartHeight}
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {data.map((item, index) => {
          const centerX = paddingLeft + index * slotWidth + slotWidth / 2;
          const barHeight = (item.amount / maxVal) * chartHeight;
          const barY = paddingTop + chartHeight - barHeight;
          const barX = centerX - barWidth / 2;

          return (
            <g key={item.label} className="group cursor-pointer">
              {/* Amount Label on top of bar */}
              <text
                x={centerX}
                y={barY - 8}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#1E6B43"
                className="tabular-nums"
              >
                {formatInr(item.amount)}
              </text>

              {/* Vertical Bar */}
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx="6"
                fill="url(#barGrad)"
                className="transition-all duration-200 group-hover:opacity-90"
              />

              {/* Date / Day Label */}
              <text
                x={centerX}
                y={height - 10}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#475569"
              >
                {item.label}
              </text>

              <title>{`${item.label}: ${formatInr(item.amount)}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
