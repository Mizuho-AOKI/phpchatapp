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
        readMessage();
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
            var outArray = new Array();
            var latestmsg = lines[0].split(',')

            if(latestmsg[3] !== 'Me' && $("div[name='msg_l']").eq(0).text() && latestmsg[5] 
               && ($("div[name='msg_l']").eq(0).text().indexOf(latestmsg[5]) == -1) && !isMuted() ){
                // play receive.mp3
                $("#RecvSound").prop('currentTime', 0);
                $("#RecvSound").prop('volume', 1);
                $("#RecvSound").get(0).play();
            }
            
            $('#messageTextBox').html(""); // clear msgbox

            for ( var i = 0; i < lines.length; i++ ) {

                // ignore blank line
                if ( lines[i] == '' ) {
                    continue;
                }
                
                outArray.push( lines[i] );
                
                var msg_ary = lines[i].split(',');

                // ここの引数変える
                if(msg_ary[3] == 'Me'){
                    $('#messageTextBox').append(Rmsg(msg_ary[0], msg_ary[1], msg_ary[2], msg_ary[3], msg_ary[5]));
                }else{
                    $('#messageTextBox').append(Lmsg(msg_ary[0], msg_ary[1], msg_ary[2], msg_ary[3], msg_ary[5]));
                }
            }
            return outArray;
        },
        function () {
            console.log("Error loading the message log.");
        }
    );
}

// Check received message every 1 seconds
$(document).ready(function() {
    readMessage();
    setInterval('readMessage()', 100000);
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
                            // $('#messageTextBox').append(msghtml);
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

function Lmsg(name, icon, color, sender, msg){

    msghtml = `
    <!-- Chat box (left) -->
    <div class="sb-box">
        <div class="icon-img icon-img-left">
        <img src="./media/icon.png" />
        </div><!-- /.icon-img icon-img-left -->
        <div class="icon-name icon-name-left">
            <span class="icon-name-left"> ${name} <br /> </span>
            <span class="icon-name-left overtablet-only"> ${sender} </span>
        </div>
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

function Rmsg(name, icon, color, sender, msg){

    msghtml = `
    <!-- Chat box (right) -->
    <div class="sb-box">
        <div class="icon-img icon-img-right">
            <img src="./media/icon.png" />
        </div><!-- /.icon-img icon-img-right -->
        <div class="icon-name icon-name-right">
            <span class="icon-name-right"> ${name} <br /> </span>
            <span class="icon-name-right overtablet-only" > ${sender} </span>
        </div>
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