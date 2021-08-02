import {Inject, Injectable} from '@nestjs/common';
import {PORO_KAKAO_CONFIG_OPTIONS} from "../common/constants";
import {PoroKakaoModuleOptions} from "./poro-kakao.module";
import {
  AuthApiClient, KnownChatType, ReplyAttachment,
  TalkClient,
} from 'node-kakao';
import * as readline from 'readline';
import {replyEvent} from "./events/replyEvent";
import {TalkChatData} from "node-kakao/dist/talk/chat";
import {TalkChannel} from "node-kakao/dist/talk/channel";
import {CommandManagerService} from "../command-manager/command-manager.service";
import {UserCustomCommandService} from "../user-custom-command/services/user-custom-command.service";
import {AllowRoomRepository} from "./repositories/allow-room.repository";
import {AllowAdminRepository} from "./repositories/allow-admin.repository";

interface LoginDataDto {
  email: string;
  password: string;
  forced: boolean;
}

@Injectable()
export class PoroKakaoService {
  private client: TalkClient;
  private api: AuthApiClient;
  private allowRoom: number[];
  private allowAdmin: number[];

  constructor(
    @Inject(PORO_KAKAO_CONFIG_OPTIONS)
    private readonly options: PoroKakaoModuleOptions,
    private readonly commandManagerService: CommandManagerService,
    private readonly userCustomCommandService: UserCustomCommandService,
    private readonly allowRoomRepository: AllowRoomRepository,
    private readonly allowAdminRepository: AllowAdminRepository,
  ) {
    this.client = new TalkClient();
    this.api = null;
    this.allowRoom = [];
    this.allowAdmin = [];
    this.init().then();
  }

  async init() {
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
      throw new Error(`로그인에 실패하였습니다!`);
    }

    const clientResponse = await this.client.login(login.result);
    if (!clientResponse.success) {
      throw new Error(`로그인 실패 ${clientResponse.status}`);
    }


    const allowRooms = await this.allowRoomRepository.find();
    this.allowRoom = allowRooms.map((room) => {
      return room.roomId;
    });

    const allowAdmins = await this.allowAdminRepository.find();
    this.allowAdmin = allowAdmins.map((admin) => {
      return admin.userId;
    });

    this.addChattingEvent();
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

  async addChattingEvent () {
    this.client.on('chat', async (data: TalkChatData, channel: TalkChannel) => {
      const msg = data.text;

      const room = channel.getDisplayName();
      const { store: {
        info: {
          channelId,
        }
      } } = channel;

      if (!this.allowRoom.includes(+channelId)) {
        return;
      }

      const {
        nickname,
        userId,
        profileURL,
        fullProfileURL,
        originalProfileURL,
      } = data.getSenderInfo(channel);

      const chatBotInput = {
        room,
        sender: nickname,
        msg: data.text,
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
        }
      };

      if (msg[0] === '/') {
        const { message } = await this.commandManagerService.commandManage(chatBotInput);
        if (message) {
          channel.sendChat(`${message}`);
        }
      } else if (msg[0] === '!') {
        if (this.allowAdmin.includes(+userId)) {

        }
        replyEvent(data, channel);
      } else {
        const { success, message } = await this.userCustomCommandService.userCustomCommandForKakao(chatBotInput);
        if (success) {
          channel.sendChat(`${message}`);
        }
      }
    });
  }
}

