/**
 * 
 */
package com.eccom.todo.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.velocity.VelocityEngineUtils;

import com.eccom.todo.dao.ScheduleDao;
import com.eccom.todo.model.MailType;
import com.eccom.todo.service.MailService;
import com.eccom.todo.service.ScheduleMailNotice;

/**
 * @author alex
 *
 */
@Service
public class ScheduleMailNoticeServiceImpl implements ScheduleMailNotice {

	@Autowired
	public ScheduleDao scheduleDao;
	
	@Autowired
	public MailService mailService;
	
	@Autowired
	public VelocityEngine engine;
	
	@Override
	public void notice(int scheduleId) {
		Map<String, Object> schedule = scheduleDao.findOne(scheduleId);
		
		String text = VelocityEngineUtils.mergeTemplateIntoString(engine, "resource/scheduleNotice.vm", new HashMap<String, Object>());;
		
		mailService.send("alexqdjay@163.com",
				new String[]{schedule.get("mail").toString()},new String[]{},
				"新日程",text,MailType.HTML);
		
	}

}
