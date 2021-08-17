import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export default class CreateUserDTO {
  @IsOptional()
  @IsUUID()
  @IsString()
  readonly role_id?: string;

  @IsString()
  readonly name: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly document_number: string;

  @IsString()
  readonly birthdate: Date;
}