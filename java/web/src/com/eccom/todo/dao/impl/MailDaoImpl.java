/**
 * 
 */
package com.eccom.todo.dao.impl;

import java.util.List;


import org.springframework.stereotype.Repository;

import com.eccom.todo.dao.MailDao;
import com.eccom.todo.model.MailModel;

/**
 * @author alex
 *
 */

@Repository
public class MailDaoImpl extends CommonDaoSupport<MailModel> implements MailDao{

	
	@SuppressWarnings("unchecked")
	@Override
	public List<MailModel> listAll() { 
		return this.getHibernateTemplate().find("From MailModel");
	}


}
