import { Controller, Get, Param } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';
import { Users } from '../users/entities/users.entity';
import { AdminService } from './admin.service';
import { AdminReadUsersOutput } from './dtos/admin-read-users.dto';

@Controller('admin')
export class AdminController {
  constructor (
    private readonly adminService: AdminService,
  ){}

  @Role(['SUPER_ADMIN','ADMIN'])
  @Get('users')
  async readUsers(
    @AuthUser() user: Users,
  ): Promise<AdminReadUsersOutput> {
    return this.adminService.readUsers(user);
  }

  @Role(['SUPER_ADMIN','ADMIN'])
  @Get('user/:userId')
  async readUser(
    @AuthUser() user: Users,
    @Param('userId') userId: number,
  ): Promise<AdminReadUsersOutput> {
    return this.adminService.readUser(user, userId);
  }
}
