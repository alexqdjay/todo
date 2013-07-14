/**
 * 
 */
package com.eccom.todo.test.action;

import org.junit.Test;

import com.eccom.todo.action.ScheduleNoticeAction;

/**
 * @author alex
 *
 */
public class ScheduleNoticeAction_Test extends ActionTestBase {
	
	public ScheduleNoticeAction action;
	
	@Test
	public void testNoticeNew() throws Exception {
        request.setServletPath("/scheduleNotice/noticeNew/sid/1");
        request.setMethod("GET");
        
        handlerAdapter.handle(request, response, mapping.getHandler(request).getHandler());
        
        System.out.println(response.getContentAsString());  
        
        try {
			Thread.sleep(20000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	
}
