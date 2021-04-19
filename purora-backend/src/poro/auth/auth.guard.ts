import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from '../jwt/jwt.service';
import { UsersService } from './../users/users.service';
import { AllowedRoles } from "./role.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    console.log('CAN ACTIVATE')
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler()
    );

    console.log('roles', roles)
    console.log('context', context);

    if (!roles) {
      return true;
    }

    return false;
  }
}