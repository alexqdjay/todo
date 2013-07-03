/**
 * 
 */
package com.eccom.todo.test.action;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;

import com.eccom.todo.action.ScheduleNoticeAction;

/**
 * @author alex
 *
 */
public class ScheduleNoticeAction_Test extends ActionTestBase {
	
	@Autowired
	public ScheduleNoticeAction action;
	
	@Test
	public void testHelloWorld() throws Exception {
        request.setServletPath("/app/scheduleNotice/noticeNew/sid/1");
        
        handlerAdapter.handle(request, response, new HandlerMethod(action, "noticeNew",String.class));
        
        System.out.println(response.getContentAsString());  
	}
	
	
}
