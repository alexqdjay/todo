package com.eccom.todo.test.action;

import static org.junit.Assert.*;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;

import com.eccom.todo.action.MailAction;

public class MailAction_Test extends ActionTestBase {

	@Autowired
	public MailAction action;
	
	@Test
	public void testSendGET() {
		fail("Not yet implemented");
	}

	@Test
	public void testTest() throws NoSuchMethodException, Exception {
		request.setServletPath("/app/mail/test/sssss");
	    
        handlerAdapter.handle(request, response, new HandlerMethod(action, "test",String.class,String.class));
        
        System.out.println(response.getContentAsString()); 
	}

}
