<?php
    // avoid the cross-domain constraint
    header("Access-Control-Allow-Origin: *");  
    // avoid the cross-origin resource sharing constraint
    header('Access-Control-Allow-Credentials: true');

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

    // keep messages as local variables
    $name = '';
    $icon = '';
    $color = '';
    $message = '';
    $sender  = '';
    if (isset($_POST['name']) && is_string($_POST['name'])) {
        $name = htmlspecialchars($_POST['name'], ENT_QUOTES);
    }
    if (isset($_POST['icon']) && is_string($_POST['icon'])) {
        $icon = htmlspecialchars($_POST['icon'], ENT_QUOTES);
    }
    if (isset($_POST['color']) && is_string($_POST['color'])) {
        $color = htmlspecialchars($_POST['color'], ENT_QUOTES);
    }
    if (isset($_POST['message']) && is_string($_POST['message'])) {
        $message = $_POST['message']; // non-sanitize
        // $message = htmlspecialchars($_POST['message'], ENT_QUOTES); //sanitized
        $sender_ip = $_SERVER['REMOTE_ADDR'];  
    }
    if (isset($_POST['sender']) && is_string($_POST['sender'])) {
        $sender = htmlspecialchars($_POST['sender'], ENT_QUOTES);
    }
    // if message was invalid :
    if ($name == '' || $icon == '' || $color == '' || $message == '' || $sender == '') {
        exit;
    }

    // 1. receiver.phpがpost受けたとき, 新着のメッセージに対してidをつける
    // 2. jsはページに残る情報から, 最新のidを読み取る. 新着のメッセージだけprependして更新
    // 3. idが200以上の場合, 増やした分だけ古いのを減らす処理も必要.
    // last()とかslice()とかうまく使うと良さそう. https://www.buildinsider.net/web/jqueryref/075


    $previous_id = 0;
    $fp = fopen('message.log', 'r');
    if (flock($fp, LOCK_SH)) {
        while (!feof($fp)) {
            if ($count > 200) {
                break;
            }
            $strMsg = $strMsg . fgets($fp);
            if($count==0){
                $elements = explode(",", $strMsg);
                $previous_id = (int)$elements[6];
            }
            $count = $count + 1;
        }
        // $file = file('message.log');
        // $previous_msg = $file[1]; // get second latest msg log 
        // if($previous_msg!=''){
        //     $elements = explode(",",$previous_msg);
        //     $previous_id = $elements[6];
        // }else{
        //     $previous_id = 0;
        // }
    }
    $latest_id = $previous_id + 1;
    flock($fp, LOCK_UN);
    fclose($fp);
    // update $strMsg 
    $strMsg = $name . ',' . $icon . ',' . $color . ',' . $sender . ',' . date("Y-m-d H:i:s") . ',' . $message . ',' . $latest_id .",\n". $strMsg;
    file_put_contents('message.log', $strMsg, LOCK_EX);

    echo "succeed";
?>
