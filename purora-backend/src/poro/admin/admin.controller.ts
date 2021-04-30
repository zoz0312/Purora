import { Controller, Get } from '@nestjs/common';
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
}
