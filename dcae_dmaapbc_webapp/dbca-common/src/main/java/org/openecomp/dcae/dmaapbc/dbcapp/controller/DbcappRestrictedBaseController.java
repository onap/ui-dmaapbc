package org.openecomp.dcae.dmaapbc.dbcapp.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.openecomp.dcae.dmaapbc.client.DmaapBcRestClient;
import org.openecomp.dcae.dmaapbc.client.HttpStatusAndResponse;
import org.openecomp.dcae.dmaapbc.dbcapp.domain.DmaapAccess;
import org.openecomp.dcae.dmaapbc.dbcapp.rest.DbcUsvcRestClient;
import org.openecomp.dcae.dmaapbc.dbcapp.service.DmaapAccessService;
import org.openecomp.dcae.dmaapbc.dbcapp.util.DbcappProperties;
import org.openecomp.dcae.dmaapbc.model.DR_Pub;
import org.openecomp.dcae.dmaapbc.model.DR_Sub;
import org.openecomp.dcae.dmaapbc.model.DcaeLocation;
import org.openecomp.dcae.dmaapbc.model.Dmaap;
import org.openecomp.dcae.dmaapbc.model.DmaapObject;
import org.openecomp.dcae.dmaapbc.model.ErrorResponse;
import org.openecomp.dcae.dmaapbc.model.Feed;
import org.openecomp.dcae.dmaapbc.model.MR_Client;
import org.openecomp.dcae.dmaapbc.model.Topic;
import org.openecomp.portalsdk.core.controller.RestrictedBaseController;
import org.openecomp.portalsdk.core.domain.User;
import org.openecomp.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.openecomp.portalsdk.core.onboarding.util.CipherUtil;
import org.openecomp.portalsdk.core.web.support.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * This base class provides utility methods to child controllers. All of the
 * requests are forwarded on to a remote REST API, so there's a large degree of
 * commonality among the implementations. Combining them kept the lines-of-code
 * count down, at the expense of some complexity.
 */
public class DbcappRestrictedBaseController extends RestrictedBaseController {

	/**
	 * Query parameter for desired page number
	 */
	protected static final String PAGE_NUM_QUERY_PARAM = "pageNum";

	/**
	 * Query parameter for desired items per page
	 */
	protected static final String VIEW_PER_PAGE_QUERY_PARAM = "viewPerPage";

	/**
	 * Tag for status code in JSON responses - ALWAYS PRESENT.
	 */
	protected static final String STATUS_RESPONSE_KEY = "status";

	/**
	 * Tag for data in JSON responses.
	 */
	protected static final String DATA_RESPONSE_KEY = "data";

	/**
	 * Tag for error message in JSON responses; absent on success.
	 */
	protected static final String ERROR_RESPONSE_KEY = "error";

	/**
	 * Tag for response integer, pages required to display complete result list
	 */
	protected static final String TOTAL_PAGES_RESPONSE_KEY = "totalPages";

	/**
	 * Tag for DMaaP name obtained from REST client.
	 */
	protected static final String PROFILE_NAME_RESPONSE_KEY = "profileName";

	/**
	 * Tag for DMaaP name obtained from REST client.
	 */
	protected static final String DMAAP_NAME_RESPONSE_KEY = "dmaapName";

	/**
	 * Tag for DCAE location name list obtained from REST client.
	 */
	protected static final String DCAE_LOCATIONS_RESPONSE_KEY = "dcaeLocations";

	/**
	 * Logger that conforms with ECOMP guidelines
	 */
	private static EELFLoggerDelegate logger = EELFLoggerDelegate.getLogger(DbcappRestrictedBaseController.class);

	/**
	 * For general use in these methods and subclasses
	 */
	protected final ObjectMapper mapper = new ObjectMapper();

	/**
	 * DAO accesses the profiles via a local database. REST accesses the
	 * profiles via a remote REST service.
	 */
	public enum AccessMethod {
		DAO, REST
	};

	/**
	 * Enum for selecting an item type.
	 */
	public enum DmaapDataItem {
		DR_FEED, DR_PUB, DR_SUB, MR_TOPIC, MR_CLIENT;
	}

	/**
	 * Application properties - NOT available to constructor.
	 */
	@Autowired
	private DbcappProperties appProperties;

	/**
	 * Database access - which might not be used.
	 */
	@Autowired
	private DmaapAccessService dmaapAccessDaoServiceAuto;

	/**
	 * Read from application properties.
	 */
	private String mechIdName, mechIdPass;

