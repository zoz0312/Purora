const scriptName = "Purora.js";

/**
 * (string) room // 메시지를 받은 방 이름
 * (String) mgs // 메시지
 * (string) sender // 전송자
 * (boolean) isGroupChat // 단체 채팅방 여부
 * (void) replier.reply(message) // 응답용 객체
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64() // 전송자 프로필 이미지를 Base64로 인코딩하여 반환
 * (string) packageName // 메시지를 받은 메신저의 패키지명
 */
function response (room, msg, sender, isGroupChat, replier, imageDB, packageName) {

    const resourceUrl = "http://192.168.219.200"; // test port: 8000
    const myRoom = [
        '',
    ];

    if (!myRoom.includes(room)) {
        return;
    }
    let svcCd = "/user-custom-command";

    const flag = msg.trim()[0] === "/";
    if (flag){
        svcCd = "/command-manager";
    }

    try {
        const res = org.jsoup.Jsoup.connect(resourceUrl + svcCd)
          .data('room', room)
          .data('msg', msg.trim())
          .data('sender', sender.split('/')[0])
          .data('isGroupChat', isGroupChat)
          .ignoreHttpErrors(true)
          .ignoreContentType(true)
          .post()
          .wholeText();

        const json = JSON.parse(res);
        if (json.success || flag) {
            replier.reply(json.message);
        }
    } catch (error) {
        if (flag) {
            replier.reply('서버와 통신이 안됩니다\n잠시만 기다려주세요 ㅠ.ㅜ');
        }
    }
}

function onCreate(savedInstanceState, activity) {}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}