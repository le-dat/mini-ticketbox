import { useEffect, useState } from 'react';

interface Props {
  expiresAt: string; // ISO String từ server
  onTimeout: () => void;
}

export const CountdownTimer = ({ expiresAt, onTimeout }: Props) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - Date.now();
      if (difference <= 0) {
        onTimeout();
        return 0;
      }
      return Math.floor(difference / 1000);
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 60; // Dưới 60 giây

  if (timeLeft <= 0) {
    return (
      <div className="text-brand-danger font-semibold text-center text-sm py-2">
        Thời gian giữ vé đã hết hạn!
      </div>
    );
  }

  return (
    <div
      className={`text-center py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
        isUrgent
          ? 'bg-brand-danger/10 border border-brand-danger/30 text-brand-danger animate-pulse'
          : 'bg-brand-success/10 border border-brand-success/30 text-brand-success'
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-wider block opacity-70 mb-0.5">
        Thời gian giữ vé còn lại
      </span>
      <span className="text-2xl font-mono">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};
