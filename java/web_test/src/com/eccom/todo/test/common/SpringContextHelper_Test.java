package com.eccom.todo.test.common;

import static org.junit.Assert.*;

import org.junit.Test;
import org.springframework.stereotype.Service;

import com.eccom.todo.common.SpringContextHelper;
import com.eccom.todo.common.StartupService;
import com.eccom.todo.test.ContextLoader_Test;

public class SpringContextHelper_Test extends ContextLoader_Test {

	
	@Test
	public void testGetBeansByAnnotation() {
		System.out.println(SpringContextHelper.getBeansByAnnotation(Service.class));
	}
	
	@Test
	public void testGetBeansByType() {
		System.out.println(SpringContextHelper.getBeansByType(StartupService.class));
	}

}
