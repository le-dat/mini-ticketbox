import { useCallback, useEffect, useState } from 'react';
import { getSynchronizedTime } from '../../utils/time';

interface TicketCountdownProps {
  expiresAt: string;
}

export const TicketCountdown = ({ expiresAt }: TicketCountdownProps) => {
  const calculateTimeLeft = useCallback(() => {
    return Math.max(
      0,
      Math.floor((new Date(expiresAt).getTime() - getSynchronizedTime()) / 1000)
    );
  }, [expiresAt]);

  const [secondsLeft, setSecondsLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setSecondsLeft(calculateTimeLeft());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [secondsLeft, calculateTimeLeft]);

  if (secondsLeft <= 0) {
    return <span className="text-brand-danger">Đang giải phóng...</span>;
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <>
      {`${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`}
    </>
  );
};
