package com.eccom.todo.test.action;

import static org.junit.Assert.*;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.eccom.todo.action.MailAction;

public class MailAction_Test extends ActionTestBase {

	@Autowired
	public MailAction action;
	
	@Test
	public void testSendGET() {
	}

	@Test
	public void testTest() throws NoSuchMethodException, Exception {
		request.setServletPath("/mail/test/sssss");
		request.setMethod("GET");
	    
		Object handler = mapping.getHandler(request).getHandler();
		
        handlerAdapter.handle(request, response, handler);
        
        System.out.println(response.getContentAsString()); 
	}

}
