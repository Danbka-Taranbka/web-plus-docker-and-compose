import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @Transform((params) => (params.value?.length > 0 ? params.value : undefined))
  @IsString()
  @Length(2, 200)
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
