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
package org.openecomp.fusionapp.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.openecomp.portalsdk.core.controller.RestrictedBaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Controller for a network map view that uses iframes. The view is restricted
 * to authenticated users.
 */
@Controller
@RequestMapping("/")
public class NetMapController extends RestrictedBaseController {

	@RequestMapping(value = { "/net_map" }, method = RequestMethod.GET)
	public ModelAndView plot(HttpServletRequest request) {
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("frame_int", "net_map_int");
		// This view resolves to page frame_insert.jsp
		return new ModelAndView("frame_insert", model);
	}

	@RequestMapping(value = { "/net_map_int" }, method = RequestMethod.GET)
	public ModelAndView plot2() {
		// The view name defaults to the request without any suffix.
		final String defaultViewName = null;
		// This view resolves to page net_map.jsp
		return new ModelAndView(defaultViewName);
	}

}