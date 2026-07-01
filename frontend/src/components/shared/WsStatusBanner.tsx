interface Props {
  isStale: boolean;
}

/**
 * Banner cảnh báo khi kết nối WebSocket mất > 10 giây.
 * Hiển thị thông báo dữ liệu có thể chưa cập nhật và disable các action.
 */
export const WsStatusBanner = ({ isStale }: Props) => {
  if (!isStale) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-brand-warning/30 bg-brand-warning/5 text-brand-warning text-sm font-medium"
      style={{ animation: 'fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {/* Pulsing warning dot */}
      <span className="relative flex-shrink-0 w-2.5 h-2.5">
        <span className="absolute inset-0 rounded-full bg-brand-warning animate-ping opacity-60" />
        <span className="relative block w-2.5 h-2.5 rounded-full bg-brand-warning" />
      </span>

      <span>
        <strong className="font-bold">Mất kết nối thời gian thực.</strong>{' '}
        Dữ liệu vé có thể chưa được cập nhật — vui lòng chờ kết nối lại hoặc tải lại trang.
      </span>
    </div>
  );
};
