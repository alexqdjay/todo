package com.eccom.todo.test.dao;

import java.util.List;

import org.hibernate.criterion.Example;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.eccom.todo.dao.MailDao;
import com.eccom.todo.model.MailInfoModel;
import com.eccom.todo.model.MailModel;



public class MailDao_Test extends DaoTestBase{

	@Autowired
	public MailDao mailDao;
	
	@Test
	public void testListAll() {
		System.out.println(mailDao.listAll().size());
	}
	
	@Test
	public void testSave() {
		MailModel model = new MailModel();
		model.setFrom("jjj");
		model.setSubject("1122e21");
		model.setText("text");
		model.setTs(System.currentTimeMillis());
		int id = mailDao.create(model);
		System.out.println(id);
	}
	
	@Test
	public void testDel() {
		MailModel model = new MailModel();
		model.setFrom("jjj");
		model.setText("text");
		List<MailModel> list = mailDao.findByExample(model);
		mailDao.delete(list);
		System.out.println(list.size());
	}
	
	@Test
	@Transactional
	public void testFind() {
		MailModel mm = mailDao.find(18);
		for(MailInfoModel mailInfo:mm.getSendList()) {
			System.out.println(mailInfo.getTarget());
		}
		System.out.println(mm);
	}

}
