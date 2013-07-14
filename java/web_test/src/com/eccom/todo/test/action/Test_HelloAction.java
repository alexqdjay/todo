package com.eccom.todo.test.action;

import org.junit.Test;


public class Test_HelloAction extends ActionTestBase{

	@Test
	public void testHelloWorld() throws Exception {
        request.setServletPath("/hello/test");
        
        Object handler = mapping.getHandler(request).getHandler();
        
        handlerAdapter.handle(request, response, handler);
        
        System.out.println(response.getContentAsString());  
	}

}
