const ERROR_MESSAGES_MAP: Record<string, string> = {
  'SOLD_OUT': 'Không còn vé trống loại này hoặc tất cả vé đang được giữ.',
  'No available tickets of this type or all tickets are currently held.': 'Không còn vé trống loại này hoặc tất cả vé đang được giữ.',
  'Ticket does not exist or does not belong to this user.': 'Vé không tồn tại hoặc không thuộc về người dùng này.',
  'Ticket has already been paid and sold.': 'Vé đã được thanh toán và bán thành công.',
  'Ticket hold has expired or ticket is not held.': 'Thời gian giữ vé đã hết hạn hoặc vé chưa được giữ, không thể thanh toán.',
};

// Helper function to extract and localize error messages
export const getErrorMessage = (err: any): string => {
  if (err?.code === 'ERR_NETWORK' || !navigator.onLine) {
    return 'Mất kết nối mạng. Vui lòng kiểm tra lại đường truyền internet của bạn.';
  }

  // Prioritize machine-readable error codes
  const code = err?.response?.data?.code;
  if (code && ERROR_MESSAGES_MAP[code]) {
    return ERROR_MESSAGES_MAP[code];
  }

  const rawMessage = err?.response?.data?.message || err?.message;

  if (typeof rawMessage === 'string') {
    return ERROR_MESSAGES_MAP[rawMessage] || rawMessage;
  }

  if (Array.isArray(rawMessage)) {
    return rawMessage.map(msg => ERROR_MESSAGES_MAP[msg] || msg).join('\n');
  }

  return 'Có lỗi xảy ra. Vui lòng thử lại.';
};
