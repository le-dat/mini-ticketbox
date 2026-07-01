import { useState } from "react";
import { useBooking } from "./hooks/useBooking";
import { useAdminStats } from "./hooks/useAdminStats";
import { TabSwitcher } from "./components/shared/TabSwitcher";
import { SpotlightCard } from "./components/booking/SpotlightCard";
import { TicketCard } from "./components/booking/TicketCard";
import { CheckoutPanel } from "./components/booking/CheckoutPanel";
import { UserIdentityInput } from "./components/booking/UserIdentityInput";
import { ErrorAlert } from "./components/shared/ErrorAlert";
import { OrderSuccessPanel } from "./components/booking/OrderSuccessPanel";
import { AdminStatsGrid } from "./components/admin/AdminStatsGrid";
import { AdminTicketsTable } from "./components/admin/AdminTicketsTable";
import { WsStatusBanner } from "./components/shared/WsStatusBanner";

function App() {
  // Navigation State
  const [view, setView] = useState<"booking" | "admin">("booking");

  // Customer Booking State and Hooks
  const {
    userId,
    setUserId,
    isHolding,
    isPaying,
    heldTicket,
    paymentSuccessOrder,
    errorMessage,
    regularSocket,
    vipSocket,
    handleHoldTicket,
    handlePayment,
    handleHoldTimeout,
  } = useBooking();

  // isStale = true nếu bất kỳ socket nào mất kết nối > 10s
  const isStale = regularSocket.isStale || vipSocket.isStale;

  // Admin View State and Hooks (polls only when admin view is active)
  const { adminStats, isAdminLoading, refetch } = useAdminStats(view === "admin");

  return (
    <div className="min-h-screen bg-bg-base text-slate-100 flex flex-col items-center justify-between p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] rounded-full bg-brand-primary/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-15%] w-[70%] h-[70%] rounded-full bg-brand-secondary/5 blur-[160px] pointer-events-none" />

      {/* Top Header & Switcher */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4 z-20 pb-4 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-brand-primary">🎟️</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight font-display text-brand-primary">
              Mini Ticketbox
            </h1>
            <p className="text-slate-500 text-xs">Hệ thống phân phối vé concert siêu tốc</p>
          </div>
        </div>

        <TabSwitcher view={view} onViewChange={setView} />
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl flex-1 flex items-center justify-center py-8 z-10">
        {view === "booking" ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Ticket Categories */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <SpotlightCard />

              <UserIdentityInput userId={userId} onChange={setUserId} />

              {/* Banner cảnh báo khi mất kết nối WS > 10s */}
              <WsStatusBanner isStale={isStale} />

              {/* Grid of Ticket Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TicketCard
                  ticketTypeId={1}
                  typeName="Regular"
                  price={500000}
                  description="Trải nghiệm không gian âm nhạc sôi động và đầy sắc màu."
                  totalTickets={300}
                  isWsConnected={regularSocket.isWsConnected}
                  isStale={isStale}
                  count={regularSocket.count}
                  isHolding={isHolding}
                  onHold={handleHoldTicket}
                />

                <TicketCard
                  ticketTypeId={2}
                  typeName="VIP"
                  price={1500000}
                  description="Hàng ghế đầu cận cảnh sân khấu, kèm quà tặng lưu niệm."
                  totalTickets={200}
                  isWsConnected={vipSocket.isWsConnected}
                  isStale={isStale}
                  count={vipSocket.count}
                  isHolding={isHolding}
                  onHold={handleHoldTicket}
                />
              </div>
            </div>

            {/* RIGHT: Holding Checkout / Cart Status */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <CheckoutPanel
                heldTicket={heldTicket}
                isPaying={isPaying}
                onPayment={handlePayment}
                onHoldTimeout={handleHoldTimeout}
              />

              <ErrorAlert message={errorMessage} />
              <OrderSuccessPanel order={paymentSuccessOrder} />
            </div>
          </div>
        ) : (
          /* ADMIN VIEW */
          <div className="w-full flex flex-col gap-8">
            <AdminStatsGrid adminStats={adminStats} />
            <AdminTicketsTable
              adminStats={adminStats}
              isAdminLoading={isAdminLoading}
              onRefresh={refetch}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 border-t border-border-default text-[10px] text-slate-600 select-none z-10 mt-8">
        All rights reserved @2026
      </footer>
    </div>
  );
}

export default App;
