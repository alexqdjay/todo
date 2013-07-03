/**
 * 
 */
package com.eccom.todo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eccom.todo.model.MailModel;
import com.eccom.todo.model.MailType;
import com.eccom.todo.service.MailModelService;
import com.eccom.todo.service.MailService;
import com.eccom.todo.work.mail.MailMessage;
import com.eccom.todo.work.mail.MailRunnable;

/**
 * @author alex
 *
 */
@Service
public class MailServiceImpl implements MailService {

	@Autowired
	public MailModelService mailModelService;
	
	@Override
	public void send(String from, String[] to, String[] cc, String subject,
			String text, MailType type) {
		MailModel mail = mailModelService.save(from, to, cc, subject, text, type);
		
		MailMessage mailMessage = new MailMessage(mail.getId(), from, to,cc, subject, text);
		mailMessage.setType(type);
		try {
			MailRunnable.addMsg(mailMessage);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
}
