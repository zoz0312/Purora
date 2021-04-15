import { EntityRepository, Repository } from "typeorm";
import { Rooms } from "../entities/rooms.entitiy";

@EntityRepository(Rooms)
export class RoomsRepository extends Repository<Rooms> {
  async findMyRoom(roomName: string): Promise<Rooms> {
    let myRoom = await this.findOne({
      where: {
        roomName,
      }
    });

    if (!myRoom) {
      myRoom = await this.save(
        this.create({
          roomName
        })
      );
    }

    return myRoom;
  }
}