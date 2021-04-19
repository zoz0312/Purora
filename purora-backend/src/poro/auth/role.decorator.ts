import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../users/entities/users.entitiy";

export type AllowedRoles = keyof typeof UserRole | 'Any';

export const Role = (roles: AllowedRoles[]) => {
  return SetMetadata('roles', roles);
}