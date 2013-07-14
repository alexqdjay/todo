package com.eccom.todo.test;


import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"/jpa.xml","/applicationContext.xml",
		"/mail-spring.xml","/app-servlet.xml","/spring-ws-servlet.xml"})
public class ContextLoader_Test {

}