	/**
	 * This is set by {@link #getDmaapAccessService()} to the DAO or REST
	 * implementation as configured in properties.
	 */
	private DmaapAccessService dmaapAccessService;

	/**
	 * Hello Spring, here's your no-arg constructor.
	 */
	public DbcappRestrictedBaseController() {
		// Do not serialize null values
		mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
	}

	/**
	 * Access method for subclasses.
	 * 
	 * @return DbcappProperties object that was autowired by Spring.
	 */
	protected DbcappProperties getAppProperties() {
		return appProperties;
	}

	/**
	 * Lazy initialization. As a side effect, caches mech ID and password.
	 * 
	 * @return Either DAO or REST client that implements the access service
	 *         interface.
	 */
	protected DmaapAccessService getDmaapAccessService() {
		if (dmaapAccessService != null)
			return dmaapAccessService;

		// Get the application's mechid
		mechIdName = appProperties.getProperty(DbcappProperties.DMAAP_MECHID_NAME);
		// This is encrypted
		String cipher = appProperties.getProperty(DbcappProperties.DMAAP_MECHID_PASSWORD);
		if (mechIdName == null || cipher == null)
			throw new RuntimeException("Failed to get MECH_ID name and/or password from properties");
		try {
			mechIdPass = CipherUtil.decrypt(cipher);
		} catch (Exception ex) {
			throw new RuntimeException("Failed to decrypt password from config file", ex);
		}

		String accessMethod = appProperties.getProperty(DbcappProperties.PROFILE_ACCESS_METHOD);
		if (accessMethod == null)
			throw new RuntimeException("Failed to get property " + DbcappProperties.PROFILE_ACCESS_METHOD);
		AccessMethod profileAccessMethod = AccessMethod.valueOf(accessMethod.toUpperCase());
		if (AccessMethod.DAO == profileAccessMethod) {
			// Spring auto-wired this field
			dmaapAccessService = dmaapAccessDaoServiceAuto;
		} else {
			String url = appProperties.getProperty(DbcappProperties.PROFILE_USVC_URL);
			String user = appProperties.getProperty(DbcappProperties.PROFILE_USVC_USER);
			String pass = appProperties.getProperty(DbcappProperties.PROFILE_USVC_PASS);
			if (url == null || user == null || pass == null)
				throw new RuntimeException("getDmaapAccessService: missing property: one of url, user, pass");
			String clearText = null;
			try {
				clearText = CipherUtil.decrypt(pass);
			} catch (Exception ex) {
				throw new RuntimeException("getDmaapAccessService: failed to decrypt password from config");
			}
			dmaapAccessService = new DbcUsvcRestClient(url, user, clearText);
		}
		return dmaapAccessService;
	}

	/**
	 * Creates a REST client with appropriate credentials, the user/pass from
	 * the access profile if present, otherwise with the default mech ID and
	 * password.
	 * 
	 * @param dmaapAccess
	 *            Profile
	 * @return REST client.
	 */
	protected DmaapBcRestClient getDmaapBcRestClient(DmaapAccess dmaapAccess) {
		DmaapBcRestClient restClient = null;
		if (dmaapAccess.getMechId() == null || dmaapAccess.getMechId().length() == 0)
			restClient = new DmaapBcRestClient(dmaapAccess.getDmaapUrl(), mechIdName, mechIdPass);
		else
			restClient = new DmaapBcRestClient(dmaapAccess.getDmaapUrl(), dmaapAccess.getMechId(),
					dmaapAccess.getPassword());
		return restClient;
	}

	/**
	 * Pulls out of the specified list the appropriate items for the page of
	 * results specified by the page number and view-per-page parameters.
	 * 
	 * @param pageNum
	 *            Page number requested by user
	 * @param viewPerPage
	 *            Number of items per page
	 * @param itemList
	 *            List of items available
	 * @return List of items to display
	 */
	@SuppressWarnings("rawtypes")
	private static List shrinkListToPage(final int pageNum, final int viewPerPage, final List itemList) {
		// user-friendly page numbers index from 1
		int firstIndexOnThisPage = viewPerPage * (pageNum - 1);
		int firstIndexOnNextPage = viewPerPage * pageNum;
		int fromIndex = firstIndexOnThisPage < itemList.size() ? firstIndexOnThisPage : itemList.size();
		int toIndex = firstIndexOnNextPage < itemList.size() ? firstIndexOnNextPage : itemList.size();
		// answers empty list if from==to
		return itemList.subList(fromIndex, toIndex);
	}

