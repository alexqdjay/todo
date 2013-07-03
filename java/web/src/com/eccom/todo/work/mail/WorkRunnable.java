/**
 * 
 */
package com.eccom.todo.work.mail;


/**
 * @author alex
 *
 */
public abstract class WorkRunnable<T> implements Runnable {
	
	public static final int Max_Size = 50000;
	
	public String name = "";

	@Override
	public void run() {
		for(;;) {
			try {
				T item = poll();
				doItem(item);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	
	public abstract T poll() throws InterruptedException;
	
	protected abstract void doItem(T item);

}
