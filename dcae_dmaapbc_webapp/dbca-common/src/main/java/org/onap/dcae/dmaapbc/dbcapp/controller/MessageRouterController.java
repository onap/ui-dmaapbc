package org.onap.dcae.dmaapbc.dbcapp.controller;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.onap.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.onap.portalsdk.core.util.SystemProperties;
import org.slf4j.MDC;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Message Router controller: serves Ajax requests made by Angular scripts on
 * pages that show topics and clients.
 */
@Controller
@RequestMapping("/")
public class MessageRouterController extends DbcappRestrictedBaseController {

	private static EELFLoggerDelegate logger = EELFLoggerDelegate.getLogger(MessageRouterController.class);

	private static final String TOPIC_PATH = "/mr_topic";
	private static final String CLIENT_PATH = "/mr_client";

	public MessageRouterController() {
	}

	/**
	 * Answers a request for one page of message router topics. See
	 * {@link #getItemListForPageWrapper(HttpServletRequest, DmaapDataItem)}
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return One page of MR topics
	 */
	@RequestMapping(value = { TOPIC_PATH }, method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String getMRTopicsByPage(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = getItemListForPageWrapper(request, DmaapDataItem.MR_TOPIC);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Answers a request for one page of message router clients. See
	 * {@link #getItemListForPageWrapper(HttpServletRequest, DmaapDataItem)}
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return One page of MR clients
	 */
	@RequestMapping(value = { CLIENT_PATH }, method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String getMRClientsByPage(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = getItemListForPageWrapper(request, DmaapDataItem.MR_CLIENT);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Adds a topic with the specified information. Expects a JSON block in the
	 * request body - a Topic object.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return JSON success/failure response
	 */
	@RequestMapping(value = { TOPIC_PATH }, method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public String addTopic(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = addItem(request, DmaapDataItem.MR_TOPIC, HttpServletResponse.SC_CREATED);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Adds a client with the specified information. Expects a JSON block in the
	 * request body - a MR_Client object.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return JSON success/failure response
	 */
	@RequestMapping(value = { CLIENT_PATH }, method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public String addMRClient(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = addItem(request, DmaapDataItem.MR_CLIENT, HttpServletResponse.SC_CREATED);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Updates a topic with the specified information. Expects a JSON block in
	 * the request body - a Topic object.
	 * 
	 * Writes a JSON object as an HTTP response; on success it has a "status"
	 * and possibly a "data" item; on failure, also has an "error" item.
	 * 
	 * @param id
	 *            ID of the topic to update
	 * @param request
	 *            HttpServletRequest
	 * @return JSON success/failure response
	 */
	@RequestMapping(value = { TOPIC_PATH + "/{id}" }, method = RequestMethod.PUT, produces = "application/json")
	@ResponseBody
	public String updateTopic(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = updateItem(request, DmaapDataItem.MR_TOPIC, Long.toString(id), null);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Updates a client with the specified information. Expects a JSON block in
	 * the request body - a MR_Client object.
	 * 
	 * Writes a JSON object as an HTTP response; on success it has a "status"
	 * and possibly a "data" item; on failure, also has an "error" item.
	 * 
	 * @param id
	 *            ID of the client to update
	 * @param request
	 *            HttpServletRequest
	 * @return JSON success/failure response
	 */
	@RequestMapping(value = { CLIENT_PATH + "/{id}" }, method = RequestMethod.PUT, produces = "application/json")
	@ResponseBody
	public String updateMRClient(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = updateItem(request, DmaapDataItem.MR_CLIENT, Long.toString(id), null);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Deletes a topic with the FQTN ID specified as a path parameter.
	 * 
	 * FQTN is a string of dot-separated names. Spring, in its infinite wisdom,
	 * truncates extensions on dotted path parameters; e.g., "foo.json" becomes
	 * "foo". Avoid truncation here with the extra ":.+" incantation at the end.
	 * 
	 * Writes a JSON object as an HTTP response; on success it only has "status"
	 * item; on failure, also has an "error" item.
	 * 
	 * @param id
	 *            Path parameter with object ID
	 * @param request
	 *            HttpServletRequest
	 * @return JSON success/failure response
	 */
	@RequestMapping(value = { "/mr_topic/{id:.+}" }, method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public String deleteTopic(@PathVariable("id") String id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = deleteItem(request, DmaapDataItem.MR_TOPIC, id, 204);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Deletes a client with the mrClientId specified as a path parameter.
	 * 
	 * Writes a JSON object as an HTTP response; on success it only has "status"
	 * item; on failure, also has an "error" item.
	 * 
	 * @param id
	 *            Path parameter with object ID
	 * @param request
	 *            HttpServletRequest
	 * @return JSON success/failure response
	 */
	@RequestMapping(value = { "/mr_client/{id}" }, method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public String deleteMRClient(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String response = deleteItem(request, DmaapDataItem.MR_CLIENT, Long.toString(id), null);
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

}
