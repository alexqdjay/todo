package com.eccom.todo.test.util;

import static org.junit.Assert.*;

import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.apache.velocity.app.Velocity;
import org.apache.velocity.app.VelocityEngine;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.ui.velocity.VelocityEngineFactory;
import org.springframework.ui.velocity.VelocityEngineUtils;

import com.eccom.todo.util.MailSenderService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath*:applicationContext.xml","/jpa.xml","/mail-spring.xml"})
public class MailSender_Test {

	
	@Autowired
	public JavaMailSender mailSender;
	
	@Autowired
	public VelocityEngine engine;
	
	@Autowired
	public MailSenderService mailSenderService;
	
	private final String from = "alexqdjay@163.com";
	private final String to = "alexqdjay@126.com";
	
	@Test
	public void test() {
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setFrom(from);
		mailMessage.setTo(to);
		mailMessage.setSubject("Todo Test");
		mailMessage.setText("Hello World!周润发");
		mailSender.send(mailMessage);
	}
	
	@Test 
	public void sendHtml() {
		Map user = new HashMap<String, String>();
		user.put("userName", "周润发");
		user.put("emailAddress", "asdasd@212.com");
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		try {
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage,true,"utf-8");
			helper.setFrom(from);
			helper.setTo(to);
			helper.setSubject("Test");
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("user", user);
			model.put("id", 2222);
			String text = VelocityEngineUtils.mergeTemplateIntoString(engine, "com/eccom/todo/test/util/test-temp.vm", model);
			helper.setText(text,true);
			mailSender.send(mimeMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}
	
	@Test 
	public void sendHtml2() throws MessagingException {
		Map<String, Object> model = new HashMap<String, Object>();
		String text = VelocityEngineUtils.mergeTemplateIntoString(engine, "com/eccom/todo/test/util/scheduleNotice.vm", model);
		mailSenderService.sendHtml(from, new String[]{to}, "asdad", text, new String[]{});
	} 
	
}
