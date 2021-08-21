<?php
// ref: https://log.vavevoo.com/page/contents/c-099-php-directory-tree.html

function get_dir($path){
    $list = scandir($path);
    $dir = array(); $length = count($list);
    for($i=0; $i<$length; $i++){
    if($list[$i] != '.' && $list[$i] != '..' && $list[$i] != '.git'){
    if(is_dir($path.'/'.$list[$i])){
    if(null != ($a = get_dir($path.'/'.$list[$i]))){
    array_push($dir, array($list[$i],$a));
    }else{
    array_push($dir, $list[$i]);
    }
    }else{
    array_push($dir, $list[$i]);
    }
    }
    }
    return $dir;
}

function list_dir($dir, $path){
    if(null != $dir){
    $list = '<ul>'; $length = count($dir);
    for($i=0; $i<$length; $i++){
    if(is_array($dir[$i])){
    $list .= '<li>'.$dir[$i][0].list_dir($dir[$i][1], $path.'/'.$dir[$i][0]).'</li>';
    }else{
    $list .= '<li><a href="'.$path.'/'.$dir[$i].'">'.$dir[$i].'</a></li>';
    }
    }
    $list .= '</ul>';
    return $list;
    }
}

// (要修正) 処理を条件分岐
// POSTで合言葉来たら, index.htmlからの要求だと捉えて処理を終えたjsonで返してreturn;
// 合言葉が合わなかったら通常のアクセス. 今の通りlist_dirでhtml形式で出力
// html形式の出力ももっと見栄えよく. → このままで良い.

// print_r(get_dir('.'));

$path = '.';
$dir = get_dir($path);
echo list_dir($dir, $path);

?>