import { RoleValue } from './add-role.dto';

export class CreateRoleDto {
  readonly value: RoleValue;
  readonly description: string;
};