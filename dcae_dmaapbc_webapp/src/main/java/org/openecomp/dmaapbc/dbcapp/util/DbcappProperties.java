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
package org.openecomp.dmaapbc.dbcapp.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

/**
 * Publishes a list of constants and methods to access the properties that are
 * read by Spring from the specified configuration file(s).
 * 
 * Should be used like this (and never in a constructor):
 * 
 * <pre>
 * &#64;Autowired
 * DbcappProperties properties;
 * </pre>
 */
@Configuration
@PropertySource(value = { "${container.classpath:}/WEB-INF/dbcapp/dbcapp.properties" })
public class DbcappProperties {

	public static final String DMAAP_REST_URL_LIST = "dmaap.rest.url.list";
	public static final String DMAAP_MECHID_NAME = "dmaap.mechid.name";
	public static final String DMAAP_MECHID_PASSWORD = "dmaap.mechid.password";
	public static final String PROFILE_ACCESS_METHOD = "profile.access.method";
	public static final String PROFILE_USVC_URL = "profile.microservice.url";
	public static final String PROFILE_USVC_USER = "profile.microservice.user.name";
	public static final String PROFILE_USVC_PASS = "profile.microservice.user.password";

	private Environment environment;

	public DbcappProperties() {
	}

	protected Environment getEnvironment() {
		return environment;
	}

	@Autowired
	public void setEnvironment(final Environment environment) {
		this.environment = environment;
	}

	public boolean containsProperty(String key) {
		return environment.containsProperty(key);
	}

	public String getProperty(String key) {
		return environment.getRequiredProperty(key);
	}

	/**
	 * Gets the values for a comma-separated list property value as a String
	 * array.
	 * 
	 * @param key
	 * @return Array of values with leading and trailing whitespace removed;
	 *         null if key is not found.
	 */
	public String[] getCsvListProperty(final String key) {
		String listVal = getProperty(key);
		if (listVal == null)
			return null;
		String[] vals = listVal.split("\\s*,\\s*");
		return vals;
	}

}