	/**
	 * Gets the body of a HTTP request assuming UTF-8 encoding.
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return String version of request body
	 * @throws IOException
	 *             If the read fails
	 */
	protected static String getBody(HttpServletRequest request) throws IOException {
		StringBuilder stringBuilder = new StringBuilder();
		BufferedReader bufferedReader = null;
		try {
			InputStream inputStream = request.getInputStream();
			if (inputStream != null) {
				bufferedReader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
				char[] charBuffer = new char[512];
				int bytesRead = -1;
				while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
					stringBuilder.append(charBuffer, 0, bytesRead);
				}
			} else {
				stringBuilder.append("");
			}
		} finally {
			if (bufferedReader != null) {
				try {
					bufferedReader.close();
				} catch (IOException ex) {
					throw ex;
				}
			}

		}
		return stringBuilder.toString();
	}

	/**
	 * Builds a JSON success response from the specified inputs.
	 * 
	 * @param statusCode
	 *            e.g., 200 for OK
	 * @param dataPojo
	 *            Plain old Java object to serialize as JSON; ignored if null.
	 * @throws JsonProcessingException
	 *             If the POJO cannot be serialized
	 * @return JSON block with items "status" : 200 and "data" : (data..)
	 */
	protected String buildJsonSuccess(int statusCode, Object dataPojo) throws JsonProcessingException {
		Map<String, Object> model = new HashMap<String, Object>();
		model.put(STATUS_RESPONSE_KEY, statusCode);
		if (dataPojo != null)
			model.put(DATA_RESPONSE_KEY, dataPojo);
		String json = mapper.writeValueAsString(model);
		return json;
	}

	/**
	 * Builds a JSON error response from the specified inputs.
	 * 
	 * @param statusCode
	 *            e.g., 500 for internal server error
	 * @param errMsg
	 *            Information about the operation that failed
	 * @param exception
	 *            Converted to string; ignored if null.
	 * @return JSON block with tags "status" and "error".
	 */
	protected String buildJsonError(int statusCode, String errMsg, Exception exception) {
		Map<String, Object> model = new HashMap<String, Object>();
		model.put(STATUS_RESPONSE_KEY, new Integer(500));
		if (exception == null) {
			model.put(ERROR_RESPONSE_KEY, errMsg);
		} else {
			final int enough = 512;
			String exString = exception.toString();
			String exceptionMsg = exString.length() > enough ? exString.substring(0, enough) : exString;
			model.put(ERROR_RESPONSE_KEY, errMsg + ": " + exceptionMsg);
		}
		String json = null;
		try {
			json = mapper.writeValueAsString(model);
		} catch (JsonProcessingException ex) {
			// serializing the trivial map should never fail
			String err = "buildJsonError: failed to serialize";
			logger.error(EELFLoggerDelegate.errorLogger, err, ex);
			throw new RuntimeException(err, ex);
		}
		return json;
	}

	/**
	 * Gets a list of DMaaP access profiles for this user from the database. The
	 * profiles have passwords in the clear - this method decrypts the database
	 * entries.
	 * 
	 * Initializes the list for new users and/or configuration changes. Checks
	 * the database list against the configured list of URLs, and creates new
	 * rows for any configured URLs not present for the user. Most environments
	 * are expected to have exactly one valid URL, and the webapp uses a fixed
	 * MechID to authenticate itself to the DMaaP bus controller, so this
	 * approach means new users can start without any setup of URLs.
	 * 
	 * @param userId
	 *            User ID
	 * @return List of DmaapAccess objects
	 * @throws Exception
	 *             If the URL list is not available in properties
	 */
	protected List<DmaapAccess> getOrInitDmaapAccessList(String userId) throws Exception {
		String[] configUrls = getAppProperties().getCsvListProperty(DbcappProperties.DMAAP_REST_URL_LIST);
		if (configUrls == null || configUrls.length == 0)
			throw new Exception("getOrInitDmaapAccessList: Failed to get DMAAP REST URL list");
		// Update this list to track which URLs are in the database.
		List<String> configUrlList = new ArrayList<String>(configUrls.length);
		for (String c : configUrls) {
			// Validate URL to detect config botches
			URL url = new URL(c);
			configUrlList.add(url.toExternalForm());
		}

		List<DmaapAccess> dbAccessList = getDmaapAccessService().getDmaapAccessList(userId);

		// Check the database entries against the configuration. Also
		// build a list of non-DAO objects with clear-text passwords.
		List<DmaapAccess> clearList = new ArrayList<DmaapAccess>(dbAccessList.size());
		for (DmaapAccess dmaapAccess : dbAccessList) {
			// drop this URL from the list.
			// If it's not known to config, complain because that's a bogus row.
			if (!configUrlList.remove(dmaapAccess.getDmaapUrl()))
				logger.warn(EELFLoggerDelegate.errorLogger, "getOrInitDmaapAccessList: detected extra URL {}",
						dmaapAccess.getDmaapUrl());
			// Return cleartext in JSON
			DmaapAccess clone = new DmaapAccess(dmaapAccess);
			clone.setPassword(clone.decryptPassword());
			clearList.add(clone);
		}

		// Create new rows for any configured URLs not found for this user.
		for (int i = 0; i < configUrlList.size(); ++i) {
			String missUrl = configUrlList.get(i);
			logger.debug(EELFLoggerDelegate.debugLogger, "getOrInitDmaapAccessList: adding missing URL {}", missUrl);
			DmaapAccess newDmaapAccess = new DmaapAccess();
			// Create a semi-reasonable name for the table
			newDmaapAccess.setName("dmaap-" + Integer.toString(i + 1));
			newDmaapAccess.setUserId(userId);
			newDmaapAccess.setDmaapUrl(missUrl);
			// Write to db.
			getDmaapAccessService().saveDmaapAccess(newDmaapAccess);
			// Add to response, which assumes the write was successful.
			clearList.add(newDmaapAccess);
		}

		return clearList;
	}

	/**
	 * Gets the user's selected DMaaP access profile.
	 * 
	 * @param userId
	 *            User ID
	 * @return DmaapAccess object that is currently selected, or the first one
	 *         found if none are selected; null if no access profiles are
	 *         configured.
	 * @throws Exception
	 *             If the profile is not found
	 */
	protected DmaapAccess getSelectedDmaapAccess(String userId) throws Exception {
		List<DmaapAccess> profiles = getOrInitDmaapAccessList(userId);
		if (profiles.size() == 0) {
			logger.debug("getSelectedDmaapAccess: no rows found, returning null");
			return null;
		}

		// Return the first one by default if nothing is selected.
		DmaapAccess selected = profiles.get(0);
		for (DmaapAccess da : profiles)
			if (da.getSelected())
				selected = da;

		return selected;
	}

	/**
	 * Supports sorting a list of feeds by the first column displayed: ID
	 */
	private static Comparator<DmaapObject> feedComparator = new Comparator<DmaapObject>() {
		@Override
		public int compare(DmaapObject o1, DmaapObject o2) {
			Feed f1 = (Feed) o1;
			Feed f2 = (Feed) o2;
			// sort these numbers lexicographically, same as the front end
			// table.
			return f1.getFeedId().compareTo(f2.getFeedId());
		}
	};

	/**
	 * Supports sorting a list of publishers by the first column displayed: pub
	 * ID
	 */
	private static Comparator<DmaapObject> pubComparator = new Comparator<DmaapObject>() {
		@Override
		public int compare(DmaapObject o1, DmaapObject o2) {
			DR_Pub p1 = (DR_Pub) o1;
			DR_Pub p2 = (DR_Pub) o2;
			return p1.getPubId().compareTo(p2.getPubId());
		}
	};

	/**
	 * Supports sorting a list of subscribers by the first column displayed: sub
	 * ID
	 */
	private static Comparator<DmaapObject> subComparator = new Comparator<DmaapObject>() {
		@Override
		public int compare(DmaapObject o1, DmaapObject o2) {
			DR_Sub s1 = (DR_Sub) o1;
			DR_Sub s2 = (DR_Sub) o2;
			// sort these numbers lexicographically, same as the front end
			// table.
			return s1.getSubId().compareTo(s2.getSubId());
		}
	};

	/**
	 * Supports sorting a list of topics by the first column displayed: FQTN
	 */
	private static Comparator<DmaapObject> topicComparator = new Comparator<DmaapObject>() {
		@Override
		public int compare(DmaapObject o1, DmaapObject o2) {
			Topic t1 = (Topic) o1;
			Topic t2 = (Topic) o2;
			return t1.getFqtn().compareTo(t2.getFqtn());
		}
	};

	/**
	 * Supports sorting a list of clients by the first column displayed: client
	 * ID.
	 */
	private static Comparator<DmaapObject> clientComparator = new Comparator<DmaapObject>() {
		@Override
		public int compare(DmaapObject o1, DmaapObject o2) {
			MR_Client c1 = (MR_Client) o1;
			MR_Client c2 = (MR_Client) o2;
			// sort these numbers lexicographically, same as the front end
			// table.
			return c1.getMrClientId().compareTo(c2.getMrClientId());
		}
	};

	/**
	 * Gets one page of DMaaP objects and supporting information via the Bus
	 * Controller REST client. On success, returns a JSON object as String with
	 * the following tags:
	 * <UL>
	 * <LI>status: Integer; HTTP status code 200.
	 * <LI>dmaapName: String, name returned by the remote DMaaP instance.
	 * <LI>dcaeLocations: Array of string, locations returned by the remote
	 * DMaaP instance.
	 * <LI>data: Array of the desired items; e.g., data router feeds.
	 * <LI>totalPages: Integer, the number of pages required to display the
	 * complete list of items using the submitted page size
	 * </UL>
	 * 
	 * This duplicates all of {@link #buildJsonSuccess(int, Object)}.
	 * 
	 * @param dmaapAccess
	 *            Access details for the DMaaP REST API
	 * @param option
	 *            Specifies which item list type to get: data router feeds, etc.
	 * @param pageNum
	 *            Page number of results
	 * @param viewPerPage
	 *            Number of items per page
	 * @return JSON block as String, see above.
	 * @throws Exception
	 *             On any error
	 */
	private String getItemListForPage(DmaapAccess dmaapAccess, DmaapDataItem option, int pageNum, int viewPerPage)
			throws Exception {
		DmaapBcRestClient restClient = getDmaapBcRestClient(dmaapAccess);
		// Get the instance so the page can display its name
		DmaapObject dmaap = restClient.getDmaap();
		if (dmaap instanceof ErrorResponse) {
			// Bad password is caught here.
			ErrorResponse err = (ErrorResponse) dmaap;
			throw new Exception(err.getMessage());
		}
		// Get locations for editing
		List<DmaapObject> dcaeLocations = restClient.getDcaeLocations();
		if (dcaeLocations.size() == 1 && dcaeLocations.get(0) instanceof ErrorResponse) {
			// Should never happen - bad password is caught right above - but be
			// careful.
			ErrorResponse err = (ErrorResponse) dcaeLocations.get(0);
			throw new Exception(err.getMessage());
		}
		// Pass them back as String array
		String[] dcaeLocs = new String[dcaeLocations.size()];
		for (int i = 0; i < dcaeLocs.length; ++i) {
			DcaeLocation dcaeLoc = (DcaeLocation) dcaeLocations.get(i);
			dcaeLocs[i] = dcaeLoc.getDcaeLocationName();
		}
		// Get the requested item list
		List<DmaapObject> itemList = null;
		switch (option) {
		case DR_FEED:
			itemList = restClient.getFeeds();
			// size 1 may be error response
			if (itemList.size() > 1)
				Collections.sort(itemList, feedComparator);
			break;
		case DR_PUB:
			itemList = restClient.getDRPubs();
			// size 1 may be error response
			if (itemList.size() > 1)
				Collections.sort(itemList, pubComparator);
			break;
		case DR_SUB:
			itemList = restClient.getDRSubs();
			// size 1 may be error response
			if (itemList.size() > 1)
				Collections.sort(itemList, subComparator);
			break;
		case MR_TOPIC:
			itemList = restClient.getTopics();
			// size 1 may be error response
			if (itemList.size() > 1)
				Collections.sort(itemList, topicComparator);
			break;
		case MR_CLIENT:
			itemList = restClient.getMRClients();
			// size 1 may be error response
			if (itemList.size() > 1)
				Collections.sort(itemList, clientComparator);
			break;
		default:
			throw new Exception("getItemListForPage: pgmr error, unimplemented case: " + option.name());
		}

		logger.debug("getItemListForPage: list size is {}", itemList.size());
		int pageCount = (int) Math.ceil((double) itemList.size() / viewPerPage);
		@SuppressWarnings("unchecked")
		List<DmaapObject> subList = shrinkListToPage(pageNum, viewPerPage, itemList);
		itemList = subList;
		// Build response here
		Map<String, Object> model = new HashMap<String, Object>();
		model.put(STATUS_RESPONSE_KEY, new Integer(200));
		model.put(PROFILE_NAME_RESPONSE_KEY, dmaapAccess.getName());
		model.put(DMAAP_NAME_RESPONSE_KEY, ((Dmaap) dmaap).getDmaapName());
		model.put(DCAE_LOCATIONS_RESPONSE_KEY, dcaeLocs);
		model.put(DATA_RESPONSE_KEY, itemList);
		model.put(TOTAL_PAGES_RESPONSE_KEY, pageCount);

		// build the response
		String outboundJson = null;
		try {
			outboundJson = mapper.writeValueAsString(model);
		} catch (Exception ex) {
			// should never happen
			logger.error("getItemListForPage: failed to serialize model: ", ex);
			throw new Exception("sendItemListForPage", ex);
		}

		return outboundJson;
	}

	/**
	 * Gets a page of the specified DMaaP items. This method traps errors and
	 * constructs an appropriate JSON block if an error happens.
	 * 
	 * See {@link #getItemListForPage(DmaapAccess, DmaapDataItem, int, int)}.
	 * 
	 * @param request
	 *            Inbound request
	 * @param option
	 *            DMaaP item type to get
	 * @return JSON with list of serialized objects, or an error.
	 */
	protected String getItemListForPageWrapper(HttpServletRequest request, DmaapDataItem option) {
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("getItemListForPageWrapper: Failed to get Login UID");
			DmaapAccess selected = getSelectedDmaapAccess(appUser.getLoginId());
			if (selected == null) // leap into exception handler
				throw new Exception("No DMaaP access profiles are configured.");
			int pageNum = Integer.parseInt(request.getParameter(PAGE_NUM_QUERY_PARAM));
			int viewPerPage = Integer.parseInt(request.getParameter(VIEW_PER_PAGE_QUERY_PARAM));
			outboundJson = getItemListForPage(selected, option, pageNum, viewPerPage);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to get DMaaP item type " + option.name(), ex);
		}
		return outboundJson;
	}

	/**
	 * Adds an item of the specified type with the specified content. Constructs
	 * an object by deserializing the JSON block, but ignores any ID field that
	 * is supplied.
	 * 
	 * On success, returns a JSON block as String with any data returned by the
	 * REST client. Throws an exception on any failure.
	 * 
	 * @param dmaapAccess
	 *            Access details for the DMaaP REST API
	 * @param userId
	 *            The login ID of the user making the request
	 * @param itemType
	 *            DMaaP item type to add
	 * @param itemContent
	 *            JSON block to deserialize as an object
	 * @param scAddlStatus
	 *            HTTP status code 200 is always accepted. If this parameter is
	 *            not null, the value is also considered a valid HTTP status
	 *            code on success; e.g., 204.
	 * @return JSON object with result of the operation
	 * @throws Exception
	 *             on any problem
	 */
	private String addDmaapItem(DmaapAccess dmaapAccess, String userId, DmaapDataItem itemType, String itemContent,
			Integer scAddlStatus) throws Exception {
		DmaapBcRestClient restClient = getDmaapBcRestClient(dmaapAccess);
		HttpStatusAndResponse<Object> hsr = null;
		switch (itemType) {
		case DR_FEED:
			Feed feed = mapper.readValue(itemContent, Feed.class);
			logger.debug("addDmaapItem: received feed: {} ", feed);
			// Null out any ID to get an auto-generated ID
			feed.setFeedId(null);
			// Assign the owner to be the webapp user
			feed.setOwner(userId);
			hsr = restClient.postFeed(feed);
			break;
		case DR_PUB:
			DR_Pub pub = mapper.readValue(itemContent, DR_Pub.class);
			logger.debug("addDmaapItem: received pub: {} ", pub);
			// Null out any ID to get an auto-generated ID
			pub.setPubId(null);
			hsr = restClient.postDRPub(pub);
			break;
		case DR_SUB:
			DR_Sub sub = mapper.readValue(itemContent, DR_Sub.class);
			logger.debug("addDmaapItem: received sub: {} ", sub);
			// Null out any ID to get an auto-generated ID
			sub.setSubId(null);
			// Assign the owner to be the webapp user
			sub.setOwner(userId);
			hsr = restClient.postDRSub(sub);
			break;
		case MR_TOPIC:
			Topic topic = mapper.readValue(itemContent, Topic.class);
			logger.debug("addDmaapItem: received topic: {} ", topic);
			// No ID on topic
			topic.setOwner(userId);
			hsr = restClient.postTopic(topic);
			break;
		case MR_CLIENT:
			MR_Client client = mapper.readValue(itemContent, MR_Client.class);
			logger.debug("addDmaapItem: received client: {} ", client);
			client.setMrClientId(null);
			hsr = restClient.postMRClient(client);
			break;
		default:
			throw new Exception("addDmaapItem: pgmr error, unimplemented case: " + itemType.name());
		}

		// Build result here
		String outboundJson = null;
		if (hsr.getStatusCode() == HttpServletResponse.SC_OK
				|| (scAddlStatus != null && hsr.getStatusCode() == scAddlStatus)) {
			outboundJson = buildJsonSuccess(hsr.getStatusCode(), hsr.getResponseString());
		} else {
			throw new Exception("Unexpected HTTP response code " + Integer.toString(hsr.getStatusCode())
					+ " with content " + hsr.getResponseString());
		}
		return outboundJson;
	}

	/**
	 * Adds the specified DMaaP item that is read from the request body. This
	 * method traps errors and constructs an appropriate JSON block if an error
	 * happens.
	 * 
	 * @param request
	 *            Used to obtain user info from the active session
	 * @param itemType
	 *            DMaaP item type to add
	 * @param scAddlStatus
	 *            HTTP status code 200 is always accepted. If this parameter is
	 *            not null, the value is also considered a valid HTTP status
	 *            code on success; e.g., 204.
	 * @return JSON block with success or failure object
	 */
	protected String addItem(HttpServletRequest request, DmaapDataItem itemType, Integer scAddlStatus) {
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("addDmaapItem: Failed to get Login ID");

			DmaapAccess access = getSelectedDmaapAccess(appUser.getLoginId());
			if (access == null) // leap into exception handler
				throw new Exception("No DMaaP access profiles are configured.");
			String jsonContent = getBody(request);
			outboundJson = addDmaapItem(access, appUser.getLoginId(), itemType, jsonContent, scAddlStatus);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to add DMaaP item " + itemType.name(), ex);
		}

		return outboundJson;
	}

	/**
	 * Updates an item of the specified type with the specified content.
	 * Constructs an object by deserializing the JSON block.
	 * 
	 * On success, returns a JSON block as String with any data returned by the
	 * REST client. Throws an exception on any failure.
	 * 
	 * @param dmaapAccess
	 *            Access details for the DMaaP REST API
	 * @param userId
	 *            The Login ID of the user making the request
	 * @param itemType
	 *            DMaaP item type to update
	 * @param itemId
	 *            Item identification
	 * @param itemContent
	 *            JSON block to deserialize as an object
	 * @param scAddlStatus
	 *            HTTP status code 200 is always accepted. If this parameter is
	 *            not null, the value is also considered a valid HTTP status
	 *            code on success; e.g., 204.
	 * @return JSON object with result of the operation
	 * @throws Exception
	 *             on any problem
	 */
	private String updateDmaapItem(DmaapAccess dmaapAccess, String userId, DmaapDataItem itemType, String itemId,
			String itemContent, Integer scAddlStatus) throws Exception {
		DmaapBcRestClient restClient = getDmaapBcRestClient(dmaapAccess);
		HttpStatusAndResponse<Object> hsr = null;
		switch (itemType) {
		case DR_FEED:
			Feed feed = mapper.readValue(itemContent, Feed.class);
			logger.debug("updateDmaapItem: received feed: {} ", feed);
			// Ensure the owner is the webapp user
			feed.setOwner(userId);
			hsr = restClient.putFeed(feed);
			break;
		case DR_PUB:
			DR_Pub pub = mapper.readValue(itemContent, DR_Pub.class);
			logger.debug("updateDmaapItem: received pub: {} ", pub);
			hsr = restClient.putDRPub(pub);
			break;
		case DR_SUB:
			DR_Sub sub = mapper.readValue(itemContent, DR_Sub.class);
			logger.debug("updateDmaapItem: received sub: {} ", sub);
			// Ensure the owner is the webapp user
			sub.setOwner(userId);
			hsr = restClient.putDRSub(sub);
			break;
		case MR_TOPIC:
			Topic topic = mapper.readValue(itemContent, Topic.class);
			logger.debug("updateDmaapItem: received topic: {} ", topic);
			// Ensure the owner is the webapp user
			topic.setOwner(userId);
			// DCAE backend may implement PUT someday.
			if (true && userId != null)
				throw new UnsupportedOperationException("put topic not supported (yet)");
			break;
		case MR_CLIENT:
			MR_Client client = mapper.readValue(itemContent, MR_Client.class);
			logger.debug("updateDmaapItem: received client: {} ", client);
			hsr = restClient.putMRClient(client);
			break;
		default:
			throw new Exception("updateDmaapItem: pgmr error, unimplemented case: " + itemType.name());
		}

		// Build result here
		String outboundJson = null;
		if (hsr.getStatusCode() == HttpServletResponse.SC_OK
				|| (scAddlStatus != null && hsr.getStatusCode() == scAddlStatus)) {
			outboundJson = buildJsonSuccess(hsr.getStatusCode(), hsr.getResponseString());
		} else {
			throw new Exception("Unexpected HTTP response code " + Integer.toString(hsr.getStatusCode())
					+ " with content " + hsr.getResponseString());
		}
		return outboundJson;
	}

	/**
	 * Updates the specified DMaaP item that is read from the request body. This
	 * method traps errors and constructs an appropriate JSON block if an error
	 * happens.
	 * 
	 * @param request
	 *            Used to obtain user info from the active session
	 * @param itemType
	 *            DMaaP item type to update
	 * @param itemId
	 *            Item identification to update
	 * @param scUpdatelStatus
	 *            HTTP status code 200 is always accepted. If this parameter is
	 *            not null, the value is also considered a valid HTTP status
	 *            code on success; e.g., 204.
	 * @return JSON object with success or error information.
	 */
	protected String updateItem(HttpServletRequest request, DmaapDataItem itemType, String itemId,
			Integer scUpdatelStatus) {
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("updateItem: Failed to get Login ID");
			DmaapAccess access = getSelectedDmaapAccess(appUser.getLoginId());
			if (access == null) // leap into exception handler
				throw new Exception("No DMaaP access profiles are configured.");
			String jsonContent = getBody(request);
			outboundJson = updateDmaapItem(access, appUser.getLoginId(), itemType, itemId, jsonContent,
					scUpdatelStatus);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to update DMaaP item " + itemType.name(), ex);
		}

		return outboundJson;
	}

	/**
	 * Deletes an item of the specified type with the specified ID.
	 * 
	 * @param dmaapAccess
	 *            Access details for the DMaaP REST API
	 * @param itemType
	 *            DMaaP item type to delete
	 * @param itemId
	 *            Item identification
	 * @param scAddlStatus
	 *            HTTP status code 200 is always accepted. If this parameter is
	 *            not null, the value is also considered a valid HTTP status
	 *            code on success; e.g., 204.
	 * @return On success, returns a JSON block as String with any data returned
	 *         by the REST client.
	 * @throws Exception
	 *             On any failure.
	 */
	private String deleteDmaapItem(DmaapAccess dmaapAccess, DmaapDataItem itemType, String itemId, Integer scAddlStatus)
			throws Exception {
		DmaapBcRestClient restClient = getDmaapBcRestClient(dmaapAccess);
		HttpStatusAndResponse<Object> hsr = null;
		switch (itemType) {
		case DR_FEED:
			hsr = restClient.deleteFeed(itemId);
			break;
		case DR_PUB:
			hsr = restClient.deleteDRPub(itemId);
			break;
		case DR_SUB:
			hsr = restClient.deleteDRSub(itemId);
			break;
		case MR_TOPIC:
			hsr = restClient.deleteTopic(itemId);
			break;
		case MR_CLIENT:
			hsr = restClient.deleteMRClient(itemId);
			break;
		default:
			throw new Exception("deleteDmaapItem: pgmr error, unimplemented case: " + itemType.name());
		}

		// Build result here
		String outboundJson = null;
		if (hsr.getStatusCode() == HttpServletResponse.SC_OK
				|| (scAddlStatus != null && hsr.getStatusCode() == scAddlStatus)) {
			outboundJson = buildJsonSuccess(hsr.getStatusCode(), hsr.getResponseString());
		} else {
			throw new Exception("Unexpected HTTP response code " + Integer.toString(hsr.getStatusCode())
					+ " with content " + hsr.getResponseString());
		}
		return outboundJson;
	}

	/**
	 * Deletes the specified DMaaP item. This method traps errors and constructs
	 * an appropriate JSON block if an error happens.
	 * 
	 * @param request
	 *            Used to obtain user info from the active session
	 * @param itemType
	 *            DMaaP item type to delete
	 * @param itemId
	 *            item ID to delete
	 * @param scAddlStatus
	 *            HTTP status code 200 is always accepted. If this parameter is
	 *            not null, the value is also considered a valid HTTP status
	 *            code on success; e.g., 204.
	 * @return JSON object with success or error information.
	 */
	protected String deleteItem(HttpServletRequest request, DmaapDataItem itemType, String itemId,
			Integer scAddlStatus) {
		String outboundJson = null;
		try {
			User appUser = UserUtils.getUserSession(request);
			if (appUser == null || appUser.getLoginId() == null || appUser.getLoginId().length() == 0)
				throw new Exception("deleteItem: Failed to get Login ID");
			DmaapAccess selected = getSelectedDmaapAccess(appUser.getLoginId());
			if (selected == null) // leap into exception handler
				throw new Exception("No DMaaP access profiles are configured.");
			outboundJson = deleteDmaapItem(selected, itemType, itemId, scAddlStatus);
		} catch (Exception ex) {
			outboundJson = buildJsonError(500, "Failed to delete DMaaP item " + itemType.name() + " ID " + itemId, ex);
		}
		return outboundJson;
	}

}
