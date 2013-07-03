/**
 * 
 */
package com.eccom.todo.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.eccom.todo.service.ScheduleMailNotice;

/**
 * @author alex
 *
 */
@Controller
@RequestMapping("/scheduleNotice")
public class ScheduleNoticeAction {
	
	@Autowired
	public ScheduleMailNotice mailNotice;

	@RequestMapping(value="/noticeNew/sid/{sid}",method=RequestMethod.GET)
	@ResponseBody
	public boolean noticeNew(@PathVariable String sid) {
		
		try {
			int id = Integer.parseInt(sid);
			mailNotice.notice(id);
			return true;
		} catch(NumberFormatException e) {
			e.printStackTrace();
		}
		
		return false;
	}
}
