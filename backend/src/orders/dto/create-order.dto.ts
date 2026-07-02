import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt({ message: 'ticket_id must be an integer' })
  @Min(1, { message: 'ticket_id must be greater than or equal to 1' })
  @IsNotEmpty({ message: 'ticket_id should not be empty' })
  ticket_id: number;

  @IsString({ message: 'user_id must be a string' })
  @IsNotEmpty({ message: 'user_id should not be empty' })
  user_id: string;

  @IsNumber({}, { message: 'amount must be a valid number' })
  @Min(1, { message: 'amount must be greater than 0' })
  @IsNotEmpty({ message: 'amount should not be empty' })
  amount: number;
}
