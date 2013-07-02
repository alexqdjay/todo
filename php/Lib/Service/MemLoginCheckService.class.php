<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-6
 * Time: 下午2:23
 * To change this template use File | Settings | File Templates.
 */

require('Lib/Service/LoginUtil.php');

class MemLoginCheckService {

    public static function registUser($u,$inCookie=true) {
        session_unset();
        $ts = time();
        $hash = login_encode($u['username'],$u['id'],$ts);
        $md5 = hash('md5',$u['username']."_".$u['id']);
        $data = array(
            'id'=>$u['id'],
            'name'=>$u['name'],
            'username'=>$u['username'],
            'group'=>$u['group'],
            'refresh'=>$ts,
            'hash'=>$hash,
            'online'=>true
        );
        $code = json_encode($data);
        S($md5,$code);
        if($inCookie) {
            setcookie('hash',$hash,time()+60*60*24*7,'/',$_SERVER['HTTP_HOST']);
            setcookie('uu',$u['username'],time()+60*60*24*7,'/',$_SERVER['HTTP_HOST']);
        }
        else {
            $_SESSION['hash'] = $hash;
            $_SESSION['uu'] = $u['username'];
            setcookie('hash',"",time()-60*60*24*7,'/',$_SERVER['HTTP_HOST']);
            setcookie('uu',"",time()-60*60*24*7,'/',$_SERVER['HTTP_HOST']);
        }
    }

    public static function cancellationUser() {
        $hash = $_COOKIE['hash'];
        if(!isset($hash)) {
            $hash = $_SESSION['hash'];
            if($hash == null)return;
        }

        $param = login_decode($hash);
        $name = $param['name'];
        $id = $param['id'];
        $md5 = hash('md5',$name."_".$id);
        $code = S($md5);
        if($code != null) {
            $data = json_decode($code);
            $data->{'online'} = false;
            S($md5,json_encode($data));
        }
        session_unset();
    }

    public static function getMemUser() {
        $hash = $_COOKIE['hash'];
        if(!isset($hash)) {
            $hash = $_SESSION['hash'];
            if($hash == null)return null;
        }
        $param = login_decode($hash);
        $name = $param['name'];
        $id = $param['id'];
        $md5 = hash('md5',$name."_".$id);
        $code = S($md5);
        if($code != null) {
            $data = json_decode($code);
            return $data;
        }
        return null;
    }

    public static function checkLogin() {
        $hash = $_COOKIE['hash'];
        $inCookie = true;
        if(!isset($hash)) {
            $hash = $_SESSION['hash'];
            if($hash == null)return false;
            $inCookie = false;
        }
        $param = login_decode($hash);
        $name = $param['name'];
        $ts = $param['ts'];
        $id = $param['id'];
        $md5 = hash('md5',$name."_".$id);
        $code = S($md5);
        if($code != null) {
            $data = json_decode($code);
            $session_ts = $data->{'refresh'};
            $online = $data->{'online'};
            if($online && isset($session_ts) && self::checkUser($ts,$session_ts)) {
                self::refresh($id,$name,$inCookie);
                return true;
            }
        }
        return false;
    }

    private static function refresh($id,$name,$inCookie){
        $md5 = hash('md5',$name."_".$id);
        $code = S($md5);

        if($code != null) {
            $ts = time();
            $data = json_decode($code);
            $data->{'refresh'} = $ts;

            //mem refresh
            S($md5,json_encode($data));

            //cookie refresh
            $hash = login_encode($name,$id,$ts);
            if($inCookie) {
                setcookie('hash',$hash,time()+60*60*24*30,'/',$_SERVER['HTTP_HOST']);
                setcookie('uu',$name,time()+60*60*24*30,'/',$_SERVER['HTTP_HOST']);
            }
            else {
                $_SESSION['hash'] = $hash;
                $_SESSION['uu'] = $name;
                setcookie('hash',"",time()-60*60*24*7,'/',$_SERVER['HTTP_HOST']);
                setcookie('uu',"",time()-60*60*24*7,'/',$_SERVER['HTTP_HOST']);
            }
        }
    }

    private static function checkUser($ts,$session_ts) {
        if(isset($ts)) {
            if(time() - $session_ts <= 3600*24*7) {
                return true;
            }
        }
        return false;
    }

}