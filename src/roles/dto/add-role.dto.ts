export enum RoleValue {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

export class AddRoleDto {
  readonly value: RoleValue;
  readonly userId: number;
}
