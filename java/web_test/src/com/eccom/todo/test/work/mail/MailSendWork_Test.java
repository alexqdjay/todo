package com.eccom.todo.test.work.mail;

import static org.junit.Assert.*;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.eccom.todo.service.MailModelService;
import com.eccom.todo.test.ContextLoader_Test;
import com.eccom.todo.util.MailSenderService;
import com.eccom.todo.work.mail.MailMessage;
import com.eccom.todo.work.mail.MailRunnable;
import com.eccom.todo.work.mail.WorkRunnable;

public class MailSendWork_Test extends ContextLoader_Test{

	@Autowired
	public MailModelService mailModelService;
	
	@Autowired
	public MailSenderService mailSenderService;
	
	@Test(timeout=Integer.MAX_VALUE)
	public void test() {
		
		int c = 3;
		int i = 0;
		while(i<c) {
			MailRunnable r = new MailRunnable(mailSenderService);
			r.name = "th_"+i;
			Thread th = new Thread(r);
			th.start();
			i++;
		}
		
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		MailMessage msg = null;
//				new MailMessage(0, "aaa", new String[]{"ccc"}, null, "222", "asdasd");
		i = 0;
		while(i<10) {
			msg = new MailMessage(0, "aaa", new String[]{"ccc"}, null, "222", "asdasd");
			msg.setId(i);
			try {
				MailRunnable.addMsg(msg);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			i++;
		}
		
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
	}
	
}
