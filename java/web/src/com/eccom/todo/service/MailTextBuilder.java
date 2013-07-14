/**
 * 
 */
package com.eccom.todo.service;

import com.eccom.todo.model.UserModel;

/**
 * @author alex
 *
 */
public abstract class MailTextBuilder {
	
	protected String text;
	
	public MailTextBuilder(String text) {
		this.text = text;
	}
	
	@SuppressWarnings("unused")
	private MailTextBuilder(){}
	
	public abstract String replaceText(UserModel model);
	
}
