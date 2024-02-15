import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

export class CreateOfferDto {
  
  @Min(1)
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
