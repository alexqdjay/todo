package com.eccom.todo.test.service;

import static org.junit.Assert.*;


import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.eccom.todo.model.MailType;
import com.eccom.todo.service.MailService;
import com.eccom.todo.test.ContextLoader_Test;

public class MailService_Test extends ContextLoader_Test{

	@Autowired
	public MailService mailService;
	
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
	
	public void rollBack() {
		
	}

}
