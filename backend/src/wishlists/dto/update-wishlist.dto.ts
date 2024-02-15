import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';
import { IsArray, IsOptional, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  
  @Length(1, 250)
  @IsOptional()
  name: string;

  @Transform((params) => (params.value?.length > 0 ? params.value : undefined))
  @Length(0, 1500)
  @IsOptional()
  description: string;

  @IsArray()
  itemsId: number[];
}
