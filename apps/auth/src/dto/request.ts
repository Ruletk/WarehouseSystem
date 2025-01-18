
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AuthRequest {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}


export class RequestPasswordChange {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}


export class PasswordChange {
  @IsString()
  @IsNotEmpty()
  password: string;
}
