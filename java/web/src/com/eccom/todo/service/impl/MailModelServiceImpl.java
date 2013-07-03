package com.eccom.todo.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eccom.todo.dao.MailDao;
import com.eccom.todo.dao.MailInfoDao;
import com.eccom.todo.model.MailInfoModel;
import com.eccom.todo.model.MailModel;
import com.eccom.todo.model.MailType;
import com.eccom.todo.service.MailModelService;
import com.eccom.todo.work.mail.MailMessage;


@Service
public class MailModelServiceImpl implements MailModelService{

	@Autowired
	public MailDao mailDao;
	
	@Autowired
	public MailInfoDao mailInfoDao;
	
	@Override
	@Transactional
	public void updateFlag(int id, boolean success) {
		MailModel mail = mailDao.find(id);
		mail.setFlag(success);
		mailDao.update(mail);
	}

	@Override
	@Transactional
	public MailModel save(String from, String[] to, String[] cc, String subject,
			String text, MailType type) {
		MailModel mail = new MailModel();
		List<MailInfoModel> mailInfos = new ArrayList<MailInfoModel>();
		mail.setFrom(from);
		mail.setTs(System.currentTimeMillis());
		mail.setSubject(subject);
		mail.setText(text);
		
		mailDao.create(mail);
		
		MailInfoModel mailInfoModel;
		for(String mailTo:to) {
			mailInfoModel = new MailInfoModel();
			mailInfoModel.setType(0);
			mailInfoModel.setMail(mail);
			mailInfoModel.setSendTs(0);
			mailInfoModel.setTarget(mailTo);
			mailInfoDao.create(mailInfoModel);
		}
		
		if(cc != null) {
			for(String mailCc:cc) {
				mailInfoModel = new MailInfoModel();
				mailInfoModel.setType(1);
				mailInfoModel.setMail(mail);
				mailInfoModel.setSendTs(0);
				mailInfoModel.setTarget(mailCc);
				mailInfoDao.create(mailInfoModel);
				mailInfos.add(mailInfoModel);
			}
		}
		
		return mail;
	}

	@Override
	public List<MailMessage> loadUnSendMailMsg() {
		return null;
	}


}
