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
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler()
    );

    if (!roles) {
      return true;
    }

    const [req, res, next] = context.getArgs();
    const token = req.headers['x-jwt'];
    const decoded = this.jwtService.verify(token);

    if (typeof decoded !== 'object' || !decoded.hasOwnProperty('id')) {
      return false;
    }

    const { user } = await this.usersService.findById(decoded.id);

    if (!user) {
      return false;
    }

    req['user'] = user;
    return roles.includes('ANY') ? true : roles.includes(user.role);
  }
}