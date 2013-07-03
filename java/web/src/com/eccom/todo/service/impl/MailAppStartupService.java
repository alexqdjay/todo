/**
 * 
 */
package com.eccom.todo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eccom.todo.common.StartupService;
import com.eccom.todo.service.MailModelService;
import com.eccom.todo.util.MailSenderService;
import com.eccom.todo.work.mail.MailRunnable;
import com.eccom.todo.work.mail.UpdateAfterSendRunnable;

/**
 * @author alex
 *
 */
@Service
public class MailAppStartupService implements StartupService {

	private static final int Mail_Send_Thread = 1;
	
	private static final int Mail_Flag_Update_Thread = 2;
	
	
	@Autowired
	public MailModelService mailModelService;
	
	@Autowired
	public MailSenderService mailSenderService;
	
	@Override
	public void start() {
		
		int i = 0;
		while(i<Mail_Flag_Update_Thread) {
			Thread mailFlagUpdateThread = new Thread(new UpdateAfterSendRunnable(mailModelService));
			mailFlagUpdateThread.start();
			i++;
		}
		
		i = 0;
		while(i<Mail_Send_Thread) {
			Thread mailSendThread = new Thread(new MailRunnable(mailSenderService));
			mailSendThread.start();
			i++;
		}
		
		printInfo();
	}
	
	private void printInfo() {
		System.out.println(" Mail Send Engine Start");
	}

}
