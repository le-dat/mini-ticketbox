import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class HoldTicketDto {
  @IsInt({ message: 'ticket_type_id phải là số nguyên' })
  @Min(1, { message: 'ticket_type_id không hợp lệ' })
  @IsNotEmpty({ message: 'ticket_type_id không được để trống' })
  ticket_type_id: number;

  @IsString({ message: 'user_id phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'user_id không được để trống' })
  user_id: string;
}
