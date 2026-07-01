import { useState } from 'react';
import { useTicketSocket } from './useTicketSocket';
import { ticketService } from '../services/ticket.service';
import { orderService } from '../services/order.service';
import type { HeldTicket, Order } from '../types';

export const useBooking = () => {
  const [userId, setUserId] = useState<string>('khach_hang_1');
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [heldTicket, setHeldTicket] = useState<HeldTicket | null>(null);
  const [paymentSuccessOrder, setPaymentSuccessOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time Counts via Socket Hooks
  const regularSocket = useTicketSocket(1);
  const vipSocket = useTicketSocket(2);

  // Handle ticket hold request
  const handleHoldTicket = async (ticketTypeId: number, price: number, typeName: string) => {
    if (!userId.trim()) {
      setErrorMessage('Vui lòng nhập tên người mua (User ID) để tiếp tục.');
      return;
    }
    setErrorMessage(null);
    setIsHolding(true);
    setPaymentSuccessOrder(null);

    try {
      const data = await ticketService.holdTicket(ticketTypeId, userId.trim());
      setHeldTicket({
        id: data.ticketId,
        ticketTypeId,
        expiresAt: data.expiresAt,
        userId: userId.trim(),
        price,
        typeName,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi giữ vé. Vui lòng thử lại.';
      setErrorMessage(msg);
    } finally {
      setIsHolding(false);
    }
  };

  // Handle payment request
  const handlePayment = async () => {
    if (!heldTicket) return;
    setIsPaying(true);
    setErrorMessage(null);

    try {
      const order = await orderService.createOrder(
        heldTicket.id,
        heldTicket.userId,
        heldTicket.price
      );
      setPaymentSuccessOrder(order);
      setHeldTicket(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Thanh toán thất bại. Vui lòng kiểm tra lại.';
      setErrorMessage(msg);
    } finally {
      setIsPaying(false);
    }
  };

  // Handle timeout of ticket hold
  const handleHoldTimeout = () => {
    setHeldTicket(null);
    setErrorMessage('Oop :(( Thời gian giữ vé của bạn đã hết hạn! Vui lòng chọn lại vé.');
  };

  return {
    userId,
    setUserId,
    isHolding,
    isPaying,
    heldTicket,
    paymentSuccessOrder,
    errorMessage,
    setErrorMessage,
    regularSocket,
    vipSocket,
    handleHoldTicket,
    handlePayment,
    handleHoldTimeout,
  };
};
