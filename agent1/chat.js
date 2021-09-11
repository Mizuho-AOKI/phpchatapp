// ref: https://www.taru-net.jp/tec/javascript-chat/

// Check if it is muted or not.
function isMuted(){
    if($("#volumeon").hasClass('volume-active')){
        // not mute
        return false;
    }else{
        // mute
        return true;
    }
}

function deleteMessage() {
    msg = "Delete all messages?";
    if(window.confirm(msg)){
        // readMessage();
        $('#messageTextBox').html(""); // clear msgbox
        // call deletelog.php via get request.
        $.ajax({
            type: 'get',
            url: './deletelog.php',
        })
        .then(
            function (deleteflag) {
                if(deleteflag=="succeed"){
                    if(!isMuted()){
                        // play delete.mp3
                        $("#DeleteSound").prop('currentTime', 0);
                        $("#DeleteSound").prop('volume', 1);
                        $("#DeleteSound").get(0).play();
                    }
                }
            },
            function () {
                alert("Error deleting the message log");
            }
        );
    }
}

function readMessage() {
    // load ./message.log
    $.ajax({
        type: 'post',
        url: './message.log'
        })
    // Please set the permission of reading and writing ./message.log by yourself.
    .then(
        function(data) {
            var text  = data.replace(/\r\n|\r/g, "\n");
            var lines = text.split( '\n' );
            // var outArray = new Array();
            var latestmsg = lines[0].split(',')
            var firstloopFlag = true;
            // やっぱり, メッセージが更新されたら, っていう処理は必要. 
            // 更新されたときだけhtmlを(追加分だけ)書き加える. 音もその時鳴らす.
            // ログに残るメッセージが最大200件であることに注意しながら. → 超えたら, 追加だけでなくremoveする処理も必要！
            // → これは, idが200超えたら, prependした個数分下から消す, てな感じで後付けでできそう. 200をベタ書きしないで指定できるとよい.
            // ログにidを残す. idをメッセージの<div class="sb-box">タグに埋め込む (そのままidでもいいし, nameでも良い) id参照が最も高速らしい.
            // readmessageでは, まず現存ページを検索, 一番上のメッセージのidを取得
            // messagelogの更新分だけlinesを切り出して古い方からfor回してprepend()

            // 新しいver.
            // latest messageのidを取得. 
            var log_latest_id = latestmsg[6] ? latestmsg[6] : 0;
            console.log(`latest_id from log is : ${log_latest_id}`);

            var page_latest_id = typeof $("div[name='msg']").eq(0).attr('id') === "undefined" ? 0 : $("div[name='msg']").eq(0).attr('id');
            // ページに表示されている最新のidを取得(eq(0)のid値)
            console.log(`latest_id from page is : ${page_latest_id}`)

            // idは1始まり. eq()は0始まりであることに注意
            // logの最新id - pageの最新id 分だけメッセージを追加する
            // ※ idが200?を超えたらその分だけ削除する処理もつける.
            
            // 新しいver. デバッグ中
            // if(latestmsg[3] !== 'Me' && $("div[name='msg_l']").eq(0).text() && latestmsg[5] 
            //    && ($("div[name='msg_l']").eq(0).text().indexOf(latestmsg[5]) == -1) && !isMuted() ){
            //     // play receive.mp3
            //     // 音はif文判断いらないので, 最初ループでのみ流れるよう設定
            //     $("#RecvSound").prop('currentTime', 0);
            //     $("#RecvSound").prop('volume', 1);
            //     $("#RecvSound").get(0).play();
            // }
            
            // $('#messageTextBox').html(""); // clear msgbox
            // msgbox_html = '';
            for ( var i = log_latest_id-page_latest_id-1; i >= 0; i--) {
                // ignore blank line
                if ( lines[i] == '' ) {
                    console.log("くうはくだよ")
                    continue;
                }

                if (firstloopFlag){
                    $("#RecvSound").prop('currentTime', 0);
                    $("#RecvSound").prop('volume', 1);
                    $("#RecvSound").get(0).play();
                    firstloopFlag = false;
                }
                
                // outArray.push( lines[page_latest_id + i] );
                
                var msg_ary = lines[i].split(',');

                if(msg_ary[3] == 'Me'){
                    $('#messageTextBox').prepend(Rmsg(msg_ary[0], msg_ary[1], msg_ary[2], msg_ary[3], msg_ary[5], msg_ary[6]));
                }else{
                    $('#messageTextBox').prepend(Lmsg(msg_ary[0], msg_ary[1], msg_ary[2], msg_ary[3], msg_ary[5], msg_ary[6]));
                }
                // change icon styles
                inlineSvg(`div[name='svg-${msg_ary[1]}-${msg_ary[2]}'] img`, msg_ary[2],`./media/icons/${msg_ary[1]}.svg`);
            }
            // return outArray;


            // 古いver. ここまるごと書き換える.
            // if(latestmsg[3] !== 'Me' && $("div[name='msg_l']").eq(0).text() && latestmsg[5] 
            //    && ($("div[name='msg_l']").eq(0).text().indexOf(latestmsg[5]) == -1) && !isMuted() ){
            //     // play receive.mp3
            //     $("#RecvSound").prop('currentTime', 0);
            //     $("#RecvSound").prop('volume', 1);
            //     $("#RecvSound").get(0).play();
            // }
            
            // $('#messageTextBox').html(""); // clear msgbox
            // msgbox_html = '';
            // for ( var i = 0; i < lines.length; i++ ) {
            //     // ignore blank line
            //     if ( lines[i] == '' ) {
            //         continue;
            //     }
                
            //     outArray.push( lines[i] );
                
            //     var msg_ary = lines[i].split(',');

            //     if(msg_ary[3] == 'Me'){
            //         $('#messageTextBox').append(Rmsg(msg_ary[0], msg_ary[1], msg_ary[2], msg_ary[3], msg_ary[5], msg_ary[6]));
            //     }else{
            //         $('#messageTextBox').append(Lmsg(msg_ary[0], msg_ary[1], msg_ary[2], msg_ary[3], msg_ary[5], msg_ary[6]));
            //     }
            //     // change icon styles
            //     inlineSvg(`div[name='svg-${msg_ary[1]}-${msg_ary[2]}'] img`, msg_ary[2],`./media/icons/${msg_ary[1]}.svg`);
            // }
            // // return outArray;
        },
        function () {
            console.log("Error loading the message log.");
        }
    );
}

