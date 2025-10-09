import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail({}, { message: 'Please enter an email address' })
  @ApiProperty({ example: 'Doe@gmail.com', description: 'email' })
  readonly email: string;

  @Length(6, 10, { message: 'password length' })
  @IsString()
  @ApiProperty({ example: '123123', description: 'password' })
  readonly password: string;

  @ApiProperty({ example: 'John', description: 'name' })
  readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'last name' })
  readonly lastName: string;
}
