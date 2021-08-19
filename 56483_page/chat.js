// ref: https://www.taru-net.jp/tec/javascript-chat/


function deleteMessage() {
    msg = "Delete all messages?";
    if(window.confirm(msg)){
        readMessage();
        // call deletelog.php via get request.
        $.ajax({
            type: 'get',
            url: './deletelog.php',
        })
        .then(
            function (deleteflag) {
                if(deleteflag=="succeed"){
                    // play sound.mp3
                    $("#DeleteSound").prop('volume', 1);
                    $("#DeleteSound").get(0).play();
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
            var outArray = new Array();


            console.log(`i=${i}, msg_ary[2] = ${lines[0].split(',')[2]} ,lines.length=${lines.length}`);
            console.log($("div[name='msg_l']").eq(0).text())

            var latestmsg = lines[0].split(',')

            if(latestmsg[0] !== 'Me' && ($("div[name='msg_l']").eq(0).text().indexOf(lines[0].split(',')[2]) == -1) && $("div[name='msg_l']").eq(0).text()){
                // play sound.mp3
                console.log("kokokoko!!!");
                $("#RecvSound").prop('volume', 1);
                $("#RecvSound").get(0).play();
            }
            
            $('#messageTextBox').html(""); // delete msgs
            for ( var i = 0; i < lines.length; i++ ) {

                // ignore blank line
                if ( lines[i] == '' ) {
                    console.log(`now i=${i}, continue`)
                    continue;
                }
                
                outArray.push( lines[i] );
                
                var msg_ary = lines[i].split(',');

                // lines[-1]が現状ページトップのメッセージと違う & lines[-1]がMeからではない
                // ならば, 受信音を鳴らす.

                // if(i == 0 && ($("div[name='msg_l']").eq(0).text().indexOf(msg_ary[2]) == -1)){
                //     // play sound.mp3
                //     $("#RecvSound").prop('volume', 1);
                //     $("#RecvSound").get(0).play();
                // }

                if(msg_ary[0] == 'Me'){
                    $('#messageTextBox').append(Rmsg(msg_ary[0], msg_ary[2]));
                }else{
                    // check if the latest msg has updated or not.
                    // if( i == lines.length-1 && msg_ary[2] !== ""){
                    //     // play sound.mp3
                    //     $("#Sound").prop('volume', 0.1);
                    //     $("#Sound").get(0).play();
                    // }

                    console.log(`i=${i}, msg_ary[2] = ${msg_ary[2]} ,lines.length=${lines.length}`);
                    console.log($("div[name='msg_l']").eq(0).text())
                    // console.log(lines.length)
                    // if( i == lines.length-2 ){
                    //     // play sound.mp3
                    //     console.log(msg_ary[2]);
                    //     console.log($("div[name='msg_l']").eq(0).text());
                    // }

                    // if( i == lines.length-1 && msg_ary[2] != $("div[name='msg_l']").eq(0).text() ){
                    //     // play sound.mp3
                    //     window.alert("hello!");
                    //     $("#RecvSound").prop('volume', 1);
                    //     $("#RecvSound").get(0).play();
                    // }
                    $('#messageTextBox').append(Lmsg(msg_ary[0], msg_ary[2]));
                }
            }



            // if(renewed){
                // play sound.mp3
                // $("#Sound").prop('volume', 0.1);
                // $("#Sound").get(0).play();
            // }


            return outArray;
        },
        function () {
            // alert("Error loading the message log.");
        }
    );
}


function writeMessage() {

    // get target ip address
    var targetip = $("#targetip").val();

    // get my ip address
    var myip = $("#myip").text();

    // send message to the target IP address.
    $.ajax({
        type: 'post',
        url: `http://${targetip}/receiver.php`,
        data: {
            'message' : $("#message").val(),
            'sender'  : `http://${myip}`
        }
    })
    .then(
        function(result){
            if(result=="succeed"){
                $.ajax({
                    type: 'post',
                    url: './receiver.php',
                    data: {
                        'message' : $("#message").val(),
                        'sender'  : "Me"
                    }
                })
                .then(
                    function (saveflag) {
                        if(saveflag=="succeed"){
                            readMessage();
                            $("#message").val('');
                            $('#messageTextBox').append(msghtml);
                            // play sound.mp3
                            $("#SendSound").prop('volume', 1);
                            $("#SendSound").get(0).play();
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
    <!-- Chat box (left) -->
    <div class="sb-box">
        <div class="icon-img icon-img-left">
        <img src="./icon.png" />
        </div><!-- /.icon-img icon-img-left -->
        <div class="icon-name icon-name-left">${sender}</div>
        <div class="sb-side sb-side-left">
            <div name="msg_l" class="sb-txt sb-txt-left">
                ${msg}
            </div><!-- /.sb-txt sb-txt-left -->
        </div><!-- /.sb-side sb-side-left -->
    </div><!-- /.sb-box -->
    <!-- / Chat box (left) -->
    `;

    return msghtml;
}

function Rmsg(sender, msg){

    msghtml = `
    <!-- Chat box (right) -->
    <div class="sb-box">
        <div class="icon-img icon-img-right">
            <img src="./icon.png" />
        </div><!-- /.icon-img icon-img-right -->
        <div class="icon-name icon-name-right">${sender}</div>
        <div class="sb-side sb-side-right">
            <div name="msg_r" class="sb-txt sb-txt-right">
                ${msg}
            </div><!-- /.sb-txt sb-txt-right -->
        </div><!-- /.sb-side sb-side-right -->
    </div><!-- /.sb-box -->
    <!-- / Chat box (right) -->
    `;

    return msghtml;
}