<?php
return array(
    'DB_TYPE'	=>'mysql',
    'DB_HOST'	=>'localhost',
	'DB_NAME'   => 'todo', // 数据库名
	'DB_USER'   => 'eccom', // 用户名
	'DB_PWD'    => 'eccom', // 密码
    'DB_PORT'   => 3306, // 端口
    'DB_PREFIX'	=> '',
    'DB_CHARSET'=> 'utf8',
    'URL_MODEL'=>2,

    //debug trace
    'SHOW_PAGE_TRACE'	=> false,
    'TRACE_PAGE_TABS'=>array(
        'base'=>'基本',
        'file'=>'文件',
        'think'=>'流程',
        'error'=>'错误',
        'sql'=>'SQL',
        'debug'=>'调试',
        'user'=>'用户'
    ),

    'DATA_CACHE_TYPE'	=> 'memcache',
    'MEMCACHE_HOST'=>'192.168.51.209',
    'MEMCACHE_PORT'=>'12000',
    'DATA_CACHE_TIME'=>false,//永久保存

    'HTML_CACHE_ON'=>false, // 开启静态缓存

);
?>