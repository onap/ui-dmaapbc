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
package org.openecomp.dmaapbc.dbcapp.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.jar.Attributes;
import java.util.jar.Manifest;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.openecomp.portalsdk.core.controller.RestrictedBaseController;
import org.openecomp.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * This controller responds to a request for the web application manifest,
 * returning a JSON with the information that was created at build time.
 * 
 * Manifest entries have names with hyphens, which means Javascript code can't
 * simply use the shorthand object.key; instead use object['key'].
 */
@RestController
@Configuration
@EnableAspectJAutoProxy
@RequestMapping("/")
public class ManifestController extends RestrictedBaseController {

	private EELFLoggerDelegate logger = EELFLoggerDelegate.getLogger(ManifestController.class);

	/**
	 * Required to obtain the webapp manifest.
	 */
	@Autowired
	ServletContext context;

	/**
	 * Gets the content of the webapp manifest file META-INF/MANIFEST.MF.
	 * 
	 * @return Attributes object with key-value pairs from the manifest
	 * @throws IOException
	 */
	private Attributes getWebappManifest() throws IOException {
		// Path to resource on classpath
		final String MANIFEST_RESOURCE_PATH = "/META-INF/MANIFEST.MF";
		// Manifest is formatted as Java-style properties
		InputStream inputStream = context.getResourceAsStream(MANIFEST_RESOURCE_PATH);
		if (inputStream == null)
			throw new IOException("getWebappManifest: failed to get resource at path " + MANIFEST_RESOURCE_PATH);
		Manifest manifest = new Manifest(inputStream);
		inputStream .close();
		return manifest.getMainAttributes();
	}

	/**
	 * Gets the webapp manifest contents as a JSON object.
	 * 
	 * @param request
	 * @return A map of key-value pairs. On success:
	 * 
	 *         <pre>
	 * { "manifest" : { "key1": "value1", "key2": "value2" } }
	 *         </pre>
	 * 
	 *         On failure:
	 * 
	 *         <pre>
	 * { "error": "message" }
	 *         </pre>
	 */
	@RequestMapping(value = { "/manifest" }, method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public Map<String, Object> getManifest(HttpServletRequest request) {
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		Map<String, Object> response = new HashMap<String, Object>();
		try {
			Attributes attributes = getWebappManifest();
			response.put("manifest", attributes);
		} catch (Exception ex) {
			logger.error(EELFLoggerDelegate.errorLogger, "getManifest: failed to read manifest", ex);
			response.put("error", "failed to get manifest: " + ex.toString());
		}
		return response;
	}

}
