const scriptName = "Aurora.js";

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

    const resourceUrl = "http://zoz0312.com:8822"; // test port: 8000
    const myRoom = [
        '롤키웨이(LoLky Way)',
        '오로라개발방'
    ];

    if (!myRoom.includes(room)) {
        return;
    }

    let svcCd = "/user-custom-command";

    const flag = msg.trim()[0] === "/";
    if (flag){
        svcCd = "/command-manager";
    }

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
}

/**
 * 아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
 */
function onCreate(savedInstanceState, activity) {
    var textView = new android.widget.TextView(activity);
    textView.setText("Hello, World!");
    textView.setTextColor(android.graphics.Color.DKGRAY);
    activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}