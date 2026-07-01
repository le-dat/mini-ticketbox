import type { Order } from '../../types';

interface Props {
  order: Order | null;
}

export const OrderSuccessPanel = ({ order }: Props) => {
  if (!order) return null;

  return (
    <div className="bg-brand-success/10 border border-brand-success/30 p-6 rounded-3xl flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-success/5 rounded-full blur-xl" />
      <div className="flex items-center gap-2.5 text-brand-success font-bold text-lg">
        ✨ Thanh toán thành công!
      </div>
      <p className="text-slate-400 text-xs">
        Mã đơn hàng của bạn đã được xác nhận thành công trên hệ thống.
      </p>
      <div className="bg-[#0a0a0a]/80 p-4 rounded-xl border border-border-default text-xs font-mono grid grid-cols-2 gap-2 text-slate-300">
        <div>Mã Đơn Hàng:</div>
        <div className="text-right text-brand-success">#ORD-{order.id}</div>
        <div>Mã Vé Vật Lý:</div>
        <div className="text-right">TKT-{order.ticket_id}</div>
        <div>Người Mua:</div>
        <div className="text-right text-slate-100">{order.user_id}</div>
        <div>Số Tiền:</div>
        <div className="text-right text-brand-success font-bold">
          {Number(order.amount).toLocaleString('vi-VN')} đ
        </div>
      </div>
    </div>
  );
};
