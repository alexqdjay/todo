/**
 * 
 */
package com.eccom.todo.work.mail;

import com.eccom.todo.model.MailType;

/**
 * @author alex
 *
 */
public class MailMessage {

	private int id;
	private String subject;
	private String text;
	private String from;
	private String[] to;
	private String[] cc;
	private MailType type = MailType.Text;
	
	@SuppressWarnings("unused")
	private MailMessage() {
	}
	
	public MailMessage(int id,String from, String[] to, String[] cc, String subject, String text) {
		this.from = from;
		this.to = to;
		this.cc = cc;
		this.subject = subject;
		this.text = text;
		this.id = id;
	}
	
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public String[] getTo() {
		return to;
	}
	public void setTo(String[] to) {
		this.to = to;
	}
	public String[] getCc() {
		return cc;
	}
	public void setCc(String[] cc) {
		this.cc = cc;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public MailType getType() {
		return type;
	}

	public void setType(MailType type) {
		this.type = type;
	}
	
	
}
