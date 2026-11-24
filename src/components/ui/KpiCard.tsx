import React from 'react';

export type KpiTint = 'blue' | 'green' | 'amber';

interface KpiCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly subtitle?: string;
  readonly badge?: string;
  readonly tint: KpiTint;
  readonly icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  tint,
  icon,
}) => {
  const tintStyles: Record<
    KpiTint,
    { readonly container: string; readonly badge: string; readonly iconBg: string }
  > = {
    blue: {
      container: 'bg-blue-50/70 border-blue-200/80 text-blue-950',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    green: {
      container: 'bg-[#E8F5EE] border-[#B7E4C7] text-[#1E6B43]',
      badge: 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]',
      iconBg: 'bg-[#D8F3DC] text-[#1E6B43]',
    },
    amber: {
      container: 'bg-amber-50/80 border-amber-200 text-amber-950',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      iconBg: 'bg-amber-100 text-amber-700',
    },
  };

  const current = tintStyles[tint];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${current.container}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium opacity-80">{title}</p>
        {icon && <div className={`rounded-xl p-2.5 ${current.iconBg}`}>{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-3xl font-extrabold tracking-tight tabular-nums">{value}</span>
        {badge && (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${current.badge}`}
          >
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs opacity-75">{subtitle}</p>}
    </div>
  );
};
