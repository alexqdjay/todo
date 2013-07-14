/**
 * 
 */
package com.eccom.todo.service;

import com.eccom.todo.model.MailType;

/**
 * @author alex
 *
 */
public interface MailService {
	
	public void send(String from,String[] to,String[] cc,String subject,String text, MailType type) ;
	
	public void sendAll(String from,String subject,String text, MailType type,MailTextBuilder builder);
}
