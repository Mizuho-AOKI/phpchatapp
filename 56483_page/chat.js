// ref: https://www.taru-net.jp/tec/javascript-chat/

function readMessage() {
    // load ./message.log
    $.ajax({
        type: 'post',
        url: './message.log'
        })
    // set the permission of reading and writing ./message.log
    .then(
        function (data) {
            log = data.replace(/[\n\r]/g, "<br />");
            $('#messageTextBox').html(log);
        },
        function () {
            alert("Error loading the message log.");
        }
    );
}


function writeMessage() {
    // send message to the target IP address.
    $.ajax({
        type: 'post',
        url: 'http://192.168.13.123:56308/receiver.php',
        data: {
            'message' : $("#message").val()
        }
    })
    .then(
        function (data) {
            readMessage();
            $("#message").val('');
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