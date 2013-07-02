<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-26
 * Time: 下午3:36
 * To change this template use File | Settings | File Templates.
 */

class UserAction extends AuthAction{

    public function getUser($query=null) {
        if($query == null || strlen($query) == 0) {
            $this->ajaxReturn(array());
            return;
        }

        $U = M('user');
        $data = $U->where(array('name'=>array('LIKE',"$query%")))->field('name')->select();
        if($data == null)$data = array();
        $this->ajaxReturn($data);
    }

    public function listAllUser() {
        $U = M('user');
        $data = $U->field('id,name')->select();
        if($data == null)$data = array();
        $this->ajaxReturn($data);
    }

    public function get($uid) {
        $U = M('user');
        $data = $U->where('id='.$uid)->field('id,name,mail,tel,group')->find();
        if($data == null)$data = array();
        $this->ajaxReturn($data);
    }

    public function listAllUserExceptMe($query="") {
        $U = M('user');
        $uid = $this->myid;

        if(strlen($query) ==0) {
            $where = "1=1";
        }
        else {
            $where = "(name like '$query%' or username like '$query%')";
        }
        $data = $U->where('id<>'.$uid." And $where And user.group<>'admin'")->field('id,name,username')->select();
        if($data == null)$data = array();
        $this->ajaxReturn($data);
    }
}