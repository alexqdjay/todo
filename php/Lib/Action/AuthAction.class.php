<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-6
 * Time: 下午5:00
 * To change this template use File | Settings | File Templates.
 */

require('Lib/Service/MemLoginCheckService.class.php');

class AuthAction extends Action{
    protected $isAuth = false;
    public $mygroup;
    public $myname;
    public $myid;

    public function _initialize() {
        $this->isAuth = MemLoginCheckService::checkLogin();

        $u = MemLoginCheckService::getMemUser();

        $this->mygroup = $u->{'group'};
        $this->myname = $u->{'name'};
        $this->myid = $u->{'id'};
    }
}