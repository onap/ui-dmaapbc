package org.openecomp.dcae.dmaapbc.dbcapp.controller;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.openecomp.dcae.dmaapbc.dbcapp.service.DmaapAccessService;
import org.openecomp.portalsdk.core.controller.UnRestrictedBaseController;
import org.openecomp.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.openecomp.portalsdk.core.util.SystemProperties;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * This controller responds to probes for application health, returning a JSON
 * body to indicate current status.
 */
@RestController
@Configuration
@EnableAspectJAutoProxy
@RequestMapping("/")
public class HealthCheckController extends UnRestrictedBaseController {

	private EELFLoggerDelegate logger = EELFLoggerDelegate.getLogger(HealthCheckController.class);

	private static final String HEALTH_CHECK_PATH = "/healthCheck";

	@Autowired
	private DmaapAccessService dmaapAccessService;

	/**
	 * Model for JSON response with health-check results.
	 */
	public class HealthStatus {
		// Either 200 or 500
		public int statusCode;
		// Additional detail in case of error, empty in case of success.
		public String message;

		public HealthStatus(int code, String msg) {
			this.statusCode = code;
			this.message = msg;
		}

		public int getStatusCode() {
			return statusCode;
		}

		public void setStatusCode(int code) {
			this.statusCode = code;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String msg) {
			this.message = msg;
		}
	}

	/**
	 * Checks application health by making a trivial query to the database.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return 200 if database access succeeds, 500 if it fails.
	 */
	@RequestMapping(value = { HEALTH_CHECK_PATH }, method = RequestMethod.GET, produces = "application/json")
	public HealthStatus healthCheck(HttpServletRequest request) {
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		HealthStatus healthStatus = null;
		try {
			logger.debug(EELFLoggerDelegate.debugLogger, "Performing health check");
			dmaapAccessService.getDmaapAccessCount();
			healthStatus = new HealthStatus(200, "health check succeeded");
		} catch (Exception ex) {
			logger.error(EELFLoggerDelegate.errorLogger, "Failed to perform health check", ex);
			healthStatus = new HealthStatus(500, "health check failed: " + ex.toString());
		}
		return healthStatus;
	}

	/**
	 * This implementation does not support suspend/resume.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return Trivial success
	 */
	@RequestMapping(value = {
			HEALTH_CHECK_PATH + "/suspend" }, method = RequestMethod.GET, produces = "application/json")
	public HealthStatus healthCheckSuspend(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		HealthStatus response = new HealthStatus(200, "suspend not implemented");
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * This implementation does not support suspend/resume.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return Trivial success
	 */
	@RequestMapping(value = {
			HEALTH_CHECK_PATH + "/resume" }, method = RequestMethod.GET, produces = "application/json")
	public HealthStatus healthCheckResume(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		HealthStatus response = new HealthStatus(200, "resume not implemented");
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}

	/**
	 * Answers ping request without checking the application health.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return Trivial success
	 */
	@RequestMapping(value = { HEALTH_CHECK_PATH + "/ping" }, method = RequestMethod.GET, produces = "application/json")
	public HealthStatus ping(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		HealthStatus response = new HealthStatus(200, "ping received");
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return response;
	}
}
