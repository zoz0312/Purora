import { CoreEntity } from "src/common/entities/core.entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { IsEnum, IsString, Min } from 'class-validator';
import { UsersSummonerInfo } from './users-summoner-info.entitiy';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";

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
    usersSummonerInfo => usersSummonerInfo.users,
    {
      cascade: true,
      onDelete: 'CASCADE',
    }
  )
  userGameInfo: UsersSummonerInfo[];

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