import type { AdminStats } from '../../types';

interface Props {
  adminStats: AdminStats | null;
}

export const AdminStatsGrid = ({ adminStats }: Props) => {
  const revenue = adminStats ? Number(adminStats.total_revenue).toLocaleString('vi-VN') : '0';
  const sold = adminStats ? adminStats.total_sold : 0;
  const held = adminStats ? adminStats.total_held : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bento-card relative overflow-hidden">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-display">
          Doanh Thu
        </span>
        <span className="text-3xl font-black text-brand-primary mt-1 font-display">
          {revenue} đ
        </span>
        <div className="absolute right-4 bottom-4 text-3xl opacity-50">💰</div>
      </div>

      <div className="bento-card relative overflow-hidden">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-display">
          Vé Đã Bán
        </span>
        <span className="text-3xl font-black text-slate-100 mt-1 font-display">
          {sold} <span className="text-xs text-slate-500 font-normal font-sans">/ 500</span>
        </span>
        <div className="absolute right-4 bottom-4 text-3xl opacity-50">🎫</div>
      </div>

      <div className="bento-card relative overflow-hidden">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-display">
          Vé Đang Giữ (HELD)
        </span>
        <span className="text-3xl font-black text-brand-warning mt-1 font-display">
          {held}
        </span>
        <div className="absolute right-4 bottom-4 text-3xl opacity-50">⏳</div>
      </div>
    </div>
  );
};
