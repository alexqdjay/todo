<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-22
 * Time: 下午3:54
 * To change this template use File | Settings | File Templates.
 */

require('Lib/Service/LoginUtil.php');

class LoginCheckService {

    public static function registUser($id,$name) {
        session_unset();
        $ts = time();
        $hash = login_encode($name,$id,$ts);
        $_SESSION[$hash] = $ts;
        $_SESSION['name'] = $name;
        $_SESSION['uid'] = $id;
        setcookie('hash',$hash,time()+60*60*24*30,'/',$_SERVER['HTTP_HOST']);
        setcookie('uu',$name,time()+60*60*24*30,'/',$_SERVER['HTTP_HOST']);
    }

    public static function checkLogin() {
        $hash = $_COOKIE['hash'];
        if(isset($hash)) {
            $session_ts = $_SESSION[$hash];
            $param = login_decode($hash);
            if(isset($session_ts) && self::checkUser($param['ts'],$session_ts)) {
                self::registUser($param['id'],$param['name']);
                return true;
            }
        }
        return false;
    }

    private static function checkUser($ts,$session_ts) {
        if(isset($ts)) {
            if($ts == $session_ts) {
                if(time() - $ts <= 3600) {
                    return true;
                }
            }
        }
        return false;
    }

}