<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-4
 * Time: 下午11:06
 * To change this template use File | Settings | File Templates.
 */

class PartnerAction extends Action{

    public function getPartner($uid) {
        $P = M("partner");
        $data = $P->join("user on user.id=partner_id")->where("manager_id=$uid")->
            field('user.id,user.name')->order('partner.id desc')->select();
        if($data == null) $data = array();
        $this->ajaxReturn($data);
    }

    public function getAddPartner($mid=null,$q="") {
        if($mid == null) {
            $this->ajaxReturn(array());
            return;
        }

        $P = M("partner");
        $data = $P->join("user on user.id=partner_id")->where("manager_id=$mid")->
            field('user.id')->select();
        if($data == null)$data = array();
        $ids = array();
        foreach($data as $v) {
            array_push($ids,$v['id']);
        }
        array_push($ids,$mid);
        $U = M('user');
        $where = array(
            'id'=>array('NOT IN',$ids),
            '_string'=>'name like "'.$q.'%" or username like "'.$q.'%"',
            "group"=>array("NEQ",'admin')
        );
        $partners = $U->where($where)->field('id,name,username')->select();
        if($partners == null) $partners = array();
        $this->ajaxReturn($partners);
    }

    public function listMyPartnerAndMe($uid=null,$query=null) {
        if($uid == null) {
            $this->ajaxReturn(array());
            return;
        }
        if($query == null) {
            $query = "1=1";
        }
        else {
            $query = "user.name like '$query%' or user.name like '$query%'";
        }

        if($uid != 1) {
            $P = M("partner");
            $data = $P->join("user on user.id=partner_id")->where("manager_id=$uid and ($query)")->
                field('user.id,user.name,user.username')->select();
            if($data == null)$data = array();
            $P = M('user');
            $me = $P->where('id='.$uid)->field('id,name,username')->find();
            array_push($data,$me);
        }
        else {
            $P = M('user');
            $data = $P->field("id,name,username")->select();
        }
        $this->ajaxReturn($data);
    }

    public function del($pid = null,$mid=null) {
        if($pid == null || $mid == null) {
            $b = false;
        }
        else {
            $P = M("partner");
            $b = $P->where(array('partner_id'=>$pid,'manager_id'=>$mid))->delete();
        }
        $this->ajaxReturn(array('success'=>$b));
    }

    public function add($mid=null,$pid=null) {
        if($mid == null || $pid == null) {
            $b = false;
        }
        else {
            $P = M('partner');
            $data = $P->where("manager_id=$mid and partner_id=$pid")->find();
            if($data != null) {
               $b = false;
            }
            else {
                $b = $P->add(array(
                    "manager_id"=>$mid,
                    "partner_id"=>$pid
                ));
            }
        }

        $this->ajaxReturn(array('success'=>$b));
    }
}