package org.openecomp.dcae.dmaapbc.dbcapp.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.openecomp.dcae.dmaapbc.dbcapp.util.DbcappProperties;
import org.openecomp.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.openecomp.portalsdk.core.util.SystemProperties;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Data Router controller: serves Ajax requests made by Angular scripts on pages
 * that show feeds, publishers and subscribers.
 */
@Controller
@RequestMapping("/")
public class DataRouterController extends DbcappRestrictedBaseController {

	private static EELFLoggerDelegate logger = EELFLoggerDelegate.getLogger(DataRouterController.class);

	/**
	 * Application properties - NOT available to constructor.
	 */
	@Autowired
	private DbcappProperties appProperties;

	private static final String FEED_PATH = "/dr_feed";
	private static final String PUB_PATH = "/dr_pub";
	private static final String SUB_PATH = "/dr_sub";

	public DataRouterController() {
	}

	/**
	 * Answers a request for one page of data router feeds.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return Result of
	 *         {@link #getItemListForPageWrapper(HttpServletRequest, DmaapDataItem)}
	 */
	@RequestMapping(value = { FEED_PATH }, method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String getDRFeedsByPage(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = getItemListForPageWrapper(request, DmaapDataItem.DR_FEED);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Answers a request for one page of data router publishers.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return Result of
	 *         {@link #getItemListForPageWrapper(HttpServletRequest, DmaapDataItem)}
	 */
	@RequestMapping(value = { PUB_PATH }, method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String getDRPubsByPage(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = getItemListForPageWrapper(request, DmaapDataItem.DR_PUB);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Answers a request for one page of data router subscribers.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return Result of
	 *         {@link #getItemListForPageWrapper(HttpServletRequest, DmaapDataItem)}
	 */
	@RequestMapping(value = { SUB_PATH }, method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String getDRSubsByPage(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = getItemListForPageWrapper(request, DmaapDataItem.DR_SUB);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Adds a feed with the specified information. Expects a JSON block in the
	 * request body - a Feed object.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return a JSON object; on success it has a "status" and possibly a "data"
	 *         item; on failure, also has an "error" item.
	 */
	@RequestMapping(value = { FEED_PATH }, method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public String addDRFeed(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = addItem(request, DmaapDataItem.DR_FEED, null);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Adds a publisher with the specified information. Expects a JSON block in
	 * the request body - a DR_Pub object.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return a JSON object; on success it has a "status" and possibly a "data"
	 *         item; on failure, also has an "error" item.
	 */
	@RequestMapping(value = { PUB_PATH }, method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public String addDRPub(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = addItem(request, DmaapDataItem.DR_PUB, HttpServletResponse.SC_CREATED);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Adds a subscriber with the specified information. Expects a JSON block in
	 * the request body - a DR_Sub object.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return a JSON object; on success it has a "status" and possibly a "data"
	 *         item; on failure, also has an "error" item.
	 */
	@RequestMapping(value = { SUB_PATH }, method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public String addDRSub(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = addItem(request, DmaapDataItem.DR_SUB, HttpServletResponse.SC_CREATED);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Updates a feed with the specified information. Expects a JSON block in
	 * the request body - a Feed object.
	 * 
	 * @param id
	 *            Path parameter with object ID
	 * @param request
	 *            HttpServletRequest
	 * @return a JSON object; on success it has a "status" and possibly a "data"
	 *         item; on failure, also has an "error" item.
	 */
	@RequestMapping(value = { FEED_PATH + "/{id}" }, method = RequestMethod.PUT, produces = "application/json")
	@ResponseBody
	public String updateFeed(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = updateItem(request, DmaapDataItem.DR_FEED, Long.toString(id), null);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Updates a publisher with the specified information. Expects a JSON block
	 * in the request body - a DR_Pub object.
	 * 
	 * The pubId may have a dot in it. Spring, in its infinite wisdom, truncates
	 * extensions on dotted path parameters; e.g., "foo.json" becomes "foo".
	 * Avoid truncation here with the extra ":.+" incantation at the end.
	 * 
	 * @param id
	 *            Path parameter with object ID
	 * @param request
	 *            HttpServletRequest
	 * @return a JSON object; on success it has a "status" and possibly a "data"
	 *         item; on failure, also has an "error" item.
	 */
	@RequestMapping(value = { PUB_PATH + "/{id:.+}" }, method = RequestMethod.PUT, produces = "application/json")
	@ResponseBody
	public String updateDRPub(@PathVariable("id") String id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = updateItem(request, DmaapDataItem.DR_PUB, id, null);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Updates a subscriber with the specified information. Expects a JSON block
	 * in the request body - a DR_Sub object.
	 * 
	 * @param id
	 *            Path parameter with object ID
	 * @param request
	 *            HttpServletRequest
	 * @return a JSON object; on success it has a "status" and possibly a "data"
	 *         item; on failure, also has an "error" item.
	 */
	@RequestMapping(value = { SUB_PATH + "/{id}" }, method = RequestMethod.PUT, produces = "application/json")
	@ResponseBody
	public String updateDRSub(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = updateItem(request, DmaapDataItem.DR_SUB, Long.toString(id), null);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Deletes a feed with the ID specified as a path parameter. On successful
	 * delete the endpoint returns 204 (confusingly).
	 * 
	 * @param id
	 *            Path parameter with object ID
	 * @param request
	 *            HttpServletRequest
	 * @return A JSON object as an HTTP response; on success it only has
	 *         "status" item; on failure, also has an "error" item.
	 */
	@RequestMapping(value = { FEED_PATH + "/{id}" }, method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public String deleteDRFeed(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = deleteItem(request, DmaapDataItem.DR_FEED, Long.toString(id), 204);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Deletes the publisher with the ID specified as a path parameter.
	 * 
	 * The pubId may have a dot in it. Spring, in its infinite wisdom, truncates
	 * extensions on dotted path parameters; e.g., "foo.json" becomes "foo".
	 * Avoid truncation here with the extra ":.+" incantation at the end.
	 * 
	 * @param id
	 *            Path parameter with object ID
	 * @param request
	 *            HttpServletRequest
	 * @return a JSON object; on success it only has "status" item; on failure,
	 *         also has an "error" item.
	 */
	@RequestMapping(value = { PUB_PATH + "/{id:.+}" }, method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public String deleteDRPub(@PathVariable("id") String id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = deleteItem(request, DmaapDataItem.DR_PUB, id, null);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Deletes the subscriber with the ID specified as a path parameter.
	 * 
	 * @param id
	 *            Path parameter with object ID
	 * @param request
	 *            HttpServletRequest
	 * @return A JSON object; on success it only has "status" item; on failure,
	 *         also has an "error" item.
	 */
	@RequestMapping(value = { SUB_PATH + "/{id}" }, method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public String deleteDRSub(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = deleteItem(request, DmaapDataItem.DR_SUB, Long.toString(id), 204);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Answers a request for data router feed classification labels, such as
	 * "Customer Proprietary", which are read from properties.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return List of string values
	 */
	@RequestMapping(value = { FEED_PATH + "_pii_types" }, method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public List<String> getDRFeedPiiType(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		ArrayList<String> response = new ArrayList<>();
		String[] propKeys = appProperties.getCsvListProperty(DbcappProperties.DMAAP_PII_TYPE_LIST);
		for (String key : propKeys) 
			response.add(appProperties.getProperty(key));
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

}
