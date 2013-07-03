package com.eccom.todo.test.action;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;

import com.eccom.todo.action.HelloAction;


public class Test_HelloAction extends ActionTestBase{

	@Autowired
	public HelloAction helloAction;
	
	@Test
	public void testHelloWorld() throws Exception {
        request.setServletPath("/app/hello/test");
        
        handlerAdapter.handle(request, response, new HandlerMethod(helloAction, "test"));
        
        System.out.println(response.getContentAsString());  
	}

}
