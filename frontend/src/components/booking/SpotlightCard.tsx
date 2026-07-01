export const SpotlightCard = () => {
  return (
    <div className="bento-card relative overflow-hidden">
      <div className="absolute top-0 right-0 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1A120D] bg-brand-primary rounded-bl-xl">
        Hot Event
      </div>
      <h2 className="text-3xl font-bold font-display text-slate-100 tracking-tight">
        SUMMER GLOW FEST 2026
      </h2>
      <p className="text-slate-400 text-xs mt-1 max-w-md">
        Sân vận động Quốc gia Mỹ Đình, Hà Nội. Trải nghiệm ngày hội âm nhạc lớn nhất mùa hè.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-300">
        <span className="flex items-center gap-1.5 bg-[#0a0a0a]/60 px-3.5 py-2 rounded-full border border-border-default font-mono">
          📅 15 Tháng 8, 2026
        </span>
        <span className="flex items-center gap-1.5 bg-[#0a0a0a]/60 px-3.5 py-2 rounded-full border border-border-default font-mono">
          ⏰ 19:00 - 23:00
        </span>
      </div>
    </div>
  );
};
