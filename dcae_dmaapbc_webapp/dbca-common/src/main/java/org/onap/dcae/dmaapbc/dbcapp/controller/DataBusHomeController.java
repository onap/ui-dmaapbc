package org.onap.dcae.dmaapbc.dbcapp.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

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
	 */
	@RequestMapping(value = { "/dbc" }, method = RequestMethod.GET)
	public ModelAndView dbcDefaultController() {
		// a model is only useful for JSP; this app is angular.
		return new ModelAndView("dbc_home_tdkey");
	}

}
