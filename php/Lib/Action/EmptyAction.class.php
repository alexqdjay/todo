<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-7
 * Time: 下午1:53
 * To change this template use File | Settings | File Templates.
 */

class EmptyAction extends Action{

    public function index() {
        $this->redirect("Index/home");
    }
}