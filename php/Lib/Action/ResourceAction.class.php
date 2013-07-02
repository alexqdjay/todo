<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-21
 * Time: 下午9:45
 * To change this template use File | Settings | File Templates.
 */

class ResourceAction extends AuthAction{

    public function index() {
//        $this->redirect("Resource/myProject");
    }

    public function myProject() {
        $this->title = "我的项目";
        $uid = $this->myid;
        $this->showname = $this->myname;
        $this->gp = $this->mygroup;
        $PA = A('Project');
        $up = $PA->listMyProjects($uid,$this->myname);
        $this->NAI = 'myProject';
        $this->list = $up;
        $this->MyName = $this->myname;
        $this->uid = $uid;
        $this->display();
    }

    public function allProject() {
        $this->title = "所有项目";
        $uid = $this->myid;
        $this->showname = $this->myname;
        $this->gp = $this->mygroup;
        $PA = A('Project');
        $up = $PA->listMyProjects($uid);
        $map = array();
        foreach($up as $data) {
            $map[$data['id']] = $data;
        }
        $all = $PA->listAllProjects();
        foreach($all as &$data) {
            $id = $data['id'];
            if(array_key_exists($id,$map)) {
                $data['ismy'] = true;
            }
            else {
                $data['ismy'] = false;
            }
        }
        $this->list = $all;
        $this->uid = $uid;
        $this->NAI = 'allProject';
        $this->display();
    }

    public function joinProj($pid) {
        $uid = $this->myid;
        $PP = M('project_partner');
        $w = array('user_id'=>$uid,'project_id'=>$pid);
        $data = $PP->where($w)->find();
        if($data == null) {
           $b = $PP->add($w);
        }
        else {
            $b = true;
        }
        $this->ajaxReturn(array('success'=>$b));
    }

    public function quitProj($pid) {
        $uid = $this->myid;
        $PP = M('project_partner');
        $w = array('user_id'=>$uid,'project_id'=>$pid);
        $b = $PP->where($w)->delete();
        $this->ajaxReturn(array('success'=>$b));
    }

    public function projectProfile($pid=null) {
        $this->title = "项目描述";
        $uid = $this->myid;
        $this->showname = $this->myname;
        $this->gp = $this->mygroup;

        $P = M('project');
        if($pid == null) {
            $pa = A('Project');
            $ps = $pa->listMyProjects($uid);
            if(count($ps) != 0){
                $pid = $ps[0]['id'];
            }
        }

        if($pid != null) {
            $project = $P->join("user on user.id=project.manager_id")->
                field('project.*,user.name username')->where('project.id='.$pid)->find();
            $project["date"] = date('m/d/Y',$project['time']);
            $this->pro = $project;

            $PU = M('project_partner');
            $data = $PU->join('user on user.id=project_partner.user_id')->where("project_partner.project_id=$pid")->
                field("user.id,user.name,user.mail,user.tel")->select();
            if($data == null) $data = array();
            $this->list = $data;
        }
        $this->display();
    }

}