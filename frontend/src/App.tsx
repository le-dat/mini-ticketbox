import { useState } from 'react'

function App() {
  const [ticketCount, setTicketCount] = useState(1)
  const pricePerTicket = 1500000 // 1.5M VND

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Vé đang mở bán
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent mt-2">
            Mini Ticketbox
          </h1>
          <p className="text-slate-400 text-sm max-w-sm mt-1">
            Đặt vé concert âm nhạc lớn nhất mùa hè này. Nhanh chóng, an toàn và trực quan.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full" />

        {/* Concert Info */}
        <div className="flex flex-col gap-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-200 text-lg">Summer Glow Fest 2026</h3>
              <p className="text-slate-400 text-xs mt-1">Sân vận động Mỹ Đình, Hà Nội</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Giá vé</span>
              <span className="font-bold text-fuchsia-400 text-lg">1.500.000đ</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800/40">
            <div>📅 15 Tháng 8, 2026</div>
            <div>⏰ 19:00 - 23:00</div>
          </div>
        </div>

        {/* Ticket counter */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-300">Chọn số lượng vé</label>
          <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
            <button
              onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center font-bold text-slate-200 cursor-pointer"
            >
              -
            </button>
            <span className="text-xl font-bold text-slate-100">{ticketCount}</span>
            <button
              onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center font-bold text-slate-200 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-800/30">
          <span className="text-sm text-slate-400">Tổng thanh toán:</span>
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {(pricePerTicket * ticketCount).toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Call to action */}
        <button
          onClick={() => alert('Chức năng đặt vé sẽ được tích hợp ở các bước sau!')}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-900/20 active:scale-[0.98] transition-all duration-150 cursor-pointer text-center"
        >
          Đặt Vé Ngay
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-slate-600 select-none">
        Powered by NestJS & React Vite • TailwindCSS v4
      </div>
    </div>
  )
}

export default App
