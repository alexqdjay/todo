package com.eccom.todo.service;

import java.util.List;

import com.eccom.todo.model.MailModel;
import com.eccom.todo.model.MailType;
import com.eccom.todo.work.mail.MailMessage;

public interface MailModelService {
	
	public void updateFlag(int id,boolean success);
	
	public MailModel save(String from,String[] to,String[] cc,String subject,String text, MailType type);
	
	public List<MailMessage> loadUnSendMailMsg();
}
