import { Injectable } from "@nestjs/common";
import { ChatBotOutput } from "src/common/dtos/chatBot.dto";
import { Status } from '../entities/working.entity';
import { WorkingRepository } from '../repositories/working.repository';

/*
  @author AJu (zoz0312)
  Party 관리 관련 명령어
*/
@Injectable()
export class WorkingList {
  constructor(
    private readonly working: WorkingRepository,
  ) {
  }

  async findWorlingList(): Promise<ChatBotOutput> {
    try {
      const list = await this.working.find();

      if (list.length === 0) {
        return {
          success: false,
          message: '[등록된 작업목록이 없습니다]',
        }
      }

      let message = '[룽지님 작업 목록]\n\n';
      list.map(({ userName, champion, status }, index) => {
        message += `${index + 1}. `;
        message += `${userName} - ${champion}`;
        if (status === Status.Todo) {
        } else if (status === Status.Working) {
          message += ' 👩‍🏭';
        } else if (status === Status.Done) {
          message += ' 🔥';
        }
        message += '\n';
      });

      return {
        success: true,
        message,
      }
    } catch (error) {
      return {
        success: false,
        message: 'DB 조회 오류',
        error,
      }
    }
  }
}