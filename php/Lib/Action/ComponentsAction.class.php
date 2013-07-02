<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-5-26
 * Time: 下午10:50
 * To change this template use File | Settings | File Templates.
 */

class ComponentsAction extends Action{

    public function buttons(){
        $this->title = "buttons";
        $this->display();
    }
}