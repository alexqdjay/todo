<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-21
 * Time: 下午8:32
 * To change this template use File | Settings | File Templates.
 */

class ScheduleAction extends AuthAction{

    public function index() {
        $this->title = '日程';
        $this->uid = $this->myid;
        $this->showname = $this->myname;
        $this->gp = $this->mygroup;
        $this->NAI = 'schedule';
        $this->display();
    }

    public function save($id=null,$project,$desc,$start,$end,$addr=0,$owner=0,
                         $subject,$mode,$startDate,$endDate,$startTime,$endTime) {
        $uid = $this->myid;
        $data = array(
            'project_id'=>$project,
            'desc'=>$desc,
            'start'=>$start,
            'end'=>$end,
            'subject'=>$subject,
            'mode'=>$mode,
            'user_id'=>$owner,
            'startdate'=>$startDate,
            'enddate'=>$endDate,
            'starttime'=>$startTime,
            'endtime'=>$endTime,
            'addr'=>$addr
        );
        $S = M('schedule');
        if($id == null || strlen($id) == 0) {
            $data['entrytime'] = microtime(true)*1000;
            $data['createby'] = $uid;
            $b = $S->add($data);
        }
        else {
            $b = $S->where(array('id'=>$id))->save($data);
        }
        $this->ajaxReturn(array('success'=>$b));
    }

    public function delete($sid) {
        $S = M('schedule');
        $b = $S->where(array('id'=>$sid))->delete();
        $this->ajaxReturn(array('success'=>$b));
    }

    public function showData($uid="",$start=0,$end=0) {
        if($uid == null || strlen($uid) == 0) {
            $uid = $this->myid;
        }
        $S = M('Schedule');
        $where = array(
            'user_id'=>$uid,
            '_string'=>"schedule.start<$end or schedule.end>=$start"
        );
        $datas = $S->join(array('project on project.id=schedule.project_id','user on user.id=createby'))->where($where)
            ->field('schedule.*,project.name,user.name createuser')->select();
        $this->processDatas($datas,false);
        $this->ajaxReturn($datas);
    }

    public function getMyCreate($start=0,$end=0) {
        $uid = $_SESSION['uid'];
        if($uid == null || strlen($uid) == 0) {
            $uid = $this->myid;
        }
        $S = M('Schedule');
        $where = array(
            'createby'=>$uid,
            'user_id'=>array('NEQ',$uid),
            '_string'=>"schedule.start<$end or schedule.end>=$start"
        );
        $datas = $S->join(array('project on project.id=schedule.project_id','user on user.id=createby'))->where($where)
            ->field('schedule.*,project.name,user.name createuser')->select();
        $this->processDatas($datas,false);
        $this->ajaxReturn($datas);
    }

    public function getOtherPeopleData($uid=null,$oid=null,$start=0,$end=0) {
        if($uid == null || strlen($uid) == 0) {
            $uid = $this->myid;
        }
        $S = M('Schedule');
        $where = array(
            'user_id'=>$oid,
            'createby'=>array('NEQ',$uid),
            '_string'=>"schedule.start<$end or schedule.end>=$start"
        );
        $datas = $S->join(array('project on project.id=schedule.project_id'))->where($where)
            ->field('schedule.*,project.name')->select();
        $this->processDatas($datas,true);
        $this->ajaxReturn($datas);
    }

    private function processDatas(&$datas,$isother=false) {
        if($datas == null)$data = array();
        foreach($datas as &$data) {
            $prj = $data['name'];
            if($prj != null && mb_strlen($prj,'utf8')>6) {
                $prj = mb_substr($prj,0,6,'utf8');
                $prj .= '...';
            }
            $data['title'] = $data['subject']." (".$prj.")";
            if($data['end']<time() || $isother) {
                $data['readOnly'] = true;
            }
            if($data['mode'] == 1) {
                $data['allDay'] = false;
            }
        }
    }

}