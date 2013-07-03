/**
 * 
 */
package com.eccom.todo.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Type;


/**
 * @author alex
 *
 */
@Entity
@Table(name="mail")
public class MailModel {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	
	@Column
	private String subject;
	
	@Column
	private String text;
	
	@Column(name="fromuser")
	private String from;
	
	@Column
	private Long ts;
	
	@Column(columnDefinition="int default 0",nullable=false)
	@Enumerated(value=EnumType.ORDINAL)
	private MailType type = MailType.Text;
	
	@Column(nullable=false,columnDefinition="TINYINT(1)")
	@Type(type = "org.hibernate.type.NumericBooleanType")
	private Boolean flag = false;
	
	@OneToMany(mappedBy="mail")
	private List<MailInfoModel> sendList;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
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
	public Long getTs() {
		return ts;
	}
	public void setTs(Long ts) {
		this.ts = ts;
	}
	public MailType getType() {
		return type;
	}
	public void setType(MailType type) {
		this.type = type;
	}
	public List<MailInfoModel> getSendList() {
		return sendList;
	}
	public void setSendList(List<MailInfoModel> sendList) {
		this.sendList = sendList;
	}
	public Boolean getFlag() {
		return flag;
	}
	public void setFlag(Boolean flag) {
		this.flag = flag;
	}
	
	
}
