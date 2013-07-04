<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-22
 * Time: 下午10:16
 * To change this template use File | Settings | File Templates.
 */

class ProjectAction extends AuthAction{

    public function save($id=null,$name=null,$type=null,$time=0,$manager_id=null,$start=0,
                         $engineers="",$director_id=null){
        $P = M('project');
        $data = array();
        $uid = $this->myid;
        $data['name'] = $name;
        $data['type'] = $type;
        $data['time'] = $time;
        $data['manager_id'] = $manager_id;
        $data['director_id'] = $director_id;
        $data['start'] = $start;
        if($id != null) {
            $b = $P->where(array('id'=>$id))->save($data);
        }
        else {
            $b = $P->add($data);
            $id = $b;
        }
        if($b != false || $b == 0) {
            $PP = M('project_partner');
            $PP->where(array('project_id'=>$id))->delete();
            $es = explode (",",$engineers);
            foreach($es as $e){
                $PP->add(array(
                    "project_id"=>$id,
                    "user_id"=>$e
                ));
            }
        }
        $this->ajaxReturn(array('success'=>$b));
    }

    public function close($pid) {
        $P = M('project');
        $re = $P->where('id='.$pid)->save(array('active'=>0));
        $this->ajaxReturn(array('success'=>$re));
    }

    public function get($pid) {
        $P = M('project');
        $data = $P->where("id=$pid")->find();
        if($data != null) {
            $PP = M('project_partner');
            $datas = $PP->where("project_id=$pid")->field("user_id")->select();
            if($datas == null)$datas = array();
            $pp = array();
            foreach($datas as $v) {
                array_push($pp,$v["user_id"]);
            }
            $data['engineers'] = $pp;
        }
        $this->ajaxReturn($data);
    }

    public function myProject() {
        $uid = $this->myid;
        $up = $this->listMyProjects($uid,$this->myname);
        $this->ajaxReturn($up);
    }

    public function myCommonUseProj() {
        $uid = $this->myid;
        $S = M('schedule');
        $pids = $S->Distinct(true)->field('project_id')
            ->where(array('user_id'=>$uid))->limit(0,7)->order('entrytime desc')->select();
        if($pids == null) $pids = array();

        $P = M('project');
        $ps = array();
        foreach($pids as $k=>$pid) {
            $p = $P->where('id='.$pid['project_id'])->field('id,name')->find();
            array_push($ps,$p);
        }
        $this->ajaxReturn($ps);
    }

    public function listAllProjects() {
        $P = M('project');
        $data = $P->join('user on user.id=manager_id')
            ->where(array('project.active'=>1))->field('project.*,user.name as username')->order('project.id desc')->select();
        return $data;
    }

    public function listHisProject($uid) {
        $data = $this->listMyProjects($uid);
        $this->ajaxReturn($data);
    }

    public function listMyProjects($myid,$myname=null) {
        $UP = M('project_partner');
        $up = $UP->join('project on project_partner.project_id=project.id')
            ->where(array('user_id'=>$myid,'project.active'=>1))->order('project.id desc')->select();
        if($up == null)$up=array();
        $U = M('user');
        $ids = array();
        foreach($up as $k=>$v) {
            $u = $U->where(array('id'=>$v['director_id']))->find();
            $v['director'] = $u['name'];

            $u = $U->where(array('id'=>$v['manager_id']))->find();
            $v['manager'] = $u['name'];
            $up[$k] = $v;

            array_push($ids,$v['project_id']);
        }
        if(count($ids) == 0){
            $ids = array(-1);
        }
        $where = array(
            'active'=>1,
            "id"=>array("not in",$ids),
            "_string"=>"(manager_id=$myid or director_id=$myid)"
        );
        $ps = M('project')->where($where)->select();

        if($ps == null)$ps=array();
        foreach($ps as $k=>$v) {
            $v['manager'] = $myname;
            $ps[$k] = $v;
        }
        $up = array_merge($up,$ps);

        return $up;
    }

    public function projectProfile($pid=null) {
        $this->title = "项目情况";
        $uid = $this->myid;
        $this->showname = $this->myname;
        $this->gp = $this->mygroup;
        $this->pid = $pid;
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
            $project['startts'] = $project["start"];
            $project["start"] = date('m/d/Y',$project['start']);
            $this->pro = $project;

            $PU = M('project_partner');
            $data = $PU->join('user on user.id=project_partner.user_id')->where("project_partner.project_id=$pid")->
                field("user.id,user.name,user.mail,user.tel")->select();
            if($data == null) $data = array();
            $this->list = $data;

            $ts0 = $project['time']-$project['startts'];
            $ts1 = time() - $project['startts'];
            $p = $ts1/$ts0;
            if($p > 1)$p =1;
            $this->percent = floor($p*100);
        }
        $this->display();
    }

    public function userParticipation($pid) {
        $S = M('schedule');
        $datas = $S->join("user on user.id=schedule.user_id")->
            where(array('project_id'=>$pid))->field("SUM(end-start) as y,user.name")->group('user_id')->select();
        if($datas == null)$datas=array();
        foreach($datas as &$data) {
            $data['y'] = (float)$data['y']/3600;
        }
        $this->ajaxReturn($datas);
    }
}