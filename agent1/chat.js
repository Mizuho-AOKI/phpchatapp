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
            var max_msg_num = 200;
            var text  = data.replace(/\r\n|\r/g, "\n");
            var lines = text.split( '\n' );
            var latestmsg = lines[0].split(',')
            var firstloopFlag = true;

            // get latest id of message.log
            var log_latest_id = latestmsg[0] ? latestmsg[0] : 0;
            // get latest id of web site
            var page_latest_id = typeof $("div[name='msg']").eq(0).attr('id') === "undefined" ? 0 : $("div[name='msg']").eq(0).attr('id');

            for ( var i = log_latest_id-page_latest_id-1; i >= 0; i--) {
                // ignore blank line
                if ( lines[i] == '' ) {
                    continue;
                }
                if(page_latest_id >= max_msg_num){
                    $("div[name='msg']:last").remove();
                }
                if (firstloopFlag && !isMuted()){ // play sound on the first loop
                    $("#RecvSound").prop('currentTime', 0);
                    $("#RecvSound").prop('volume', 1);
                    $("#RecvSound").get(0).play();
                    firstloopFlag = false;
                }
                
                // split msg and save each element as an array
                // contents : ## id, name, icon, color, sender, date, message ##
                var msg_ary = lines[i].split(',');

                if(msg_ary[4] == 'Me'){
                    $('#messageTextBox').prepend(Rmsg(msg_ary[0], msg_ary[1], msg_ary[2], msg_ary[3], msg_ary[4], msg_ary[6]));
                }else{
                    $('#messageTextBox').prepend(Lmsg(msg_ary[0], msg_ary[1], msg_ary[2], msg_ary[3], msg_ary[4], msg_ary[6]));
                }
                // change icon styles
                inlineSvg(`div[name='svg-${msg_ary[2]}-${msg_ary[3]}'] img`, msg_ary[3],`./media/icons/${msg_ary[2]}.svg`);
            }
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

function Lmsg(id, name, icon, color, sender, msg){

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
                ${msg}
            </div><!-- /.sb-txt sb-txt-left -->
        </div><!-- /.sb-side sb-side-left -->
    </div><!-- /.sb-box -->
    <!-- / Chat box (left) -->
    `;
    return msghtml;
}

function Rmsg(id, name, icon, color, sender, msg){

    msghtml = `
    <!-- Chat box (right) -->
    <div name="msg" id=${id} class="sb-box">
        <div name="svg-${icon}-${color}" class="icon-img icon-img-right">
            <img src="./media/icons/${icon}.svg" />
        </div><!-- /.icon-img icon-img-right -->
        <div class="icon-name icon-name-right">
            <span class="icon-name-right"> ${name} <br /> </span>
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