// Check received message every 1 seconds
$(document).ready(function() {
    readMessage();
    setInterval('readMessage()', 1000);
});

function writeMessage() {

    // get target ip address
    var targetip = $("#targetip").val();

    // get my ip address
    var myip = $("#myip").text();

    // send message to the target IP address.
    $.ajax({
        type: 'post',
        url: `${location.protocol}//${targetip}/receiver.php`,
        data: {
            'name'    : $("form[name='profile'] #usernameinput").val(),
            'icon'    : $("form[name='profile'] select").val(),
            'color'   : $("form[name='profile'] #colorpicker").val(),
            'message' : $("#message").val(),
            'sender'  : `${location.protocol}//${myip}`
        }
    })
    .then(
        function(result){
            if(result=="succeed"){
                $.ajax({
                    type: 'post',
                    url: './receiver.php',
                    data: {
                        'name'    : $("form[name='profile'] #usernameinput").val(),
                        'icon'    : $("form[name='profile'] select").val(),
                        'color'   : $("form[name='profile'] #colorpicker").val(),
                        'message' : $("#message").val(),
                        'sender'  : "Me"
                    }
                })

                .then(
                    function (saveflag) {
                        if(saveflag=="succeed"){
                            readMessage();
                            $("#message").val('');
                            $("#message").focus();
                            if(!isMuted()){
                                // play send.mp3
                                $("#SendSound").prop('currentTime', 0);
                                $("#SendSound").prop('volume', 1);
                                $("#SendSound").get(0).play();
                            }
                        }
                    },
                    function () {
                        alert("Error saving the message : " + $("#message").val() +"");
                    }
                );
            }
        },
        function(){
            window.alert("Error sending the message.");
            $("#targetip").focus();
        }
    );
}

function Lmsg(name, icon, color, sender, msg, id){

    msghtml = `
    <!-- Chat box (left) -->
    <div name="msg" id=${id} class="sb-box">
        <div name="svg-${icon}-${color}" class="icon-img icon-img-left">
            <img src="./media/icons/${icon}.svg" />
        </div><!-- /.icon-img icon-img-left -->
        <div class="icon-name icon-name-left">
            <span class="icon-name-left"> ${name} <br /> </span>
            <span class="icon-name-left overtablet-only"> ${sender} </span>
        </div>
        <div class="sb-side sb-side-left">
            <div name="msg_l" class="sb-txt sb-txt-left">
                ${id}${msg}
            </div><!-- /.sb-txt sb-txt-left -->
        </div><!-- /.sb-side sb-side-left -->
    </div><!-- /.sb-box -->
    <!-- / Chat box (left) -->
    `;
    return msghtml;
}

function Rmsg(name, icon, color, sender, msg, id){

    msghtml = `
    <!-- Chat box (right) -->
    <div name="msg" id=${id} class="sb-box">
        <div name="svg-${icon}-${color}" class="icon-img icon-img-right">
            <img src="./media/icons/${icon}.svg" />
        </div><!-- /.icon-img icon-img-right -->
        <div class="icon-name icon-name-right">
            <span class="icon-name-right"> ${name} <br /> </span>
            <span class="icon-name-right overtablet-only" > ${sender} </span>
        </div>
        <div class="sb-side sb-side-right">
            <div name="msg_r" class="sb-txt sb-txt-right">
                ${id}${msg}
            </div><!-- /.sb-txt sb-txt-right -->
        </div><!-- /.sb-side sb-side-right -->
    </div><!-- /.sb-box -->
    <!-- / Chat box (right) -->
    `;

    return msghtml;
}