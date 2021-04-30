import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../users/entities/users.entity";

export type AllowedRoles = keyof typeof UserRole | 'ANY';

export const Role = (roles: AllowedRoles[]) => {
  return SetMetadata('roles', roles);
}