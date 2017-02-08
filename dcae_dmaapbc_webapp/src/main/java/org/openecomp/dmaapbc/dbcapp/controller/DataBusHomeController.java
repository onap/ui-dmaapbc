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

import java.text.DateFormat;
import java.text.SimpleDateFormat;

import javax.servlet.ServletException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * This controller maps requests for the DMaaP-BC-App's landing page, which is
 * an Angular single-page application.
 */
@Controller
@RequestMapping("/")
public class DataBusHomeController extends DbcappRestrictedBaseController {

	public static final String APP_NAME = "dmaap-bc-app";
	public static final DateFormat logDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

	/**
	 * At one time I published the landing page as simply "/dbc", but it can
	 * also be accessed with a default suffix; e.g., "/dbc.htm".
	 * 
	 * @return View name key, which is resolved to a file using an Apache tiles
	 *         "definitions.xml" file.
	 * @throws ServletException
	 */
	@RequestMapping(value = { "/dbc" }, method = RequestMethod.GET)
	public ModelAndView dbcDefaultController() throws ServletException {
		// a model is only useful for JSP; this app is angular.
		return new ModelAndView("dbc_home_tdkey");
	}

}
