interface Props {
  ticketTypeId: number;
  typeName: string;
  price: number;
  description: string;
  totalTickets: number;
  isWsConnected: boolean;
  isStale: boolean;
  count: number;
  isHolding: boolean;
  onHold: (ticketTypeId: number, price: number, typeName: string) => void;
}

export const TicketCard = ({
  ticketTypeId,
  typeName,
  price,
  description,
  totalTickets,
  isWsConnected,
  isStale,
  count,
  isHolding,
  onHold,
}: Props) => {
  const isVip = ticketTypeId === 2;

  // Render card style based on VIP status
  const cardClass = isVip
    ? 'bento-card bento-card-interactive bento-card-vip flex flex-col justify-between gap-6 relative group'
    : 'bento-card bento-card-interactive flex flex-col justify-between gap-6 relative group';

  const badgeClass = isVip
    ? 'absolute top-4 right-4 flex items-center justify-center bg-brand-secondary/10 border border-brand-secondary/20 p-1 rounded-full text-brand-secondary'
    : 'absolute top-4 right-4 flex items-center justify-center bg-brand-primary/10 border border-brand-primary/20 p-1 rounded-full text-brand-primary';

  const pingColorClass = isWsConnected
    ? (isVip ? 'bg-brand-secondary animate-ping' : 'bg-brand-primary animate-ping')
    : 'bg-brand-warning';

  const titleClass = isVip
    ? 'text-xl font-bold text-slate-100 group-hover:text-brand-secondary transition-colors font-display'
    : 'text-xl font-bold text-slate-100 group-hover:text-brand-primary transition-colors font-display';

  const priceColorClass = isVip ? 'text-brand-secondary' : 'text-brand-primary';

  return (
    <div className={cardClass}>
      <div
        className={badgeClass}
        title={isWsConnected ? 'Đang đồng bộ' : 'Tự động cập nhật định kỳ'}
      >
        <span className={`w-2 h-2 rounded-full ${pingColorClass}`} />
      </div>

      <div>
        <h3 className={titleClass}>
          Vé {typeName}
          {isVip && '👑'}
        </h3>
        <p className="text-slate-400 text-xs mt-1">{description}</p>
        <div className={`mt-4 text-2xl font-black ${priceColorClass} font-display`}>
          {price.toLocaleString('vi-VN')}đ
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center bg-[#0a0a0a]/50 px-4 py-2.5 rounded-xl border border-border-default text-xs font-mono">
          <span className="text-slate-500">Còn lại:</span>
          <span className="font-extrabold text-slate-200 text-sm">
            {count} / {totalTickets} vé
          </span>
        </div>

        <button
          id={`hold-ticket-btn-${ticketTypeId}`}
          disabled={isHolding || count === 0 || isStale}
          title={isStale ? 'Đang mất kết nối — vui lòng chờ kết nối lại' : undefined}
          onClick={() => onHold(ticketTypeId, price, typeName)}
          className={`w-full py-3.5 rounded-full font-bold cursor-pointer transition-all duration-200 active:scale-98 text-xs uppercase tracking-wider ${
            count === 0 || isStale
              ? 'bg-slate-900 text-slate-600 border border-border-default cursor-not-allowed'
              : isVip
              ? 'btn-brand-secondary btn-glint'
              : 'btn-brand-primary btn-glint'
          }`}
        >
          {isStale ? '⚠ Mất kết nối' : count === 0 ? 'Hết vé' : isHolding ? 'Đang giữ vé...' : `Đặt Vé ${typeName}`}
        </button>
      </div>
    </div>
  );
};
