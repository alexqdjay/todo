/**
 * 
 */
package com.eccom.todo.dao;

import java.util.List;

/**
 * @author alex
 *
 */
public interface CommonDao<T> {
	
	public int create(T model);
	
	public void update(T model);
	
	public T find(int id);
	
	public List<T> findByExample(Object explame);
	
	public List<T> select(String sql,Object... args);
	
	public void delete(T model);
	
	public void delete(List<T> list);
	
}
