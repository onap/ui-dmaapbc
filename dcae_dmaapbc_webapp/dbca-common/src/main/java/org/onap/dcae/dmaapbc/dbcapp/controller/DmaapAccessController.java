package org.onap.dcae.dmaapbc.dbcapp.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.onap.dcae.dmaapbc.client.DmaapBcRestClient;
import org.onap.dcae.dmaapbc.dbcapp.domain.DmaapAccess;
import org.onap.dcae.dmaapbc.model.Dmaap;
import org.onap.dcae.dmaapbc.model.DmaapObject;
import org.onap.dcae.dmaapbc.model.ErrorResponse;
import org.openecomp.portalsdk.core.domain.User;
import org.openecomp.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.openecomp.portalsdk.core.util.SystemProperties;
import org.openecomp.portalsdk.core.web.support.UserUtils;
import org.slf4j.MDC;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * DMaaP Access controller: serves Ajax requests made by Angular on pages where
 * the user adds, edits and deletes DMaaP access profiles. This controller must
 * defend the database against rogue requests including SQL injection attacks.
 */
@Controller
@RequestMapping("/")
public class DmaapAccessController extends DbcappRestrictedBaseController {

	/**
	 * Logger that conforms with ECOMP guidelines
	 */
	private static EELFLoggerDelegate logger = EELFLoggerDelegate.getLogger(DmaapAccessController.class);

	private static final String DMAAP_ACCESS_PATH = "/dmaap_access";
	private static final String SELECT_DMAAP_ACCESS_PATH = "/select_dmaap_access";

	/**
	 * For general use in these methods
	 */
	private final ObjectMapper mapper;

	/**
	 * Never forget that Spring autowires fields AFTER the constructor is
	 * called.
	 */
	public DmaapAccessController() {
		mapper = new ObjectMapper();
	}

	/**
	 * Gets a list of DMaaP access profiles for this user from the database and
	 * returns them in a JSON array nested within a response object. Traps errors and constructs an appropriate JSON block if an error
	 * happens.
	 * 
	 * See {@link #getOrInitDmaapAccessList(String)}.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return JSON with access profiles, or an error JSON if the request fails.
	 */
	@RequestMapping(value = { DMAAP_ACCESS_PATH }, method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String getDmaapAccessList(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("getDmaapAccessList: Failed to get Login ID");
			List<DmaapAccess> dbAccessList = getOrInitDmaapAccessList(appUser.getLoginId());
			// Wrap the list in the status indicator.
			Map<String, Object> model = new HashMap<String, Object>();
			model.put(STATUS_RESPONSE_KEY, new Integer(200));
			model.put(DATA_RESPONSE_KEY, dbAccessList);
			outboundJson = mapper.writeValueAsString(model);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to get DMaaP access profile list", ex);
		}
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return outboundJson;
	}

	/**
	 * Adds a DMaaP access profile for the requesting user ID; ignores any
	 * values for row ID and user ID in the body. Traps errors and
	 * constructs an appropriate JSON block if an error happens.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return Trivial JSON object indicating success or failure.
	 */
	@RequestMapping(value = { DMAAP_ACCESS_PATH }, method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public String addDmaapAccess(HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("addDmaapAccess: Failed to get Login ID");

			DmaapAccess dmaapAccess = mapper.readValue(request.getReader(), DmaapAccess.class);
			logger.debug("addDmaapAccess: received object: {} ", dmaapAccess);

			// Null out ID to get an auto-generated ID
			dmaapAccess.setId(null);
			// Overwrite any submitted user id
			dmaapAccess.setUserId(appUser.getLoginId());
			// Encrypt password
			if (dmaapAccess.getPassword() != null)
				dmaapAccess.encryptPassword(dmaapAccess.getPassword());

			// Create a new row
			getDmaapAccessService().saveDmaapAccess(dmaapAccess);

			// Answer success
			outboundJson = buildJsonSuccess(200, null);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to add DMaaP access profile", ex);
		}
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return outboundJson;
	}

