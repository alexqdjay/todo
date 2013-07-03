/**
 * 
 */
package com.eccom.todo.dao;

import java.util.List;

import com.eccom.todo.model.MailModel;

/**
 * @author alex
 *
 */
public interface MailDao extends CommonDao<MailModel>{
	
	public List<MailModel> listAll();
	
}
