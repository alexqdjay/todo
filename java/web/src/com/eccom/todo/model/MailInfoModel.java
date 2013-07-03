/**
 * 
 */
package com.eccom.todo.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * @author alex
 *
 */

@Entity
@Table(name="mailto")
public class MailInfoModel {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	
	@Column
	private String target;
	
	@Column(name="s_ts")
	private long sendTs;
	
	/**
	 * 0=to,1=cc
	 * 
	 */
	@Column
	private int type;
	
	@ManyToOne
	@JoinColumn(name="mail_id")
	private MailModel mail;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public long getSendTs() {
		return sendTs;
	}
	public void setSendTs(long sendTs) {
		this.sendTs = sendTs;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public MailModel getMail() {
		return mail;
	}
	public void setMail(MailModel mail) {
		this.mail = mail;
	}
	public String getTarget() {
		return target;
	}
	public void setTarget(String target) {
		this.target = target;
	}
	
	
}
