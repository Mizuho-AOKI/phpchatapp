<?php

// ref: http://blog.loadlimits.info/2012/04/php%E3%81%8B%E3%82%89arp%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB%E3%82%92%E5%8F%82%E7%85%A7%E3%81%99%E3%82%8B/

// 可視化 https://32877.info/view/336

$table = array();
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    exec('arp -a', $output); // for Windows
}
else {
    exec('/usr/sbin/arp -a -n', $output); // for Linux(debian)
}

$i = 0;
foreach ($output as $line) {
    if (preg_match('/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}).*([0-9a-f]{2}[\-:][0-9a-f]{2}[\-:][0-9a-f]{2}[\-:][0-9a-f]{2}[\-:][0-9a-f]{2}[\-:][0-9a-f]{2})/i', $line, $matches)) {
        $ip = $matches[1];
        $mac = strtoupper(str_replace(array('-', ':'), '', $matches[2]));
        // $table[$mac] = $ip;
        // $element = array();
        // $element = array('id'=>$i,
                        //  'ip'=>$ip, 
                        //  'mac'=>$mac);
        // $table["host"] = array_merge($table, $element);
        $table[$i] = array('id'=>$i,
                           'ip'=>$ip, 
                           'mac'=>$mac);
        // $table["agents"] = array('id'=>$i,
        //                    'ip'=>$ip, 
        //                    'mac'=>$mac);

        echo $i;
        var_dump($table);
        echo "<br /><br /><br />";
        $i++;
    }
}

var_dump($table);

echo "<br /><br /><br />";

$json = json_encode( $table , JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);

echo $json;

echo "<br /><br /><br />";

// var_dump( $_SERVER );

$server_info = json_encode( $_SERVER , JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
echo $server_info;


echo "<br /><br /><br />";

echo $_SERVER[ 'SERVER_ADDR' ];

?>