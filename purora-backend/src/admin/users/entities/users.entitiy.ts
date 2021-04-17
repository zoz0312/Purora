import { CoreEntity } from "src/common/entities/core.entities";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { IsEnum, IsString } from 'class-validator';
import { UsersGameInfo } from './users-lol.entitiy';

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  USER = 'User',
  GUEST = 'Guest',
};
/*
  @author AJu (zoz0312)
  Commands: user
*/
@Entity()
export class Users extends CoreEntity {
  @Column()
  @IsString()
  userId: string;

  @Column()
  @IsString()
  userPw: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToMany(
    type => UsersGameInfo,
    usersGameInfo => usersGameInfo.users,
    {
      cascade: true,
      onDelete: 'CASCADE',
    }
  )
  userLoL: UsersGameInfo[];
}