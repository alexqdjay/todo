package com.eccom.todo.work.mail;


import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import javax.mail.MessagingException;

import com.eccom.todo.model.MailType;
import com.eccom.todo.util.MailSenderService;

public class MailRunnable extends WorkRunnable<MailMessage>{

	private MailSenderService mailSenderService;
	
	public static final BlockingQueue<MailMessage> queue = new ArrayBlockingQueue<MailMessage>(Max_Size);
	
	public MailRunnable(MailSenderService service) {
		mailSenderService = service;
	}
	
	public static void addMsg(MailMessage msg) throws InterruptedException {
		queue.put(msg);
	}
	
	@Override
	protected void doItem(MailMessage msg) {
		if(msg.getType() == MailType.Text) {
			mailSenderService.sendText(msg.getFrom(), msg.getTo(),
					msg.getSubject(), msg.getText(), msg.getCc());
		}
		else {
			try {
				mailSenderService.sendHtml(msg.getFrom(), msg.getTo(),
						msg.getSubject(), msg.getText(), msg.getCc());
			} catch (MessagingException e) {
				e.printStackTrace();
			}
		}
		try {
			UpdateAfterSendRunnable.add(new Integer(msg.getId()));
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	@Override
	public MailMessage poll() throws InterruptedException {
		return queue.take();
	}

}
