/**
 * 
 */
package com.eccom.todo.action;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.eccom.todo.model.MailType;
import com.eccom.todo.service.MailService;

/**
 * @author alex
 *
 */
@Controller
@RequestMapping("/mail")
public class MailAction {

	@Autowired
	public MailService mailService;
	
	@RequestMapping(value="/send_post",method=RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> sendPOST() {
		Map<String, Object> map = new HashMap<String, Object>();
		
		
		return map;
	}
	
	@RequestMapping(value="/send_get",method=RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> sendGET(@RequestParam("from") String from, @RequestParam("to") String to,
			@RequestParam(value="cc",required=false) String cc, @RequestParam("subject") String subject, 
			@RequestParam("text") String text) {
		Map<String, Object> map = new HashMap<String, Object>();
		if(to == null) return map;
		String[] tos = to.split(",");
		if(cc != null && cc.length()>0) {
			mailService.send(from, tos, cc.split(","), subject, text, MailType.Text);
		}
		else {
			mailService.send(from, tos, null, subject, text, MailType.Text);
		}
		return map;
	}
	
	@ResponseBody
	@RequestMapping("/test/{s}")
	public String test(@PathVariable String s,@RequestBody String body) {
		return s + "<br>" + body;
	}
	
}
