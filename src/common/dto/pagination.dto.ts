import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    default: 10,
    description: 'How many items to return',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(0)
  limit: number;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'How many items to skip',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number;
}
