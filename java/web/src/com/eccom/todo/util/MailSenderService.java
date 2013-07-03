/**
 * 
 */
package com.eccom.todo.util;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

/**
 * @author alex
 *
 */

@Component
public class MailSenderService {
	
	public MailSenderService() {
	}

	@Autowired
	public JavaMailSender sender;
	
	
	public void sendText(String from,String[] to,String subject,String text,String[] cc) {
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setFrom(from);
		mailMessage.setTo(to);
		if(cc != null && cc.length >0) {
			mailMessage.setCc(cc);
		}
		mailMessage.setSubject(subject);
		mailMessage.setText(text);
		sender.send(mailMessage);
		
		printInfo(from, to, subject, text, cc);
	}
	
	public void sendHtml(String from,String[] to,String subject,String text,String[] cc) 
			throws MessagingException {
		MimeMessage mimeMessage = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage,true,"utf-8");
		helper.setTo(to);
		helper.setFrom(from);
		helper.setSubject(subject);
		if(cc != null && cc.length >0) {
			helper.setCc(cc);
		}
		helper.setText(text,true);
		sender.send(mimeMessage);
		
		printInfo(from, to, subject, text, cc);
	}
	
	private void printInfo(String from,String[] to,String subject,String text,String[] cc) {
		StringBuffer sb = new StringBuffer("from:"+from);
		sb.append("\n");
		sb.append("to:"+to.toString());
		sb.append("\n");
		if(cc != null) {
			sb.append("cc:"+cc.toString());
			sb.append("\n");
		}
		sb.append("subject:"+subject);
		sb.append("\n");
//		sb.append(text);
		System.out.println(sb.toString());
	}
}
