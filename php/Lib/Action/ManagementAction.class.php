<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-4
 * Time: 下午3:57
 * To change this template use File | Settings | File Templates.
 */

class ManagementAction extends AuthAction{

    public function projectList() {
        if(!$this->isAuth) {
            $this->redirect("Login/tologin");
        }
        $this->title = "项目列表";
        $this->showname = $this->myname;
        $this->gp = $this->mygroup;
        $PA = A('Project');
        $data = $PA->listAllProjects();
        $this->list = $data;

        $U = M('user');
        $us = $U->where(array("group"=>array('NEQ','admin')))->field('id,name,username')->select();
        if($us == null) $us = array();
        $this->us = $us;
        $this->uid = $this->myid;
        $this->NAI = 'projectList';
        $this->display();
    }

    public function people() {
        $this->title = "人员管理";

        $this->showname = $this->myname;
        $this->gp = $this->mygroup;

        $U = M('user');

        $data = $U->where('id<>1')->select();

        $this->list = $data;
        $this->NAI = 'people';
        $this->display();
    }

}