/*-
 * ================================================================================
 * DCAE DMaaP Bus Controller REST Client
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
package org.openecomp.dcae.dmaap.bcapi.client;

public interface IRestClientConstants {

	/**
	 * Default configuration file to be found on classpath
	 */
	public static final String PROPERTY_FILE_NAME = "bc-rest-client.properties";

	/** Base URL of the Bus Controller REST service API; e.g., 
	 * 
	 */
	public static final String DMAAP_BUS_CONTROLLER_REST_URL = "dmaap_bus_controller_rest_url";

	
}
