import {Inject, Injectable} from '@nestjs/common';
import {PORO_KAKAO_CONFIG_OPTIONS} from "../common/constants";
import {PoroKakaoModuleOptions} from "./poro-kakao.module";
import {
  AuthApiClient,
  TalkClient,
} from 'node-kakao';
import * as readline from 'readline';
import {TalkChatData} from "node-kakao/dist/talk/chat";
import {TalkChannel} from "node-kakao/dist/talk/channel";
import {CommandManagerService} from "../command-manager/command-manager.service";
import {UserCustomCommandService} from "../user-custom-command/services/user-custom-command.service";
import {AllowAdminRepository} from "./repositories/allow-admin.repository";
import {ChatBotInput, ChatBotOutput} from "../common/dtos/chatBot.dto";
import {AdminCommandService} from "./services/admin-command.service";
import {RoomsRepository} from "../user-custom-command/repositories/rooms.repository";

interface LoginDataDto {
  email: string;
  password: string;
  forced: boolean;
}

@Injectable()
export class PoroKakaoService {
  private client: TalkClient;
  private adminEnable: boolean;
  private api: AuthApiClient;
  private allowRoom: string[];
  private allowAdmin: number[];
  private updateRoomCommand: string[];
  private updateUserCommand: string[];

  constructor(
    @Inject(PORO_KAKAO_CONFIG_OPTIONS)
    private readonly options: PoroKakaoModuleOptions,
    private readonly commandManagerService: CommandManagerService,
    private readonly userCustomCommandService: UserCustomCommandService,
    private readonly adminCommandService: AdminCommandService,
    private readonly roomsRepository: RoomsRepository,
    private readonly allowAdminRepository: AllowAdminRepository,
  ) {
    this.client = new TalkClient();
    this.adminEnable = true;
    this.api = null;
    this.allowRoom = [];
    this.allowAdmin = [];
    this.updateRoomCommand = ['addRoom', 'deleteRoom',];
    this.updateUserCommand = ['addUserId', 'deleteUserId',];
    this.init().then();
  }

  async init() {
    await this.login()
    await this.updateUser();
    await this.updateRoom();
    await this.addChattingEvent();
  }

  async login (): Promise<ChatBotOutput> {
    const {
      desktopName,
      deviceUUID,
      kakaoID,
      kakaoPW,
    }  = this.options;

    const loginForm = {
      email: kakaoID,
      password: kakaoPW,
      forced: true,
    };

    this.api = await AuthApiClient.create(desktopName, deviceUUID);
    let login = await this.api.login(loginForm);
    if (!login.success) {
      if (login.status === -100) {
        await this.deviceRegistration(loginForm);
        login = await this.api.login(loginForm);
      }
      return {
        success: false,
        message: `로그인 실패 ${login.status}`,
      }
      // throw new Error(`로그인에 실패하였습니다!`);
    }

    const clientResponse = await this.client.login(login.result);
    if (!clientResponse.success) {
      return {
        success: false,
        message: `로그인 실패 ${clientResponse.status}`,
      }
      // throw new Error(`로그인 실패 ${clientResponse.status}`);
    }

    return {
      success: true,
      message: `로그인 성공!`,
    }
  }

  async deviceRegistration (config: LoginDataDto) {
    if (this.api === null) {
      throw new Error(`MUST API Initialized`)
    }

    const { success: passCodeSuccess } = await this.api.requestPasscode(config);
    if (!passCodeSuccess) {
      throw new Error(`PassCode Fail`);
    }

    const inputInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const passcode = await new Promise<string>((resolve) => {
      return inputInterface.question('Enter passcode: ', resolve);
    });
    inputInterface.close();

    const { success: registerSuccess } = await this.api.registerDevice(config, passcode, true);
    if (!registerSuccess) {
      throw new Error(`Device registration failed`);
    }
  }

  async updateUser () {
    const allowAdmins = await this.allowAdminRepository.find();
    this.allowAdmin = allowAdmins.map((admin) => {
      return +admin.userId;
    });
  }

  async updateRoom () {
    const allowRooms = await this.roomsRepository.find();
    this.allowRoom = allowRooms.map((room) => {
      return room.roomId;
    });
  }

  async addChattingEvent () {
    this.client.on('user_join', (joinLog, channel, user, feed) => {
      channel.sendChat(`${user.nickname}님께서 방에 들어오셨습니다\n어서오세요~ 닉변 부탁드립니다.\n[소환사명/나이/포지션/지역]으로 맞춰주세요.`);
    });
    this.client.on('user_left', (leftLog, channel, user, feed) => {
      channel.sendChat(`${user.nickname}님께서 방을 나가셨습니다 ㅠ___ㅠ`);
    });
    // this.client.on('chat_deleted', (feedChatlog, channel, feed) => {
    //   const userInfo = channel.getUserInfo({userId: feedChatlog.sender.userId});
    //   if (userInfo === undefined) {
    //     return;
    //   }
    //   // console.log('feedChatlog', feedChatlog)
    //   // console.log('feed', feed)
    //   // console.log('channel', channel)
    //   channel.sendChat(`${userInfo.nickname}님의 채팅 삭제를 감지`);
    // });

    this.client.on('chat', async (data: TalkChatData, channel: TalkChannel) => {
      const msg = data.text;
      const room = channel.getDisplayName();
      const { store: {
        info: {
          channelId,
        }
      } } = channel;

      const {
        nickname,
        userId,
        profileURL,
        fullProfileURL,
        originalProfileURL,
      } = data.getSenderInfo(channel);

      const chatBotInput: ChatBotInput = {
        room,
        sender: nickname,
        msg,
        isGroupChat: false,
        image: '',
        kakaoSender: {
          userId: +userId,
          profileURL,
          fullProfileURL,
          originalProfileURL,
        },
        roomInfo: {
          channelId: +channelId,
        },
        talkChatData: data,
        talkChannel: channel,
      };

      if (msg[0] === '!') {
        if (msg === '!adminToggle') {
          this.adminEnable = !this.adminEnable;
          await channel.sendChat(`${this.adminEnable}`);
          return;
        }

        if (this.adminEnable && !this.allowAdmin.includes(+userId)) {
          return false;
        }

        const { success, message } = await this.adminCommandService.adminCommandManage(chatBotInput);
        if (success) {
          if (this.updateRoomCommand.includes(msg)) {
            await this.updateRoom();
          } else if (this.updateUserCommand.includes(msg)) {
            await this.updateUser();
          }
        }
        if (message) {
          await channel.sendChat(`${message}`);
        }
        return;
      }

      if (!this.allowRoom.includes(String(channelId))) {
        return;
      }

      if (msg[0] === '/') {
        const { message } = await this.commandManagerService.commandManage(chatBotInput);
        if (message) {
          await channel.sendChat(`${message}`);
        }
      } else {
        const { success, message } = await this.userCustomCommandService.userCustomCommandForKakao(chatBotInput);
        if (success) {
          await channel.sendChat(`${message}`);
        }
      }
    });
  }
}

