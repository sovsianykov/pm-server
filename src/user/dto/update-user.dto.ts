import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user-dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsEmail({}, { message: 'Please enter an email address' })
  @ApiProperty({ example: 'Doe@gmail.com', description: 'email' })
  readonly email: string;

  @Length(6, 10, { message: 'password length' })
  @IsString()
  @ApiProperty({ example: '123123', description: 'password' })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John', description: 'name' })
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Doe', description: 'last name' })
  readonly lastName: string;
}