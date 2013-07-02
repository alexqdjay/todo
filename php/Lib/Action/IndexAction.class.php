<?php
// 本类由系统自动生成，仅供测试用途
class indexAction extends AuthAction{

    public function  index() {
        if(!$this->isAuth){
            $this->redirect('Login/tologin');
        }
        $this->title = 'index';
        $this->redirect('Schedule/index');
    }

    public function home() {
        if(!$this->isAuth){
            $this->redirect('Login/tologin');
        }
        $this->showname = $this->myname;
        $this->gp = $this->mygroup;
        $this->title = "Home";
        $this->NAI = 'home';
        $this->display();
    }
}