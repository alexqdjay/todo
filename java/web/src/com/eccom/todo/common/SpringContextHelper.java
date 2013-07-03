/**
 * 
 */
package com.eccom.todo.common;

import java.lang.annotation.Annotation;
import java.util.Map;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * @author alex
 *
 */
@Component
public class SpringContextHelper implements ApplicationContextAware {

	public static ApplicationContext applicationContext;
	
	@SuppressWarnings("static-access")
	@Override
	public void setApplicationContext(ApplicationContext ac)
			throws BeansException {
		this.applicationContext = ac;
	}
	
	
	/**
	 * Get bean by name and class
	 * 
	 * @param name
	 * @param clazz
	 * @return
	 */
	public static <T>T getBean(String name,Class<T> clazz) {
		return applicationContext.getBean(name, clazz);
	}
	
	/**
	 * @param annotationType
	 * @return Map<String, Object>
	 */
	public static Map<String, Object> getBeansByAnnotation(Class<? extends Annotation> annotationType) {
		return applicationContext.getBeansWithAnnotation(annotationType);
	}
	
	public static Map<String, ?> getBeansByType(Class<?> type) {
		return applicationContext.getBeansOfType(type);
	}
	
}
