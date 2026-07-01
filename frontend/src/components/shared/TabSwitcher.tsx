interface Props {
  view: 'booking' | 'admin';
  onViewChange: (view: 'booking' | 'admin') => void;
}

export const TabSwitcher = ({ view, onViewChange }: Props) => {
  return (
    <div className="flex bg-slate-900/60 p-1 rounded-2xl border border-border-default backdrop-blur">
      <button
        onClick={() => onViewChange('booking')}
        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
          view === 'booking'
            ? 'bg-brand-primary text-[#1A120D] shadow-md font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        🎟️ Đặt Vé
      </button>
      <button
        onClick={() => onViewChange('admin')}
        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
          view === 'admin'
            ? 'bg-brand-primary text-[#1A120D] shadow-md font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        📊 Admin Panel
      </button>
    </div>
  );
};
