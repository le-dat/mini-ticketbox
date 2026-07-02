// Hàm helper lấy thông điệp lỗi chuẩn hóa và thân thiện
export const getErrorMessage = (err: any): string => {
  if (err?.code === 'ERR_NETWORK' || !navigator.onLine) {
    return 'Mất kết nối mạng. Vui lòng kiểm tra lại đường truyền internet của bạn.';
  }
  return err?.response?.data?.message || err?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
};
