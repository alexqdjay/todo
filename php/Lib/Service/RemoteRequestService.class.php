<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-30
 * Time: 下午4:35
 * To change this template use File | Settings | File Templates.
 */

class RemoteRequestService {

    public static function remoteRequest_GET($path) {
        $fp = fopen(C('APP_URL').$path,'r');
        stream_get_meta_data($fp);
        $res = "";
        while(!feof($fp)) {
            $res .= fgets($fp,1024);
        }
        fclose($fp);
        return $res;
    }

}