<?php
/*
 * Created on 2013-1-21
 * alex
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */
 
  	function login_decode($code) {
    	$hex = base64_decode($code);
    	
    	$id_hex = substr($hex,0,8);
    	$id = hexdec($id_hex);
    	
    	$name_hex = substr($hex,8,32);
    	$name = hex2Name($name_hex);
    	
    	$ts_hex = substr($hex,40,8);
    	$ts = hexdec($ts_hex);
    	
    	return array('ts'=>$ts,'name'=>$name,'id'=>$id);
    }
    
    function login_encode($name,$id,$ts) {
    	$hex = name2Hex($name);
    	$hex_id = dechex($id);
    	while(strlen($hex_id)<8) {
    		$hex_id = "0".$hex_id;
    	}
    	$hex_ts = dechex($ts);
    	while(strlen($hex_ts)<8) {
    		$hex_ts = "0".$hex_ts;
    	}
    	$hex = $hex_id.$hex.$hex_ts;
    	$res = base64_encode($hex);
    	return $res;
    }
    
    function name2Hex($name) {
    	$res = '';
    	for($i=0;$i<strlen($name);$i++) {
    		$ch = dechex(ord($name[$i]));
    		$res = $res.$ch;
    	}
    	while(strlen($res)<32) {
    		$res = $res."0";
    	}
    	return $res;
    }
    
    function hex2Name($hex) {
    	$len = strlen($hex);
    	$i = $len;
    	do{
    		$i--;
    		$ch = $hex[$i];	
    	}while($ch == '0');
    	$res = '';
    	while($i>=0) {
    		$ch = $hex[$i-1].$hex[$i];	
    		$int = hexdec($ch);
    		$ch = chr($int);
    		$res = $ch.$res;
    		$i -= 2;
    	}
    	return $res;
    }
 
 
?>
