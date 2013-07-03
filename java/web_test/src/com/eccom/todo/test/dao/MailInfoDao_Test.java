package com.eccom.todo.test.dao;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.eccom.todo.dao.MailInfoDao;
import com.eccom.todo.model.MailInfoModel;
import com.eccom.todo.model.MailModel;
import com.eccom.todo.test.ContextLoader_Test;

public class MailInfoDao_Test extends ContextLoader_Test{

	@Autowired
	public MailInfoDao dao;
	
	@Test
	public void testCreate() {
		MailInfoModel mailInfo = new MailInfoModel();
		MailModel mail = new MailModel();
		mail.setId(1);
		mailInfo.setMail(mail);
		mailInfo.setTarget("asdasdsad");
		dao.create(mailInfo);
	}

}
