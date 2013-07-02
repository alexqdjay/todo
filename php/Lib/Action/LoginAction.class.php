<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-22
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */

require('Lib/Service/MemLoginCheckService.class.php');

class LoginAction extends Action{

    public function logout() {
        return;
    }

    public function tologout() {
        MemLoginCheckService::cancellationUser();
        $this->redirect('Login/tologin');
    }

    public function toSignUp() {
        $this->title = "注册";
        $this->display();
    }

    public function signup() {
        $U = M('user');
        $data = $U->create();
        $data['pwd'] = md5($data['pwd']);
        $data['group'] = 'user';
        $data['signuptime'] = microtime(true)*1000;
        $re = $U->add($data);
        if($re) {
            $this->success('注册成功!',"Login/tologin",true);
        }
        else {
            $this->error('注册失败',"Login/toSignUp",true);
        }
    }

    public function checkUserDuplicate($usr) {
        $U = M('user');
        $data = $U->where(array('username'=>$usr))->find();
        if($data != null) {
            $this->ajaxReturn(array('success'=>false));
        }
        else {
            $this->ajaxReturn(array('success'=>true));
        }
        return;
    }


    public function tologin() {
        $this->title = 'Login';
        $this->display();
    }

    public function login($name=null,$pwd=null,$inCookie=true) {
        if($name == null || $pwd == null) {
            $this->ajaxReturn(array('success'=>false,'msg'=>'name or pwd is null!'));
            return;
        }

        $U = M('user');
        $u = $U->where(array('username'=>$name,'mail'=>$name,'_logic'=>'or'))->find();
        if($u != null && $u['pwd'] === $pwd) {
            MemLoginCheckService::registUser($u,$inCookie=="true");
            $this->ajaxReturn(array('success'=>true));
        }
        else if($u == null){
            $this->ajaxReturn(array('success'=>false,'msg'=>'user name error',code=>1));
        }
        else if($u != null && $u['pwd'] != $pwd) {
            $this->ajaxReturn(array('success'=>false,'msg'=>'password error',code=>2));
        }
        else {
            $this->ajaxReturn(array('success'=>false,'msg'=>''));
        }
    }
}