package com.eccom.todo.test.dao;

import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.eccom.todo.dao.ScheduleDao;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"classpath*:applicationContext.xml","/jpa.xml","/mail-spring.xml"})
public class ScheduleDao_Test {

	@Autowired
	public ScheduleDao scheduleDao;
	
	@Test
	public void testFindOne() {
		Map map = scheduleDao.findOne(70);
		System.out.println(map);
	}

}
