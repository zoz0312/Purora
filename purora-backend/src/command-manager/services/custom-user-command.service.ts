import { Injectable } from "@nestjs/common";
import { ChatBotInput, ChatBotOutput } from '../../common/dtos/chatBot.dto';
import { trimInput } from '../../common/trimInput';
import { CommandsRepository } from '../../user-custom-command/repositories/commands.repository';
import { KeywordRepository } from '../../user-custom-command/repositories/keyword.repository';
import { Rooms } from '../../user-custom-command/entities/rooms.entitiy';
import { CREATE_USER_COMMNAD, DELETE_USER_COMMAND, READ_USER_COMMAND, SHOW_USER_COMMAND_LIST } from "../command-manager.constants";
import { RoomsRepository } from '../../user-custom-command/repositories/rooms.repository';

/*
  @author AJu (zoz0312)
  Custom User Command를 등록 및 삭제하는 곳
*/
@Injectable()
export class CustomUserCommand {
  constructor (
    private readonly commands: CommandsRepository,
    private readonly keyword: KeywordRepository,
    private readonly rooms: RoomsRepository,
  ) {}

  // Call mainService by controller
  async mainService (
    chatBotInput :ChatBotInput,
    name: string,
  ): Promise<ChatBotOutput> {
    const { room } = chatBotInput;
    const myRoom = await this.rooms.findMyRoom(room);

    switch (name) {
      case READ_USER_COMMAND:
        return this.readUserCommand(myRoom);
      case CREATE_USER_COMMNAD:
        return this.createUserCommand(chatBotInput, myRoom);
      case SHOW_USER_COMMAND_LIST:
        return this.findUserCommand(chatBotInput, myRoom);
      case DELETE_USER_COMMAND:
        return this.deleteUserCommand(chatBotInput, myRoom);
      default:
        return {
          success: false,
          message: `${name}은 잘못 되었습니다.`
        }
    }
  }

  async readUserCommand(
    myRoom: Rooms,
  ): Promise<ChatBotOutput> {
    const allKeyword = await this.keyword.find({
      where: {
        rooms: myRoom,
      },
      relations: ['commands'],
    });
    const rtnText = allKeyword.map(item => {
      return `[${item.keyword}] => ${item.commands.length}개`;
    })
    return {
      success: true,
      message: rtnText.join('\n'),
    }
  }

  async createUserCommand(
    chatBotInput :ChatBotInput,
    myRoom: Rooms,
  ): Promise<ChatBotOutput> {
    const { sender: userName } = chatBotInput;
    const [_, arguement] = trimInput(chatBotInput);
    const [keyword, outputTexts] = arguement.split('::');

    if (!keyword) {
      return {
        success: false,
        message: '키워드가 존재하지 않습니다!',
      }
    }
    if (!outputTexts) {
      return {
        success: false,
        message: '학습할 글자가 없습니다!',
      }
    }

    try {
      let dbKeyword = await this.keyword.findOne({
        where: {
          keyword,
          rooms: myRoom,
        }
      });

      if (!dbKeyword) {
        dbKeyword = await this.keyword.save(
          this.keyword.create({
            keyword,
            rooms: myRoom,
          })
        );
      }

      const outputText = outputTexts.split('|');
      const where = outputText.map(outputText => {
        return {
          outputText,
          keyword: dbKeyword,
        }
      });

      const commands = await this.commands.find({ where });
      console.log('commands', commands)

      if (commands.length > 0) {
        if (commands.length === 1) {
          return {
            success: false,
            message: `[${commands[0].outputText}]는 이미 등록되어있습니다.`
          }
        }
        return {
          success: false,
          message: `${commands.length}갯수가 이미 등록되어있습니다.`
        }
      }

      await this.commands.save(
        this.commands.create(
          where.map(item => {
            return {
              ...item,
              userName,
            }
          })
        )
      );

      return {
        success: true,
        message: '정상적으로 등록되었습니다',
      }
    } catch (error) {
      return {
        success: false,
        message: 'DB 조회 오류!',
        error,
      }
    }
  }

  async findUserCommand(
    chatBotInput :ChatBotInput,
    myRoom: Rooms,
  ): Promise<ChatBotOutput> {
    const [_, keyword] = trimInput(chatBotInput);

    if (!keyword) {
      return {
        success: false,
        message: '키워드를 입력해주세요!'
      }
    }

    try {
      const outputText = await this.keyword.findOne({
        where: {
          keyword,
          rooms: myRoom,
        },
        relations: ['commands'],
      });

      let text = `-- "${keyword}" 학습 내역 --\n`;
      text += outputText.commands.map(({
        id,
        userName,
        createdAt,
        outputText,
      }, index) => {
        const date = `${createdAt.getFullYear()}.${createdAt.getMonth() + 1}.${createdAt.getDate()}. ${createdAt.getHours()}:${createdAt.getMinutes()}`;
        return `[ID: ${index}, author: ${userName} (${date})]\n${outputText}`
      }).join('\n');

      return {
        success: true,
        message: text,
      }
    } catch (error) {
      return {
        success: false,
        message: 'DB 조회 오류!',
        error,
      }
    }
  }

  async deleteUserCommand(
    chatBotInput :ChatBotInput,
    myRoom: Rooms,
  ): Promise<ChatBotOutput> {
    // const { sender: userName } = chatBotInput;
    const [_, arguement] = trimInput(chatBotInput);
    const [keyword, arg] = arguement.split('::');

    if (!keyword) {
      return {
        success: false,
        message: '키워드가 존재하지 않습니다!',
      }
    }

    const idx = +arg;
    if (idx < 0 && arg !== 'all') {
      return {
        success: false,
        message: 'index 범위가 벗어납니다',
      }
    }

    try {
      if (arg === 'all') {
        // 전체삭제
        const key = await this.keyword.findOne({
          where: {
            keyword,
            rooms: myRoom,
          },
          relations: ['commands'],
        });

        await this.keyword.softRemove(key);

        return {
          success: true,
          message: `"${keyword}" 키워드 전체 삭제 완료`,
        }
      } else {
        // 부분삭제
        const key = await this.keyword.findOne({
          where: {
            keyword,
            rooms: myRoom,
          },
          relations: ['commands'],
        });

        if (!key.commands[idx]) {
          return {
            success: false,
            message: '삭제하려는 ID가 없습니다.',
          }
        }

        await this.commands.softDelete(key.commands[idx].id);

        return {
          success: true,
          message: `"${key.commands[idx].outputText}" 답변 삭제 완료`,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'DB 조회 오류!',
        error,
      }
    }
  }
}