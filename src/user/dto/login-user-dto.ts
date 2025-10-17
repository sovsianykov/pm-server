import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsString()
  @IsEmail({}, { message: 'Please enter an email address' })
  @ApiProperty({ example: 'Doe@gmail.com', description: 'email' })
  readonly email: string;

  @Length(6, 10, { message: 'password length' })
  @IsString()
  @ApiProperty({ example: '123123', description: 'password' })
  readonly password: string;
}