	/**
	 * Updates a DMaaP access profile if the row user ID matches the requesting
	 * user ID. Traps errors and
	 * constructs an appropriate JSON block if an error happens. 
	 * 
	 * @param id
	 *            Path parameter with ID of the DMaaP access profile
	 * @param request
	 *            HttpServletRequest
	 * @return Trivial JSON object indicating success or failure.
	 */
	@RequestMapping(value = { DMAAP_ACCESS_PATH + "/{id}" }, method = RequestMethod.PUT, produces = "application/json")
	@ResponseBody
	public String updateDmaapAccess(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("updateDmaapAccess: Failed to get Login ID");

			DmaapAccess domainObj = getDmaapAccessService().getDmaapAccess(id);
			if (!appUser.getLoginId().equals(domainObj.getUserId()))
				throw new Exception("updateDmaapAccess: mismatch of appUser and row user ID");

			DmaapAccess dmaapAccess = mapper.readValue(request.getReader(), DmaapAccess.class);
			logger.debug("updateDmaapAccess: received object: {} ", dmaapAccess);

			// Use the path-parameter id; don't trust the one in the object
			dmaapAccess.setId(id);
			// Encrypt password if present
			if (dmaapAccess.getPassword() != null)
				dmaapAccess.encryptPassword(dmaapAccess.getPassword());

			// Update the existing row
			getDmaapAccessService().saveDmaapAccess(dmaapAccess);

			// Answer "OK"
			outboundJson = buildJsonSuccess(200, null);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to update DMaaP access profile", ex);
		}
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return outboundJson;
	}

	/**
	 * Deletes a DMaaP access profile if the row user ID matches the requesting
	 * user ID. Traps errors and
	 * constructs an appropriate JSON block if an error happens. 
	 * 
	 * @param id
	 *            Path parameter with ID of the DMaaP access profile
	 * @param request
	 *            HttpServletRequest
	 * @return Trivial JSON object indicating success or failure (altho this is
	 *         slightly contrary to conventions for a DELETE method)
	 */
	@RequestMapping(value = {
			DMAAP_ACCESS_PATH + "/{id}" }, method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public String deleteDmaapAccess(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("deleteDmaapAccess: Failed to get Login ID");
			// Validate that this user owns the row with the specified ID
			DmaapAccess domainObj = getDmaapAccessService().getDmaapAccess(id);
			if (!appUser.getLoginId().equals(domainObj.getUserId()))
				throw new Exception("deleteDmaapAccess: mismatch of appUser and row user ID");

			getDmaapAccessService().deleteDmaapAccess(id);

			// Answer "OK"
			outboundJson = buildJsonSuccess(200, null);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to delete DMaaP access profile", ex);
		}
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return outboundJson;
	}

	/**
	 * Gets the selected DMaaP access row for the requesting user.
	 * 
	 * See {@link #getSelectedDmaapAccess(String)}
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return JSON object with one DmaapAccessProfile, or an error
	 */
	@RequestMapping(value = { SELECT_DMAAP_ACCESS_PATH }, method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public String getSelectedDmaapAccessProfile(HttpServletRequest request)  {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("getSelectedDmaapAccessProfile: Failed to get Login ID");
			DmaapAccess selected = super.getSelectedDmaapAccess(appUser.getLoginId());
			// clone and decrypt
			DmaapAccess clear = new DmaapAccess(selected);
			try {
				clear.setPassword(clear.decryptPassword());
			} catch (Exception ex) {
				// Should never happen
				throw new RuntimeException("getSelectedDmaapAccessProfile: Failed to decrypt password", ex);
			}
			outboundJson = buildJsonSuccess(200, clear);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to get selected DMaaP access profile", ex);
		}
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return outboundJson;
	}

	/**
	 * Marks the DMaaP access row as selected (first choice) for the requesting
	 * user if the row user ID matches the requesting user ID. As a side effect,
	 * removes selected marking from all other user rows. Returns status,
	 * additionally an error message on failure. Traps errors and
	 * constructs an appropriate JSON block if an error happens.
	 * 
	 * Choice of PUT is fairly arbitrary - there is no body, but GET is for
	 * actions that do not change data.
	 * 
	 * @param id
	 *            Path parameter with ID of the DMaaP access profile
	 * @param request
	 *            HttpServletRequest
	 * @return Trivial JSON object indicating success or failure.
	 */
	@RequestMapping(value = {
			SELECT_DMAAP_ACCESS_PATH + "/{id}" }, method = RequestMethod.PUT, produces = "application/json")
	@ResponseBody
	public String selectDmaapAccess(@PathVariable("id") long id, HttpServletRequest request) {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("selectDmaapAccess: Failed to get Login UID");
			// A little inefficient in that it requires 3 database accesses;
			// probably could be done in 1 with some sophisticated SQL.
			List<DmaapAccess> dmaapAccessList = getDmaapAccessService().getDmaapAccessList(appUser.getLoginId());
			for (DmaapAccess dmaap : dmaapAccessList) {
				// Only write out the changed rows.
				boolean changed = false;
				if (id == dmaap.getId()) {
					changed = !dmaap.getSelected();
					dmaap.setSelected(true);
				} else {
					changed = dmaap.getSelected();
					dmaap.setSelected(false);
				}
				if (changed)
					getDmaapAccessService().saveDmaapAccess(dmaap);
			}

			// Answer OK
			outboundJson = buildJsonSuccess(200, null);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to select a DMaaP access profile", ex);
		}
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return outboundJson;
	}

	/**
	 * Tests the URL in the DMaaP access profile object. Traps errors and
	 * constructs an appropriate JSON block if an error happens.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return JSON with a Dmaap object (which has name etc.) on success, error
	 *         on failure.
	 */
	@RequestMapping(value = { "test_dmaap_access" }, method = RequestMethod.POST, produces = "application/json")
	@ResponseBody
	public String testDmaapAccess(HttpServletRequest request)  {
		MDC.put(SystemProperties.AUDITLOG_BEGIN_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.setRequestBasedDefaultsIntoGlobalLoggingContext(request, DataBusHomeController.APP_NAME);
		String outboundJson = null;
		try {
			DmaapAccess dmaapAccess = mapper.readValue(request.getReader(), DmaapAccess.class);
			logger.debug("testDmaapAccess: received object: {} ", dmaapAccess);
			if (dmaapAccess.getDmaapUrl() == null || dmaapAccess.getDmaapUrl().trim().length() == 0)
				throw new Exception("Null or empty URL");

			DmaapBcRestClient restClient = getDmaapBcRestClient(dmaapAccess);
			// Get the instance so the page can display its name
			DmaapObject dmaap = restClient.getDmaap();
			if (dmaap instanceof Dmaap) {
				outboundJson = buildJsonSuccess(200, dmaap);
			} else {
				// Bad credentials lands here.
				ErrorResponse err = (ErrorResponse) dmaap;
				outboundJson = buildJsonError(500, "Test failed: " + err.getMessage(), null);
			}
		} catch (Exception ex) {
			// This is entirely likely; e.e., unknown host exception on typo.
			outboundJson = buildJsonError(500, "Invalid DMaaP URL", ex);
		}
		MDC.put(SystemProperties.AUDITLOG_END_TIMESTAMP, DataBusHomeController.logDateFormat.format(new Date()));
		logger.info(EELFLoggerDelegate.auditLogger, request.getMethod() + request.getRequestURI());
		return outboundJson;
	}

}
