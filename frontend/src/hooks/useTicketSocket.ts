import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../services/api-client';
import { ticketService } from '../services/ticket.service';

const WS_STALE_THRESHOLD_MS = 10_000; // Coi là stale sau 10s mất kết nối

export const useTicketSocket = (ticketTypeId: number) => {
  const [count, setCount] = useState<number>(0);
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);
  // isStale = true khi WS mất kết nối > 10 giây
  const [isStale, setIsStale] = useState<boolean>(false);

  const staleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let active = true;

    // Fetch số lượng vé ban đầu — chỉ 1 lần duy nhất
    ticketService.getAvailableCount(ticketTypeId).then((availableCount) => {
      if (active) setCount(availableCount);
    }).catch((err) => {
      console.error('Lỗi khi tải số lượng vé ban đầu:', err);
    });

    const socket = io(API_BASE_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      if (!active) return;
      // Huỷ timer stale nếu vừa reconnect
      clearTimeout(staleTimerRef.current);
      setIsWsConnected(true);
      setIsStale(false);
      // Refetch ngay khi WS reconnect để đồng bộ lại count
      ticketService.getAvailableCount(ticketTypeId).then((availableCount) => {
        if (active) setCount(availableCount);
      }).catch(() => {});
    });

    socket.on('disconnect', () => {
      if (!active) return;
      setIsWsConnected(false);
      // Bắt đầu đếm ngược 10s — nếu không reconnect → đánh dấu stale
      staleTimerRef.current = setTimeout(() => {
        if (active) setIsStale(true);
      }, WS_STALE_THRESHOLD_MS);
    });

    // Backend push count mới — không cần polling
    socket.on(`ticket_count_updated:${ticketTypeId}`, (data: { availableCount: number }) => {
      if (active) setCount(data.availableCount);
    });

    return () => {
      active = false;
      clearTimeout(staleTimerRef.current);
      socket.disconnect();
    };
  }, [ticketTypeId]); // Không có isWsConnected trong deps → không loop

  return { count, isWsConnected, isStale };
};
