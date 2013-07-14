/**
 * 
 */
package com.eccom.todo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eccom.todo.dao.UserDao;
import com.eccom.todo.model.MailModel;
import com.eccom.todo.model.MailType;
import com.eccom.todo.model.UserModel;
import com.eccom.todo.service.MailModelService;
import com.eccom.todo.service.MailService;
import com.eccom.todo.service.MailTextBuilder;
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
	
	@Autowired
	public UserDao userDao;
	
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

	@Override
	public void sendAll(String from, String subject, String text, MailType type,MailTextBuilder builder) {
		List<UserModel> list = userDao.select("From UserModel u");
		for(UserModel user:list) {
			if(user.getMail() != null && user.getMail().trim().length()>0) {
				String textCon = new String(text);
				if(builder != null) {
					textCon = builder.replaceText(user);
				}
				this.send(from, new String[]{user.getMail()} , null, subject, textCon, type);
			}
		}
	}	
	
}
