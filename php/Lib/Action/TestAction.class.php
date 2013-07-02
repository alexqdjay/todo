<?php
/**
 * Created by JetBrains PhpStorm.
 * User: alex
 * Date: 13-6-6
 * Time: 下午2:03
 * To change this template use File | Settings | File Templates.
 */

class TestAction extends Action{

    public function testMemcache() {
        S('test',test);
        if(S('test') === 'test') {
            echo "<br>Memcache Working!------------";
        }
        else {
            echo "<br>Memcache Not Working!------------";
        }
    }

    public function getMemcache($name='') {
        echo $name."=". S($name);
    }
}