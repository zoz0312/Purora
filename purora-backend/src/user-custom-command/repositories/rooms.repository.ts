import { EntityRepository, Repository } from "typeorm";
import { Rooms } from "../entities/rooms.entitiy";

@EntityRepository(Rooms)
export class RoomsRepository extends Repository<Rooms> {
  async findMyRoom(channelId: string): Promise<Rooms> {
    return await this.findOne({
      where: {
        roomId: channelId,
      }
    });

    // if (!myRoom) {
    //   myRoom = await this.save(
    //     this.create({
    //       roomName,
    //       roomId: channelId,
    //     })
    //   );
    // }
    //
    // return myRoom;
  }
}