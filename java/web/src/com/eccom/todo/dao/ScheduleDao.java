/**
 * 
 */
package com.eccom.todo.dao;

import java.util.Map;

/**
 * @author alex
 *
 */
public interface ScheduleDao {
	
	public Map<String, Object> findOne(int id);
}
