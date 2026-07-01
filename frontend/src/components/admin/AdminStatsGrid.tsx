import type { ReactNode } from 'react';
import type { AdminStats } from '../../types';

interface StatItem {
  key: string;
  label: string;
  icon: string;
  colorClass: string;
  getValue: (stats: { revenue: string; sold: number; held: number }) => ReactNode;
}

const STATS_CONFIG: StatItem[] = [
  {
    key: 'revenue',
    label: 'Doanh Thu',
    icon: '💰',
    colorClass: 'text-brand-primary',
    getValue: ({ revenue }) => `${revenue} đ`,
  },
  {
    key: 'sold',
    label: 'Đã Bán',
    icon: '🎫',
    colorClass: 'text-slate-100',
    getValue: ({ sold }) => (
      <>
        {sold} <span className="text-xs text-slate-500 font-normal font-sans">/ 500</span>
      </>
    ),
  },
  {
    key: 'held',
    label: 'Đang Giữ Chỗ',
    icon: '⏳',
    colorClass: 'text-brand-warning',
    getValue: ({ held }) => held,
  },
];

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: string;
  colorClass: string;
}

const StatCard = ({ label, value, icon, colorClass }: StatCardProps) => (
  <div className="bento-card gap-2 flex flex-col relative overflow-hidden">
    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-display">
      {label}
    </span>
    <span className={`text-3xl font-black mt-1 font-display ${colorClass}`}>
      {value}
    </span>
    <div className="absolute right-4 bottom-4 text-2xl opacity-50">{icon}</div>
  </div>
);

interface Props {
  adminStats: AdminStats | null;
}

export const AdminStatsGrid = ({ adminStats }: Props) => {
  const revenue = adminStats ? Number(adminStats.total_revenue).toLocaleString('vi-VN') : '0';
  const sold = adminStats ? adminStats.total_sold : 0;
  const held = adminStats ? adminStats.total_held : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {STATS_CONFIG.map((cfg) => (
        <StatCard
          key={cfg.key}
          label={cfg.label}
          value={cfg.getValue({ revenue, sold, held })}
          icon={cfg.icon}
          colorClass={cfg.colorClass}
        />
      ))}
    </div>
  );
};

