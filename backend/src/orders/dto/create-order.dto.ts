import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt({ message: 'ticket_id phải là số nguyên' })
  @Min(1, { message: 'ticket_id không hợp lệ' })
  @IsNotEmpty({ message: 'ticket_id không được để trống' })
  ticket_id: number;

  @IsString({ message: 'user_id phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'user_id không được để trống' })
  user_id: string;

  @IsNumber({}, { message: 'amount phải là số hợp lệ' })
  @Min(1, { message: 'amount phải lớn hơn 0' })
  @IsNotEmpty({ message: 'amount không được để trống' })
  amount: number;
}
