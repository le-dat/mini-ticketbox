import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class HoldTicketDto {
  @IsInt({ message: 'ticket_type_id must be an integer' })
  @Min(1, { message: 'ticket_type_id must be greater than or equal to 1' })
  @IsNotEmpty({ message: 'ticket_type_id should not be empty' })
  ticket_type_id: number;

  @IsString({ message: 'user_id must be a string' })
  @IsNotEmpty({ message: 'user_id should not be empty' })
  user_id: string;
}
