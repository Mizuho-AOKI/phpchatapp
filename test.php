<?php
    echo '<h2> PHP is working. </h2>';

    echo "<br /><br />";
    echo "<h3> Server IP </h3>";
    echo $_SERVER[ 'SERVER_ADDR' ] . ":" .$_SERVER[ 'SERVER_PORT' ];

    echo "<br /><br />";
    echo "<h3> Server info </h3>";
    echo "<pre>";
    echo json_encode( $_SERVER , JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    echo "</pre>";
?>