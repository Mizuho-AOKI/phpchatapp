<?php
    $postmsg = array(
        "name"  => $_POST['name'],
        "icon"  => $_POST['icon'],
        "color" => $_POST['color']
    );
    $profile = json_encode( $postmsg , JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
    file_put_contents("profile.json" , $profile);
    echo "succeed"; 
?>
