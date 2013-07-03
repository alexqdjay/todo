/**
 * 
 */
package com.eccom.todo.work.mail;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import com.eccom.todo.service.MailModelService;


/**
 * @author alex
 *
 */
public class UpdateAfterSendRunnable extends WorkRunnable<Integer> {

	private MailModelService mailModelService;
	
	public static final BlockingQueue<Integer> queue = new ArrayBlockingQueue<Integer>(Max_Size);
	
	public static void add(Integer id) throws InterruptedException {
		queue.put(id);
	}
	
	@SuppressWarnings("unused")
	private UpdateAfterSendRunnable(){}
	
	public UpdateAfterSendRunnable(MailModelService mailModelService) {
		this.mailModelService = mailModelService;
	}
	
	@Override
	protected void doItem(Integer id) {
		mailModelService.updateFlag(id, true);
	}

	@Override
	public Integer poll() throws InterruptedException {
		return queue.take();
	}

}
