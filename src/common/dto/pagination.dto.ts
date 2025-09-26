import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(0)
  limit: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number;
}
