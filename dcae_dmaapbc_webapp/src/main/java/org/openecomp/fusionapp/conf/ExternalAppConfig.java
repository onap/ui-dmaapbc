/*-
 * ================================================================================
 * DCAE DMaaP Bus Controller Web Application
 * ================================================================================
 * Copyright (C) 2017 AT&T Intellectual Property
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ================================================================================
 */
package org.openecomp.fusionapp.conf;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.openecomp.fusionapp.uebhandler.InitUebHandler;
import org.openecomp.fusionapp.uebhandler.MainUebHandler;
import org.openecomp.fusionapp.uebhandler.WidgetNotificationHandler;
import org.openecomp.portalsdk.core.conf.AppConfig;
import org.openecomp.portalsdk.core.conf.Configurable;
import org.openecomp.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.openecomp.portalsdk.core.objectcache.AbstractCacheManager;
import org.openecomp.portalsdk.core.service.DataAccessService;
import org.openecomp.portalsdk.core.util.CacheManager;
import org.openecomp.portalsdk.core.util.SystemProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

/**
 * Configures Spring features in the DMaaP Bus Control web application.
 * Subclasses the ECOMP Portal SDK core AppConfig class to reuse interceptors,
 * view resolvers and other features defined there.
 */
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = { "org.openecomp" } )
@PropertySource(value = { "${container.classpath:}/WEB-INF/conf/app/test.properties" }, ignoreResourceNotFound = true)
@Profile("src")
@EnableAsync
@EnableScheduling
public class ExternalAppConfig extends AppConfig implements Configurable {
	
	EELFLoggerDelegate logger = EELFLoggerDelegate.getLogger(ExternalAppConfig.class);
	
	// private RegistryAdapter schedulerRegistryAdapter;

	@Configuration
	@Import(SystemProperties.class)
	static class InnerConfiguration {
	}

	/**
	 * @see org.openecomp.portalsdk.core.conf.AppConfig#viewResolver()
	 */
	public ViewResolver viewResolver() {
		return super.viewResolver();
	}

	/**
	 * @see org.openecomp.portalsdk.core.conf.AppConfig#addResourceHandlers(ResourceHandlerRegistry)
	 * 
	 * @param registry
	 */
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		super.addResourceHandlers(registry);
	}

	/**
	 * @see org.openecomp.portalsdk.core.conf.AppConfig#dataAccessService()
	 */
	public DataAccessService dataAccessService() {
		return super.dataAccessService();
	}

	/**
	 * Creates a new list with entries that are external app
	 * definitions.xml paths.
	 * 
	 * @return List of String
	 */
	public List<String> addTileDefinitions() {
		List<String> definitions = new ArrayList<String>();
		definitions.add("/WEB-INF/defs/definitions.xml");
		definitions.add("/WEB-INF/dbcapp/dbcapp-definitions.xml");
		if (logger.isDebugEnabled())
			logger.debug(EELFLoggerDelegate.debugLogger, "addTileDefinitions: list is " + definitions);
		return definitions;
	}

	/**
	 * Adds request interceptors to the specified registry by calling
	 * {@link AppConfig#addInterceptors(InterceptorRegistry)}, but excludes
	 * certain paths from the session timeout interceptor.
	 */
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		super.setExcludeUrlPathsForSessionTimeout("/login_external", "*/login_external.htm", "login", "/login.htm",
				"/api*","/single_signon.htm","/single_signon");
		super.addInterceptors(registry);
	}

	/**
	 * Creates and returns a new instance of a {@link CacheManager} class.
	 * 
	 * @return New instance of {@link CacheManager}
	 */
	@Bean
	public AbstractCacheManager cacheManager() {
		return new CacheManager();
	}
	
	@PostConstruct
	public void initGlobalLocalContext() {
		// logger.init();
	}

	
	/**
	 * Creates and returns a new instance of a {@link MainUebHandler}. 
	 * 
	 * @return New instance of {@link MainUebHandler}.
	 */
	@Bean
	public MainUebHandler mainUebHandler() {
		
		return new MainUebHandler();
	}
	
	/**
	 * Creates and returns a new instance of a {@link InitUebHandler}.  
	 * 
	 * @return New instance of {@link InitUebHandler}.
	 */
	@Bean
	public InitUebHandler initUebHandler() {
		
		return new InitUebHandler();
	}

	/**
	 * Creates and returns a new instance of a {@link WidgetNotificationHandler}
	 * .
	 * 
	 * @return New instance of {@link WidgetNotificationHandler}.
	 */
	@Bean
	public WidgetNotificationHandler widgetNotificationHandler() {
		return new WidgetNotificationHandler();
	}
	
	/**
	 * Creates and returns a new instance of a {@link SchedulerFactoryBean} and
	 * populates it with triggers.
	 * 
	 * @return New instance of {@link SchedulerFactoryBean}
	 * @throws Exception 
	 */
	// APPLICATIONS REQUIRING QUARTZ SHOULD RESTORE ANNOTATION
	/*
	@Bean // ANNOTATION COMMENTED OUT 
	public SchedulerFactoryBean schedulerFactoryBean() throws Exception {
		SchedulerFactoryBean scheduler = new SchedulerFactoryBean();
		scheduler.setTriggers(schedulerRegistryAdapter.getTriggers());
		scheduler.setConfigLocation(appApplicationContext.getResource("WEB-INF/conf/quartz.properties"));
		scheduler.setDataSource(dataSource());
		return scheduler;
	}
	*/

	
	/**
	 * Sets the scheduler registry adapter.
	 * 
	 * @param schedulerRegistryAdapter
	 */
	/*
	@Autowired
	public void setSchedulerRegistryAdapter(final RegistryAdapter schedulerRegistryAdapter) {
		this.schedulerRegistryAdapter = schedulerRegistryAdapter;
	}
	*/
}
