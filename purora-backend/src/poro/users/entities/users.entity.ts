import { CoreEntity } from "src/common/entities/core.entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { IsEnum, IsString, Min } from 'class-validator';
import { UsersSummonerInfo } from './users-summoner-info.entity';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";
import { UsersGameInfo } from "./user-game-info.entity";

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
};

export enum UserStatus {
  ENABLE = 'Enable',
  DISABLE = 'Disable',
  BAN = 'Ban',
  DORMANT = 'Dormant',
};

/*
  @author AJu (zoz0312)
  Commands: user
*/
@Entity()
export class Users extends CoreEntity {
  @Column()
  userId: string;

  @Column({ select: false })
  userPw: string;

  @Column({ length: 16 })
  nickName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ENABLE,
  })
  @IsEnum(UserStatus)
  status: UserStatus;

  @OneToMany(
    type => UsersSummonerInfo,
    usersSummonerInfo => usersSummonerInfo.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
    }
  )
  usersSummonerInfo: UsersSummonerInfo[];

  @OneToMany(
    type => UsersGameInfo,
    UsersGameInfo => UsersGameInfo.users,
    {
      cascade: true,
      onDelete: 'CASCADE',
    }
  )
  usersGameInfo: UsersGameInfo[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.userPw) {
      try {
        this.userPw = await bcrypt.hash(this.userPw, 10);
      } catch (e) {
        console.log('hashPassword Error', e)
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.userPw);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}