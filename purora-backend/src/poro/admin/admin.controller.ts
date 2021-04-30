import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';
import { Users } from '../users/entities/users.entity';
import { AdminService } from './admin.service';
import { AdminModifyUsersInput, AdminModifyUsersOutput } from './dtos/admin-modify-users.dto';
import { AdminReadKeywordOutput } from './dtos/admin-read-keyword.dto';
import { AdminReadKeywordsOutput } from './dtos/admin-read-keywords.dto';
import { AdminReadUserOutput } from './dtos/admin-read-user.dto';
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
  ): Promise<AdminReadUserOutput> {
    return this.adminService.readUser(user, userId);
  }

  @Role(['SUPER_ADMIN','ADMIN'])
  @Patch('users')
  async modifyUsers(
    @AuthUser() user: Users,
    @Body() users: AdminModifyUsersInput,
  ): Promise<AdminModifyUsersOutput> {
    return this.adminService.modifyUsers(user, users);
  }

  @Role(['SUPER_ADMIN','ADMIN'])
  @Get('keywords')
  async readUserKeywords(
    @AuthUser() user: Users,
  ): Promise<AdminReadKeywordsOutput> {
    return this.adminService.readUserKeywords(user);
  }

  @Role(['SUPER_ADMIN','ADMIN'])
  @Get('keyword/:keywordId')
  async readUserKeyword(
    @AuthUser() user: Users,
    @Param('keywordId') keywordId: number,
  ): Promise<AdminReadKeywordOutput> {
    return this.adminService.readUserKeyword(user, keywordId);
  }
}
