/**
 * 
 */
package com.eccom.todo.common;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;

/**
 * @author alex
 *
 */
@SuppressWarnings("rawtypes")
public class ApplicationStartup implements ApplicationListener {

	private List<StartupService> startList;
	
	@Override
	public void onApplicationEvent(ApplicationEvent event) {
		if(event instanceof ContextRefreshedEvent) {
			if(event.getSource() instanceof XmlWebApplicationContext) {
				XmlWebApplicationContext src = (XmlWebApplicationContext) event.getSource();
				// root
				if(src.getNamespace() == null) {
					printStartupInfo();
					
					initServicesStart();
				}
			}
			// for test
			else if(event.getSource() instanceof GenericApplicationContext) {
				printStartupInfo();
				
				initServicesStart();
			}
		}
	}	
	
	private DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private void printStartupInfo() {
		String date = df.format(new Date());
		System.out.println("======================================");
		System.out.println("=====   BMC Application Started  =====");
		System.out.println("=====   "+date+			  "      =====");
		System.out.println("======================================");
	}
	
	private void initServicesStart() {
		for(StartupService ss:startList) {
			ss.start();
		}
	}
	
	public List<StartupService> getStartList() {
		return startList;
	}


	public void setStartList(List<StartupService> startList) {
		this.startList = startList;
	}

}
