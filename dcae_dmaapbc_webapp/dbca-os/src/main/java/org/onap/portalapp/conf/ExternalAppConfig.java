/*-
 * ================================================================================
 * ECOMP Portal SDK
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
package org.onap.portalapp.conf;

import java.util.ArrayList;
import java.util.List;

import org.onap.portalapp.login.LoginStrategyImpl;
import org.onap.portalapp.scheduler.LogRegistry;
import org.onap.portalsdk.core.auth.LoginStrategy;
import org.onap.portalsdk.core.conf.AppConfig;
import org.onap.portalsdk.core.conf.Configurable;
import org.onap.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.onap.portalsdk.core.objectcache.AbstractCacheManager;
import org.onap.portalsdk.core.service.DataAccessService;
import org.onap.portalsdk.core.util.CacheManager;
import org.onap.portalsdk.core.util.SystemProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
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
@ComponentScan(basePackages = "org.openecomp, org.onap",
		// Exclude unused annotated classes with heavy dependencies.
		excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = {
				// EPSDK-Analytics
				org.onap.portalsdk.analytics.system.fusion.adapter.FusionAdapter.class,
				org.onap.portalsdk.analytics.system.fusion.adapter.RaptorAdapter.class,
				org.onap.portalsdk.analytics.system.fusion.web.RaptorController.class,
				org.onap.portalsdk.analytics.system.fusion.web.RaptorControllerAsync.class,
				org.onap.portalsdk.analytics.system.fusion.DbUtils.class,
				// EPSDK-App-Common
				org.onap.portalapp.controller.sample.ElasticSearchController.class, 
				LogRegistry.class, 
				org.onap.portalapp.controller.sample.PostDroolsController.class,
				// EPSDK-Core
				org.onap.portalsdk.core.scheduler.CoreRegister.class,
				org.onap.portalsdk.core.scheduler.CronRegistry.class,
				org.onap.portalsdk.core.service.PostDroolsService.class 
				}))
@Profile("src")
@EnableAsync
@EnableScheduling
public class ExternalAppConfig extends AppConfig implements Configurable {

	EELFLoggerDelegate logger = EELFLoggerDelegate.getLogger(ExternalAppConfig.class);

	@Configuration
	@Import(SystemProperties.class)
	static class InnerConfiguration {
	}

	/*
	 * (non-Javadoc)
	 * @see org.onap.portalsdk.core.conf.AppConfig#viewResolver()
	 */
	public ViewResolver viewResolver() {
		return super.viewResolver();
	}

	/*
	 * (non-Javadoc)
	 * @see org.onap.portalsdk.core.conf.AppConfig#addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry)
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		super.addResourceHandlers(registry);
	}

	/*
	 * (non-Javadoc)
	 * @see org.onap.portalsdk.core.conf.AppConfig#dataAccessService()
	 */
	@Override
	public DataAccessService dataAccessService() {
		// Echo the JDBC URL to assist developers when starting the app.
		systemProperties();
		System.out.println("ExternalAppConfig: " + SystemProperties.DB_CONNECTIONURL + " is "
				+ SystemProperties.getProperty(SystemProperties.DB_CONNECTIONURL));
		return super.dataAccessService();
	}

	/**
	 * Creates a new list with a single entry that is the external app
	 * definitions.xml path.
	 * 
	 * @return List of String, size 1
	 */
	@Override
	public List<String> addTileDefinitions() {
		List<String> definitions = new ArrayList<String>();
		// DBC does not need the sample page:
		// definitions.add("/WEB-INF/defs/definitions.xml");
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
				"/api*", "/single_signon.htm", "/single_signon");
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

/*
	@Bean
	public FusionLicenseManager fusionLicenseManager() {
		return new FusionLicenseManagerImpl();
	}

	@Bean
	public FusionLicenseManagerUtils fusionLicenseManagerUtils() {
		return new FusionLicenseManagerUtils();
	}
*/

	@Bean
	public LoginStrategy loginStrategy() {
		return new LoginStrategyImpl();
	}
}
