// ref: https://www.taru-net.jp/tec/javascript-chat/

function readMessage() {
    // load ./message.log
    $.ajax({
        type: 'post',
        url: './message.log'
        })
    // Please set the permission of reading and writing ./message.log by yourself.
    .then(
        // function (data) {
        //     log = data.replace(/[\n\r]/g, "<br />");
        //     $('#messageTextBox').html(log);
        // },
        function(data) {
            var text  = data.replace(/\r\n|\r/g, "\n");
            var lines = text.split( '\n' );
            var outArray = new Array();
            
            $('#messageTextBox').html(""); // delete msgs
            for ( var i = 0; i < lines.length; i++ ) {
                // ignore blank line
                if ( lines[i] == '' ) {
                    continue;
                }
                
                outArray.push( lines[i] );
                
                var msg_ary = lines[i].split(',');
                if(msg_ary[0] == 'Me'){
                $('#messageTextBox').append(Rmsg(msg_ary[0], msg_ary[2]));
                }else{
                $('#messageTextBox').append(Lmsg(msg_ary[0], msg_ary[2]));
                }
            }

            //// サウンドを実装予定
            // if(soundFlag){
            //     $("#sound").Play();
            //     var music = new Audio('sound.mp3');
            //     music.play();  // 再生
            // }

            return outArray;
        },
        function () {
            // alert("Error loading the message log.");
        }
    );
}


function writeMessage() {

    // send message to the target IP address.
    $.ajax({
        type: 'post',
        url: './receiver.php',
        data: {
            'message' : $("#message").val(),
            'sender'  : "Me"
        }
    })
    .then(
        function (data) {
            // 自分のセリフ出力処理入れる
            readMessage();
            $("#message").val('');
            $('#messageTextBox').append(msghtml);
        },
        function () {
            alert("Error sending the message : " + $("#message").val() +"");
        }
    );

    // send message to the target IP address.
    $.ajax({
        type: 'post',
        url: 'http://192.168.13.123:56308/receiver.php',
        data: {
            'message' : $("#message").val(),
            'sender'  : "http://192.168.13.123:56483"
        }
    })
    .then(
        function (data) {
            // 自分のセリフ出力処理入れる
            readMessage();
            $("#message").val('');
            $('#messageTextBox').append(msghtml);
        },
        function () {
            alert("Error sending the message : " + $("#message").val() +"");
        }
    );
}

// check received message every 1 seconds
$(document).ready(function() {
    readMessage();
    setInterval('readMessage()', 1000);
});


function Lmsg(sender, msg){
    msghtml = `
    <!-- 吹き出し（左）の始まり -->
    <div class="sb-box">
      <div class="icon-img icon-img-left">
        <img src="./icon.png" />
      </div><!-- /.icon-img icon-img-left -->
      <div class="icon-name icon-name-left">` + sender + `</div>
      <div class="sb-side sb-side-left">
          <div class="sb-txt sb-txt-left"> `
    + msg +  
    `    </div><!-- /.sb-txt sb-txt-left -->
      </div><!-- /.sb-side sb-side-left -->
    </div><!-- /.sb-box -->
    <!-- 吹き出し（左）の終わり -->
    `;

    return msghtml;
}

function Rmsg(sender, msg){

    msghtml = `
    <!-- 吹き出し（右）の始まり -->
    <div class="sb-box">
        <div class="icon-img icon-img-right">
            <img src="./icon.png" />
        </div><!-- /.icon-img icon-img-right -->
        <div class="icon-name icon-name-right">`+ sender +`</div>
        <div class="sb-side sb-side-right">
            <div class="sb-txt sb-txt-right">
                `+ msg +`
            </div><!-- /.sb-txt sb-txt-right -->
        </div><!-- /.sb-side sb-side-right -->
    </div><!-- /.sb-box -->
    <!-- 吹き出し（右）の終わり -->
    
    `
    return msghtml;
}