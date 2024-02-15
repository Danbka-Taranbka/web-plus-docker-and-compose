import { Transform } from "class-transformer";
import { IsOptional, IsUrl, Length } from "class-validator";

export class CreateWishlistDto {

  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @Transform((params) => (params.value?.length > 0 ? params.value : undefined))
  @Length(1, 1500)
  @IsOptional()
  description: string;

  itemsId: number[];
}
