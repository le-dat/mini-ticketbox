interface Props {
  userId: string;
  onChange: (userId: string) => void;
}

export const UserIdentityInput = ({ userId, onChange }: Props) => {
  return (
    <div className="bento-card flex flex-col gap-3">
      <label className="text-xs font-semibold text-brand-primary uppercase tracking-wider font-display">
        Thông tin người đặt vé
      </label>
      <div className="relative">
        <input
          type="text"
          value={userId}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập User ID (VD: verno, payment_user...)"
          className="w-full bg-[#0a0a0a]/85 border border-border-default rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-primary transition-colors font-mono"
        />
        <span className="absolute right-3 top-4 text-[10px] text-slate-600 uppercase font-bold tracking-wider">
          User ID
        </span>
      </div>
    </div>
  );
};
