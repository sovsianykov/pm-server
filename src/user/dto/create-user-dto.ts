import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Doe@gmail.com', description: 'email' })
  readonly email: string;

  @ApiProperty({ example: '123123', description: 'password' })
  readonly password: string;

  @ApiProperty({ example: 'John', description: 'name' })
  readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'last name' })
  readonly lastName: string;
}
