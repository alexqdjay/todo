/**
 * 
 */
package com.eccom.todo.test.action;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.BeforeClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.portlet.HandlerExecutionChain;
import org.springframework.web.portlet.HandlerMapping;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;


import com.eccom.todo.test.ContextLoader_Test;

/**
 * @author alex
 *
 */
public class ActionTestBase extends ContextLoader_Test{
	
	@Autowired
	public HandlerMapping handlerMapping;
	
	@Autowired
    public RequestMappingHandlerAdapter handlerAdapter;

    protected static MockHttpServletRequest request;

    protected static MockHttpServletResponse response;
    
	@BeforeClass
	public static void setup() {  
		request = new MockHttpServletRequest();
        request.setCharacterEncoding("UTF-8");
        
        response = new MockHttpServletResponse();
    }  
	
}
