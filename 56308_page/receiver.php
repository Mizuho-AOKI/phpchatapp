<?php

    echo "This is receiver.php at 56308 port.";

    // avoid the cross-domain constraint
    header("Access-Control-Allow-Origin: *");  

    $count = 0;
    $strMsg   = '';

    //// xmlhttprequest is invalid on cross-domain communication
    // $request = '';
    // if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
    //     $request = strtolower($_SERVER['HTTP_X_REQUESTED_WITH']);
    // }
    // if ($request !== 'xmlhttprequest') {
    //     exit;
    // }
 
    $message = '';
    $sender  = '';
    if (isset($_POST['message']) && is_string($_POST['message'])) {
        $message = htmlspecialchars($_POST['message'], ENT_QUOTES);
        $sender_ip = $_SERVER['REMOTE_ADDR'];  
    }
    if (isset($_POST['sender']) && is_string($_POST['sender'])) {
        $sender = htmlspecialchars($_POST['sender'], ENT_QUOTES);
    }

    // message was invalid.
    if ($message == '' || $sender == '') {
        exit;
    }


    $fp = fopen('message.log', 'r');
    if (flock($fp, LOCK_SH)) {
        while (!feof($fp)) {
            if ($count > 200) {
                break;
            }
            $strMsg = $strMsg . fgets($fp);
            $count = $count + 1;
        }
    }
    flock($fp, LOCK_UN);
    fclose($fp);

    $strMsg = $sender . ',' . date("Y-m-d H:i:s") . ',' . $message . "\n" . $strMsg;
    file_put_contents('message.log', $strMsg, LOCK_EX);
?>
