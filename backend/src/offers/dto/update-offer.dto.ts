import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  
  @IsNumber()
  @Min(1)
  @IsOptional()
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;
}
