import { useEffect, useState } from 'react';
import type { AdminStats } from '../../types';

interface Props {
  adminStats: AdminStats | null;
  isAdminLoading: boolean;
  onRefresh: () => void;
}

export const AdminTicketsTable = ({
  adminStats,
  isAdminLoading,
  onRefresh,
}: Props) => {
  // Force a re-render every second to update countdowns smoothly
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bento-card">
      <div className="flex justify-between items-center pb-4 border-b border-border-default mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-200 font-display">
            Danh sách vé đang giữ chỗ
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Thời gian thực tế giải phóng vé trên server
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 rounded-full text-xs font-semibold text-brand-primary cursor-pointer active:scale-95 transition-all"
        >
          Tải Lại 🔄
        </button>
      </div>

      {isAdminLoading && !adminStats && (
        <div className="text-center text-slate-500 text-sm py-12">Đang tải dữ liệu...</div>
      )}

      {adminStats && adminStats.heldTickets.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-12">
          Không có vé nào đang ở trạng thái HELD.
        </div>
      ) : adminStats ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-border-default/40">
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Mã vé</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Loại vé</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Khách giữ</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] text-right">
                  Hết hạn sau
                </th>
              </tr>
            </thead>
            <tbody>
              {adminStats.heldTickets.map((ticket) => {
                const secondsLeft = Math.max(
                  0,
                  Math.floor(
                    (new Date(ticket.hold_expires_at).getTime() - Date.now()) / 1000,
                  ),
                );
                const minutes = Math.floor(secondsLeft / 60);
                const seconds = secondsLeft % 60;

                return (
                  <tr
                    key={ticket.id}
                    className="border-b border-border-default/20 hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-4 font-mono text-brand-primary font-semibold">
                      #TKT-{ticket.id}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ticket.ticket_type_id === 2
                            ? 'bg-brand-secondary/15 text-brand-secondary'
                            : 'bg-brand-primary/15 text-brand-primary'
                        }`}
                      >
                        {ticket.ticket_type_id === 2 ? 'VIP' : 'Regular'}
                      </span>
                    </td>
                    <td className="py-4 text-slate-300 font-mono">{ticket.user_id}</td>
                    <td className="py-4 text-right font-mono text-slate-300">
                      {secondsLeft <= 0 ? (
                        <span className="text-brand-danger">Đang giải phóng...</span>
                      ) : (
                        `${minutes.toString().padStart(2, '0')}:${seconds
                          .toString()
                          .padStart(2, '0')}`
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};
