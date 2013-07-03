/**
 * 
 */
package com.eccom.todo.test.dao;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author alex
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"/jpa.xml","/applicationContext.xml","/mail-spring.xml"})
public class DaoTestBase {

}
