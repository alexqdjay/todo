/**
 * 
 */
package com.eccom.todo.dao.impl;

import java.lang.reflect.ParameterizedType;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.eccom.todo.dao.CommonDao;

/**
 * @author alex
 *
 */
public class CommonDaoSupport<T> extends HibernateDaoSupport implements CommonDao<T>{
	
	protected final Class<T> entityClass = initEntityClass();
	
	private Class<T> initEntityClass() {
		@SuppressWarnings("unchecked")
		Class<T> tmpClass = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
		return tmpClass;
	}
	
	@Autowired
	public void setHT(HibernateTemplate h) {
		super.setHibernateTemplate(h);
	}

	@Override
	public int create(T model) {
		return (Integer) getHibernateTemplate().save(model);
	}

	@Override
	public void update(T model) {
		getHibernateTemplate().merge(model);
	}

	@SuppressWarnings("unchecked")
	@Override
	public T find(int id) {
		@SuppressWarnings("rawtypes")
		List list = getHibernateTemplate().find("From "+ entityClass.getName() + " m where m.id=?",id);
		if(list != null && list.size()>0) {
			return (T) list.get(0);
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<T> findByExample(Object explame) {
		return getHibernateTemplate().findByExample(explame);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> select(String sql, Object... args) {
		return Collections.checkedList(getHibernateTemplate().find(sql,args),entityClass);
	}

	@Override
	public void delete(T model) {
		getHibernateTemplate().delete(model);
	}

	@Override
	public void delete(List<T> list) {
		if(list == null) return;
		for(T model:list) {
			delete(model);
		}
	}

	
}
