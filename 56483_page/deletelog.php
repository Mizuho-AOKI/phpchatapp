<?php
    echo "This is deletelog.php";

    $fp = fopen('message.log', 'r+');
    if (flock($fp, LOCK_SH)) {
        ftruncate($fp,0); // clear log
    }
    flock($fp, LOCK_UN);
    fclose($fp);
?>