import { EntityRepository, Repository } from "typeorm";
import {AllowRoom} from "../entities/allow-room.entity";

@EntityRepository(AllowRoom)
export class AllowRoomRepository extends Repository<AllowRoom> {
}