import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('api/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get('/:value')
  getByValue(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }
}
