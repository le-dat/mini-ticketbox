import { CountdownTimer } from '../CountdownTimer';
import type { HeldTicket } from '../../types';

interface Props {
  heldTicket: HeldTicket | null;
  isPaying: boolean;
  onPayment: () => void;
  onHoldTimeout: () => void;
}

export const CheckoutPanel = ({
  heldTicket,
  isPaying,
  onPayment,
  onHoldTimeout,
}: Props) => {
  return (
    <div className="bento-card flex flex-col gap-6 sticky top-8">
      <h3 className="text-lg font-bold text-slate-200 pb-3 border-b border-border-default font-display">
        Thông tin thanh toán
      </h3>

      {heldTicket ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 bg-[#0a0a0a]/80 p-4 rounded-2xl border border-border-default">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Loại vé giữ:</span>
              <span className="font-bold text-slate-200">{heldTicket.typeName}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-500">Mã vé giữ:</span>
              <span className="font-mono text-brand-primary">#TKT-{heldTicket.id}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-500">Khách hàng:</span>
              <span className="font-semibold text-slate-200 font-mono">{heldTicket.userId}</span>
            </div>
          </div>

          {/* Countdown clock */}
          <CountdownTimer expiresAt={heldTicket.expiresAt} onTimeout={onHoldTimeout} />

          <div className="flex justify-between items-center text-sm pt-2">
            <span className="text-slate-500">Thành tiền:</span>
            <span className="text-2xl font-black text-brand-primary font-display">
              {heldTicket.price.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <button
            disabled={isPaying}
            onClick={onPayment}
            className="w-full py-4 btn-brand-primary btn-glint text-xs uppercase tracking-wider font-extrabold rounded-full transition-all duration-200 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-2"
          >
            {isPaying ? (
              <>
                <span className="w-4 h-4 border-2 border-[#1A120D] border-t-transparent rounded-full animate-spin" />
                Đang thanh toán...
              </>
            ) : (
              'Xác nhận Thanh Toán'
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <span className="text-4xl">🛒</span>
          <p className="text-slate-400 text-sm max-w-[220px]">
            Bạn chưa chọn giữ vé nào. Hãy chọn loại vé mong muốn để giữ chỗ.
          </p>
        </div>
      )}
    </div>
  );
};
