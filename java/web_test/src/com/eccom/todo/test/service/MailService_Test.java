package com.eccom.todo.test.service;


import java.util.HashMap;

import org.apache.velocity.app.VelocityEngine;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.velocity.VelocityEngineUtils;

import com.eccom.todo.model.MailType;
import com.eccom.todo.model.UserModel;
import com.eccom.todo.service.MailService;
import com.eccom.todo.service.MailTextBuilder;
import com.eccom.todo.test.ContextLoader_Test;

public class MailService_Test extends ContextLoader_Test{

	@Autowired
	public MailService mailService;
	
	@Autowired
	public VelocityEngine engine;
	
	@Test(timeout=Integer.MAX_VALUE)
	public void testSend() {
		mailService.send("alexqdjay@163.com", new String[]{"alexqdjay@126.com"}, 
				new String[]{"alexqdjay@gmail.com","qianduo@eccom.com.cn"}, "test", "Hello Jolin!", MailType.Text);
		
		try {
			Thread.sleep(20000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@Test(timeout=Integer.MAX_VALUE)
	public void testSendAll() {
		String text = VelocityEngineUtils.mergeTemplateIntoString(engine, "resource/hello.vm", new HashMap());
		mailService.sendAll("alexqdjay@163.com", "test", text, MailType.HTML,new MailTextBuilder(text) {
			@Override
			public String replaceText(UserModel model) {
				return text.replaceAll("\\$\\{user\\}", model.getName());
			}
		});
		
		try {
			Thread.sleep(20000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	public void rollBack() {
		
	}

}
