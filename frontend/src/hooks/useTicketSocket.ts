import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../services/api-client';
import { ticketService } from '../services/ticket.service';

export const useTicketSocket = (ticketTypeId: number) => {
  const [count, setCount] = useState<number>(0);
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    // 1. Đọc số lượng vé ban đầu qua API
    const fetchInitialCount = async () => {
      try {
        const availableCount = await ticketService.getAvailableCount(ticketTypeId);
        if (active) {
          setCount(availableCount);
        }
      } catch (err) {
        console.error('Lỗi khi tải số lượng vé ban đầu:', err);
      }
    };
    fetchInitialCount();

    // 2. Kết nối WebSocket
    const socket = io(API_BASE_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      if (active) setIsWsConnected(true);
    });

    socket.on('disconnect', () => {
      if (active) setIsWsConnected(false);
    });

    socket.on(`ticket_count_updated:${ticketTypeId}`, (data: { availableCount: number }) => {
      if (active) {
        setCount(data.availableCount);
      }
    });

    // 3. Fallback sang Polling nếu mất kết nối WebSocket
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (!isWsConnected) {
      intervalId = setInterval(async () => {
        try {
          const availableCount = await ticketService.getAvailableCount(ticketTypeId);
          if (active) {
            setCount(availableCount);
          }
        } catch (e) {
          console.error('Lỗi polling đồng bộ số lượng vé:', e);
        }
      }, 3000); // Thăm dò mỗi 3 giây
    }

    return () => {
      active = false;
      socket.disconnect();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [ticketTypeId, isWsConnected]);

  return { count, isWsConnected };
};

