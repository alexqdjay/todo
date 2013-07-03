/**
 * 
 */
package com.eccom.todo.action;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * @author alex
 *
 */
@Controller
@RequestMapping("/hello")
public class HelloAction {

	public HelloAction(){
		super();
		System.out.println(System.currentTimeMillis());
	}
	
	@RequestMapping("/test")
	@ResponseBody
	public Map<String, Object> test() {
		Map<String, Object> map = new java.util.HashMap<String,Object>();
		
		map.put("name", "jay");
		map.put("id", Math.ceil(Math.random()*10));
		
		return map;
	}
}
