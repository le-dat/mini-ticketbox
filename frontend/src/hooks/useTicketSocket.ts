import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL, WS_STALE_THRESHOLD_MS, STALE_POLL_INTERVAL_MS } from '../config/constants';
import { ticketService } from '../services/ticket.service';

export const useTicketSocket = (ticketTypeId: number) => {
  const [count, setCount] = useState<number>(0);
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);
  // isStale = true when WS disconnect exceeds 10 seconds
  const [isStale, setIsStale] = useState<boolean>(false);

  const staleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const stopFallbackPoll = () => {
    clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = undefined;
  };

  useEffect(() => {
    let active = true;

    // Fetch initial ticket count — once upon mounting
    ticketService.getAvailableCount(ticketTypeId).then((availableCount) => {
      if (active) setCount(availableCount);
    }).catch((err) => {
      console.error('Failed to fetch initial ticket count:', err);
    });

    const socket = io(API_BASE_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      if (!active) return;
      // Cancel stale timer and stop fallback poll on WS reconnect
      clearTimeout(staleTimerRef.current);
      stopFallbackPoll();
      setIsWsConnected(true);
      setIsStale(false);
      // Refetch on WS reconnect to sync ticket counts
      ticketService.getAvailableCount(ticketTypeId).then((availableCount) => {
        if (active) setCount(availableCount);
      }).catch(() => {});
    });

    socket.on('disconnect', () => {
      if (!active) return;
      setIsWsConnected(false);
      // Cancel previous stale timer to prevent duplicates/memory leaks
      if (staleTimerRef.current) {
        clearTimeout(staleTimerRef.current);
      }
      // Start 10s countdown — mark stale and start fallback poll if reconnect fails
      staleTimerRef.current = setTimeout(() => {
        if (!active) return;
        setIsStale(true);
        // Fallback: poll every 5s to keep ticket count updated when WS is down
        pollIntervalRef.current = setInterval(() => {
          if (!active) return;
          ticketService.getAvailableCount(ticketTypeId).then((availableCount) => {
            if (active) setCount(availableCount);
          }).catch(() => {});
        }, STALE_POLL_INTERVAL_MS);
      }, WS_STALE_THRESHOLD_MS);
    });

    // Receive new count pushed by backend — no client polling needed
    socket.on(`ticket_count_updated:${ticketTypeId}`, (data: { availableCount: number }) => {
      if (active) setCount(data.availableCount);
    });

    return () => {
      active = false;
      clearTimeout(staleTimerRef.current);
      stopFallbackPoll();
      socket.disconnect();
    };
  }, [ticketTypeId]); // Omit isWsConnected from deps to prevent re-evaluation loops

  return { count, isWsConnected, isStale };
};
