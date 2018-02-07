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
package org.onap.dcae.dmaapbc.client;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.client.utils.URIBuilder;
import org.onap.dcae.dmaapbc.model.DR_Node;
import org.onap.dcae.dmaapbc.model.DR_Pub;
import org.onap.dcae.dmaapbc.model.DR_Sub;
import org.onap.dcae.dmaapbc.model.DcaeLocation;
import org.onap.dcae.dmaapbc.model.Dmaap;
import org.onap.dcae.dmaapbc.model.DmaapObject;
import org.onap.dcae.dmaapbc.model.ErrorResponse;
import org.onap.dcae.dmaapbc.model.Feed;
import org.onap.dcae.dmaapbc.model.MR_Client;
import org.onap.dcae.dmaapbc.model.MR_Cluster;
import org.onap.dcae.dmaapbc.model.Topic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Provides methods to communicate with the DMaaP Bus Controller REST API. This
 * hides all JSON; instead it accepts and returns Java objects.
 */
public class DmaapBcRestClient extends SimpleRestClientBase {

	private static Logger logger = LoggerFactory.getLogger(DmaapBcRestClient.class);

	// Omit leading and trailing slashes here
	private static final String DCAELOCATIONS = "dcaeLocations";
	private static final String DMAAP = "dmaap";
	private static final String DR_NODES = "dr_nodes";
	private static final String DR_PUBS = "dr_pubs";
	private static final String DR_SUBS = "dr_subs";
	private static final String FEEDS = "feeds";
	private static final String TOPICS = "topics";
	private static final String MR_CLUSTERS = "mr_clusters";
	private static final String MR_CLIENTS = "mr_clients";

	/**
	 * Reusable JSON (de)serializer
	 */
	private final ObjectMapper mapper;

	/**
	 * URL of the DMAAP REST endpoint
	 */
	private final String dmaapRestUrl;

	/**
	 * Constructor that configures the client for the specified endpoint using
	 * no authentication.
	 * 
	 * @param dmaapRestUrl
	 *            URL of the endpoint
	 */
	public DmaapBcRestClient(final String dmaapRestUrl) {
		super();
		this.dmaapRestUrl = dmaapRestUrl;
		this.mapper = new ObjectMapper();
		// Don't serialize null-value fields in objects
		this.mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
	}

	/**
	 * Constructor that onfigures the client for the specified endpoint using
	 * the specified username and password for basic HTTP authentication.
	 * 
	 * @param dmaapRestUrl
	 *            URL of the endpoint
	 * @param username
	 *            User name
	 * @param password
	 *            Password
	 */
	public DmaapBcRestClient(final String dmaapRestUrl, final String username, final String password) {
		super(username, password);
		this.dmaapRestUrl = dmaapRestUrl;
		this.mapper = new ObjectMapper();
		// Don't serialize null-value fields in objects
		this.mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
	}

	/**
	 * Configures the behavior of the JSON deserializer used to build business
	 * objects (e.g., a Feed) from REST responses.
	 * 
	 * @param failOnUnknownProperties
	 *            If true, rejects JSON responses with unexpected fields
	 *            (default behavior); if false, ignores unexpected fields.
	 */
	public void setFailOnUnknownProperties(boolean failOnUnknownProperties) {
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, failOnUnknownProperties);
	}

	/**
	 * Gets the DMaaP endpoint URL that is used by methods in this class.
	 * 
	 * @return dmaapEndpointUrl
	 */
	public String getDmaapRestUrl() {
		return this.dmaapRestUrl;
	}

	/////////////////////////////////////////////////////////////////////

	/**
	 * Gets a list of DCAE locations.
	 * 
	 * @return List of DmaapObject: list contains DcaeLocation object(s) on
	 *         success; a single ErrorResponse object if the remote site rejects
	 *         the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public List<DmaapObject> getDcaeLocations() throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(DCAELOCATIONS));
		logger.debug("getDcaeLocations: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getDcaeLocations: unexpected null response");

		List<DmaapObject> responseList = null;
		try {
			TypeReference<List<DcaeLocation>> typeRef = new TypeReference<List<DcaeLocation>>() {
			};
			responseList = mapper.readValue(hsr.getResponseString(), typeRef);
		} catch (Exception ex) {
			logger.debug("getDcaeLocations: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			responseList = new ArrayList<DmaapObject>();
			responseList.add(errResp);
		}
		return responseList;
	}

	/**
	 * Gets the DCAE location with the specified name.
	 * 
	 * @param locName
	 *            name of the location to get
	 * @return DmaapObject: a DcaeLocation object on success; an ErrorResponse
	 *         object if the remote site rejects the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public DmaapObject getDcaeLocation(final String locName) throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(DCAELOCATIONS, locName));
		logger.debug("getDcaeLocation: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getDcaeLocation: unexpected null response");

		DmaapObject response = null;
		try {
			response = mapper.readValue(hsr.getResponseString(), DcaeLocation.class);
		} catch (Exception ex) {
			logger.debug("getDcaeLocation: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			response = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
		}
		return response;
	}

	/**
	 * Creates a DCAE location in DMaaP.
	 * 
	 * @param dcaeLoc
	 *            DcaeLocation to be created
	 * @return Status and response: expect 200 and a DcaeLocation on success; a
	 *         code and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> postDcaeLocation(DcaeLocation dcaeLoc) throws Exception {
		String jsonBody = mapper.writeValueAsString(dcaeLoc);
		HttpStatusAndResponse<String> hsr = postRestContent(buildDmaapUri(DCAELOCATIONS), jsonBody);
		if (hsr == null)
			throw new Exception("postDcaeLocation: unexpected null response");
		logger.debug("postDcaeLocation: resp is {}", hsr);
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("postDcaeLocation: null response body");
			return response;
		}
		try {
			DcaeLocation resp = mapper.readValue(hsr.getResponseString(), DcaeLocation.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postDcaeLocation: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Deletes the DCAE location with the specified name.
	 * 
	 * @param locName
	 *            Name of the location to delete
	 * @return Status and response: expect 204 and a DcaeLocation on success; a
	 *         code and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> deleteDcaeLocation(final String locName) throws Exception {
		HttpStatusAndResponse<String> hsr = deleteRestContent(buildDmaapUri(DCAELOCATIONS, locName));
		logger.debug("deleteDcaeLocation: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("deleteDcaeLocation: unexpected null response");
		// Returns a loc on success, error message string on error.
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("deleteDcaeLocation: null response body");
			return response;
		}
		try {
			DcaeLocation resp = mapper.readValue(hsr.getResponseString(), DcaeLocation.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("deleteDcaeLocation: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Updates a DCAE location.
	 * 
	 * @param dcaeLoc
	 *            DCAE Location to be updated
	 * @return Status and response; expect 200 and a DcaeLocation on success, a
	 *         string error on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> putDcaeLocation(DcaeLocation dcaeLoc) throws Exception {
		String jsonBody = mapper.writeValueAsString(dcaeLoc);
		HttpStatusAndResponse<String> hsr = putRestContent(buildDmaapUri(DCAELOCATIONS, dcaeLoc.getDcaeLocationName()),
				jsonBody);
		logger.debug("putDcaeLocation: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("putDcaeLocation: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("putDcaeLocation: null response body");
			return response;
		}
		try {
			DcaeLocation resp = mapper.readValue(hsr.getResponseString(), DcaeLocation.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("putDcaeLocation: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/////////////////////////////////////////////////////////////////////

	/**
	 * Gets the DMAAP instance for this DCAE deployment.
	 * 
	 * @return DmaapObject: a Dmaap object on success; an ErrorResponse object
	 *         if the remote site rejects the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public DmaapObject getDmaap() throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(DMAAP));
		logger.debug("getDmaap: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getDmaap: unexpected null response");
		DmaapObject response = null;
		try {
			response = mapper.readValue(hsr.getResponseString(), Dmaap.class);
		} catch (Exception ex) {
			logger.debug("getDmaap: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			response = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
		}
		return response;
	}

	/**
	 * Creates a new DMaaP set system wide configuration settings for the
	 * dcaeEnvironment
	 * 
	 * @param dmaap
	 *            Dmaap properties
	 * @return Status and response: expect 200 and a Dmaap on success; a code
	 *         and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> postDmaap(Dmaap dmaap) throws Exception {
		String jsonBody = mapper.writeValueAsString(dmaap);
		HttpStatusAndResponse<String> hsr = postRestContent(buildDmaapUri(DMAAP), jsonBody);
		if (hsr == null)
			throw new Exception("postDmaap: unexpected null response");
		logger.debug("postDmaap: resp is {}", hsr);
		// Returns ? on success, error message string on error.
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("postDmaap: null response body");
			return response;
		}
		try {
			Dmaap resp = mapper.readValue(hsr.getResponseString(), Dmaap.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postDmaap: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Updates DMaaP system wide configuration settings for the dcaeEnvironment.
	 * 
	 * @param dmaap
	 *            Dmaap properties
	 * @return Status and response; expect 200 and a DR_Pub on success; a code
	 *         and and ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> putDmaap(Dmaap dmaap) throws Exception {
		String jsonBody = mapper.writeValueAsString(dmaap);
		// Oddly, this PUT has no ID parameter in the URL
		HttpStatusAndResponse<String> hsr = putRestContent(buildDmaapUri(DMAAP), jsonBody);
		if (hsr == null)
			throw new Exception("putDmaap: unexpected null response");
		logger.debug("putDmaap: resp is {}", hsr);
		// Returns ? on success, error message string on error.
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("putDmaap: null response body");
			return response;
		}
		try {
			Dmaap resp = mapper.readValue(hsr.getResponseString(), Dmaap.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("putDmaap: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	// NO DELETE_DMAAP METHOD

	/////////////////////////////////////////////////////////////////////

	/**
	 * Gets a list of data router nodes.
	 * 
	 * @return List of DmaapObject: list contains DR_Node object(s) on success;
	 *         a single ErrorResponse object if the remote site rejects the
	 *         request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public List<DmaapObject> getDRNodes() throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(DR_NODES));
		logger.debug("getDRNodes: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getDRNodes: unexpected null response");

		List<DmaapObject> responseList = null;
		try {
			TypeReference<List<DR_Node>> typeRef = new TypeReference<List<DR_Node>>() {
			};
			responseList = mapper.readValue(hsr.getResponseString(), typeRef);
		} catch (Exception ex) {
			logger.debug("getDRNodes: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			responseList = new ArrayList<DmaapObject>();
			responseList.add(errResp);
		}
		return responseList;
	}

	/**
	 * Gets a data router node with the specified ID.
	 * 
	 * @param fqdn
	 *            Name of the node to get
	 * @return DmaapObject: a DR_Node object on success; an ErrorResponse object
	 *         if the remote site rejects the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public DmaapObject getDRNode(final String fqdn) throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(DR_NODES, fqdn));
		logger.debug("getDRNode: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getDRNode: unexpected null response");
		DmaapObject response = null;
		try {
			response = mapper.readValue(hsr.getResponseString(), DR_Node.class);
		} catch (Exception ex) {
			logger.debug("getDRNode: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			response = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
		}
		return response;
	}

	/**
	 * Creates a data router node.
	 * 
	 * @param drNode
	 *            Node to be created
	 * @return Status and response: expect 200 and a DR_Node on success; a code
	 *         and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> postDRNode(DR_Node drNode) throws Exception {
		String jsonBody = mapper.writeValueAsString(drNode);
		HttpStatusAndResponse<String> hsr = postRestContent(buildDmaapUri(DR_NODES), jsonBody);
		logger.debug("postDRNode: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("postDRNode: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("postDRNode: null response body");
			return response;
		}
		try {
			DR_Node resp = mapper.readValue(hsr.getResponseString(), DR_Node.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postDRNode: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Updates a data router node.
	 * 
	 * @param drNode
	 *            Node to be updated
	 * @return Status and response: expect 200 and a DR_Node on success; a code
	 *         and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> putDRNode(DR_Node drNode) throws Exception {
		String jsonBody = mapper.writeValueAsString(drNode);
		HttpStatusAndResponse<String> hsr = putRestContent(buildDmaapUri(DR_NODES, drNode.getFqdn()), jsonBody);
		logger.debug("putDRNode: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("putDRNode: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("putDRNode: null response body");
			return response;
		}
		try {
			DR_Node resp = mapper.readValue(hsr.getResponseString(), DR_Node.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postDRNode: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Deletes the data router node with the specified FQDN.
	 * 
	 * @param fqdn
	 *            Name of the node to delete
	 * @return Status and response: expect 204 and a null on success; a code and
	 *         an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> deleteDRNode(final String fqdn) throws Exception {
		HttpStatusAndResponse<String> hsr = deleteRestContent(buildDmaapUri(DR_NODES, fqdn));
		logger.debug("deleteDRNode: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("deleteDRNode: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("deleteDRNode: null response body");
			return response;
		}
		try {
			DR_Node resp = mapper.readValue(hsr.getResponseString(), DR_Node.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("deleteDRNode: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/////////////////////////////////////////////////////////////////////

	/**
	 * Gets a list of data router publishers.
	 * 
	 * @return List of DmaapObject: list contains DR_Pub object(s) on success; a
	 *         single ErrorResponse object if the remote site rejects the
	 *         request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public List<DmaapObject> getDRPubs() throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(DR_PUBS));
		logger.debug("getDRPubs: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getDRPubs: unexpected null response");
		List<DmaapObject> responseList = null;
		try {
			TypeReference<List<DR_Pub>> typeRef = new TypeReference<List<DR_Pub>>() {
			};
			responseList = mapper.readValue(hsr.getResponseString(), typeRef);
		} catch (Exception ex) {
			logger.debug("getDRPubs: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			responseList = new ArrayList<DmaapObject>();
			responseList.add(errResp);
		}
		return responseList;
	}

	/**
	 * Gets a data router publisher with the specified ID.
	 * 
	 * @param pubId
	 *            ID of the publisher to get
	 * @return DmaapObject: a DR_Pub object on success; an ErrorResponse object
	 *         if the remote site rejects the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public DmaapObject getDRPub(final String pubId) throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(DR_PUBS, pubId));
		logger.debug("getDRPub: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getDRPub: unexpected null response");
		DmaapObject response = null;
		try {
			response = mapper.readValue(hsr.getResponseString(), DR_Pub.class);
		} catch (Exception ex) {
			logger.debug("getDRPub: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			response = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
		}
		return response;
	}

	/**
	 * Creates a data router publisher.
	 * 
	 * @param drPub
	 *            Data router publisher properties
	 * @return Status and response: expect 200 and a DR_Pub on success; a code
	 *         and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> postDRPub(DR_Pub drPub) throws Exception {
		String jsonBody = mapper.writeValueAsString(drPub);
		HttpStatusAndResponse<String> hsr = postRestContent(buildDmaapUri(DR_PUBS), jsonBody);
		logger.debug("postDRPub: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("postDRPub: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("postDRPub: null response body");
			return response;
		}
		try {
			DR_Pub resp = mapper.readValue(hsr.getResponseString(), DR_Pub.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postDRPub: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Updates a data router publisher.
	 * 
	 * @param drPub
	 *            Publisher to be updated
	 * @return Status and response: expect 200 and a DR_Pub on success, a code
	 *         and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> putDRPub(DR_Pub drPub) throws Exception {
		String jsonBody = mapper.writeValueAsString(drPub);
		HttpStatusAndResponse<String> hsr = putRestContent(buildDmaapUri(DR_PUBS, drPub.getPubId()), jsonBody);
		logger.debug("putDRPub: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("putDRPub: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("putDRPub: null response body");
			return response;
		}
		try {
			DR_Pub resp = mapper.readValue(hsr.getResponseString(), DR_Pub.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postDRPub: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Deletes the data router publisher with the specified ID.
	 * 
	 * @param pubId
	 *            ID of the publisher to delete
	 * @return Status and response: expect 204 and a null on success; a code and
	 *         an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> deleteDRPub(final String pubId) throws Exception {
		HttpStatusAndResponse<String> hsr = deleteRestContent(buildDmaapUri(DR_PUBS, pubId));
		logger.debug("deleteDRPub: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("deleteDRPub: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("deleteDRPub: null response body");
			return response;
		}
		try {
			DR_Pub resp = mapper.readValue(hsr.getResponseString(), DR_Pub.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("deleteDRPub: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/////////////////////////////////////////////////////////////////////

	/**
	 * Gets a list of data router subscribers.
	 * 
	 * @return List of DmaapObject: list contains DR_Sub object(s) on success; a
	 *         single ErrorResponse object if the remote site rejects the
	 *         request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public List<DmaapObject> getDRSubs() throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(DR_SUBS));
		logger.debug("getDRSubs: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getDRSubs: unexpected null response");
		List<DmaapObject> responseList = null;
		try {
			TypeReference<List<DR_Sub>> typeRef = new TypeReference<List<DR_Sub>>() {
			};
			responseList = mapper.readValue(hsr.getResponseString(), typeRef);
		} catch (Exception ex) {
			logger.debug("getDRSubs: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			responseList = new ArrayList<DmaapObject>();
			responseList.add(errResp);
		}
		return responseList;
	}

	/**
	 * Gets a data router subscriber with the specified ID.
	 * 
	 * @param subId
	 *            ID of the subscriber to get
	 * @return DmaapObject: a DR_Sub object on success; an ErrorResponse object
	 *         if the remote site rejects the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public DmaapObject getDRSub(final String subId) throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(DR_SUBS, subId));
		logger.debug("getDRPub: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getDRSub: unexpected null response");
		DmaapObject response = null;
		try {
			response = mapper.readValue(hsr.getResponseString(), DR_Sub.class);
		} catch (Exception ex) {
			logger.debug("getDRSub: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			response = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
		}
		return response;
	}

	/**
	 * Creates a data router subscriber.
	 * 
	 * @param drSub
	 *            Data router subscriber properties
	 * @return Status and response: expect 200 and a DR_Sub on success; a code
	 *         and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> postDRSub(DR_Sub drSub) throws Exception {
		String jsonBody = mapper.writeValueAsString(drSub);
		HttpStatusAndResponse<String> hsr = postRestContent(buildDmaapUri(DR_SUBS), jsonBody);
		logger.debug("postDRSub: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("postDRSub: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("postDRSub: null response body");
			return response;
		}
		try {
			DR_Sub resp = mapper.readValue(hsr.getResponseString(), DR_Sub.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postDRSub: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Updates a data router subscriber.
	 * 
	 * @param drSub
	 *            Subscriber to be updated
	 * @return Status and response; expect 200 and a DR_Sub on success, a string
	 *         error on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> putDRSub(DR_Sub drSub) throws Exception {
		String jsonBody = mapper.writeValueAsString(drSub);
		HttpStatusAndResponse<String> hsr = putRestContent(buildDmaapUri(DR_SUBS, drSub.getSubId()), jsonBody);
		logger.debug("putDRSub: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("putDRSub: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("putDRSub: null response body");
			return response;
		}
		try {
			DR_Sub resp = mapper.readValue(hsr.getResponseString(), DR_Sub.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("putDRSub: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Deletes the data router subscriber with the specified ID.
	 * 
	 * @param subId
	 *            ID of the subscriber to delete
	 * @return Status and response: expect 204 and a null on success; a code and
	 *         an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> deleteDRSub(final String subId) throws Exception {
		HttpStatusAndResponse<String> hsr = deleteRestContent(buildDmaapUri(DR_SUBS, subId));
		logger.debug("deleteDRSub: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("deleteDRSub: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("deleteDRSub: null response body");
			return response;
		}
		try {
			DR_Sub resp = mapper.readValue(hsr.getResponseString(), DR_Sub.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("deleteDRSub: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/////////////////////////////////////////////////////////////////////

	/**
	 * Gets a list of data router feeds.
	 * 
	 * @return List of DmaapObject: list contains DcaeLocation object(s) on
	 *         success; a single ErrorResponse object if the remote site rejects
	 *         the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public List<DmaapObject> getFeeds() throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(FEEDS));
		logger.debug("getFeeds: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getFeeds: unexpected null response");
		List<DmaapObject> responseList = null;
		try {
			TypeReference<List<Feed>> typeRef = new TypeReference<List<Feed>>() {
			};
			responseList = mapper.readValue(hsr.getResponseString(), typeRef);
		} catch (Exception ex) {
			logger.debug("getFeeds: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			responseList = new ArrayList<DmaapObject>();
			responseList.add(errResp);
		}
		return responseList;
	}

	/**
	 * Gets a data router feed with the specified ID.
	 * 
	 * @param feedId
	 *            ID of the feed to get
	 * @return DmaapObject: a Feed object on success; an ErrorResponse object if
	 *         the remote site rejects the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public DmaapObject getFeed(final String feedId) throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(FEEDS, feedId));
		logger.debug("getFeed: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getFeed: unexpected null response");
		DmaapObject response = null;
		try {
			response = mapper.readValue(hsr.getResponseString(), Feed.class);
		} catch (Exception ex) {
			logger.debug("getFeed: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			response = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
		}
		return response;
	}

	/**
	 * Creates a feed and adds any specified pubs and subs.
	 * 
	 * @param feed
	 *            Data router feed properties
	 * @return Status and response: expect 200 and a Feed on success; a code and
	 *         an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> postFeed(Feed feed) throws Exception {
		String jsonBody = mapper.writeValueAsString(feed);
		HttpStatusAndResponse<String> hsr = postRestContent(buildDmaapUri(FEEDS), jsonBody);
		logger.debug("postFeed: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("postFeed: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("postFeed: null response body");
			return response;
		}
		try {
			Feed resp = mapper.readValue(hsr.getResponseString(), Feed.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postFeed: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Updates a data router feed.
	 * 
	 * @param feed
	 *            Feed to be updated
	 * @return Status and response: expect 200 and a Feed on success; a code and
	 *         an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> putFeed(Feed feed) throws Exception {
		String jsonBody = mapper.writeValueAsString(feed);
		HttpStatusAndResponse<String> hsr = putRestContent(buildDmaapUri(FEEDS, feed.getFeedId()), jsonBody);
		logger.debug("putFeed: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("putFeed: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("putFeed: null response body");
			return response;
		}
		try {
			Feed resp = mapper.readValue(hsr.getResponseString(), Feed.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("putFeed: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Deletes the data router feed with the specified ID.
	 * 
	 * @param feedId
	 *            ID of the feed to delete
	 * @return Status and response: expect 204 and a null on success; a code and
	 *         an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> deleteFeed(final String feedId) throws Exception {
		HttpStatusAndResponse<String> hsr = deleteRestContent(buildDmaapUri(FEEDS, feedId));
		logger.debug("deleteFeed: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("deleteFeed: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("deleteFeed: null response body");
			return response;
		}
		try {
			Feed resp = mapper.readValue(hsr.getResponseString(), Feed.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("deleteFeed: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/////////////////////////////////////////////////////////////////////

	/**
	 * Gets a list of message router topics.
	 * 
	 * @return List of DmaapObject: list contains Topic object(s) on success; a
	 *         single ErrorResponse object if the remote site rejects the
	 *         request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public List<DmaapObject> getTopics() throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(TOPICS));
		logger.debug("getTopics: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getTopics: unexpected null response");
		List<DmaapObject> responseList = null;
		try {
			TypeReference<List<Topic>> typeRef = new TypeReference<List<Topic>>() {
			};
			responseList = mapper.readValue(hsr.getResponseString(), typeRef);
		} catch (Exception ex) {
			logger.debug("getTopics: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			responseList = new ArrayList<DmaapObject>();
			responseList.add(errResp);
		}
		return responseList;
	}

	/**
	 * Gets the message router topic with the specified FQTN.
	 * 
	 * @param fqtn
	 *            Fully qualified topic name
	 * @return DmaapObject: a Topic object on success; an ErrorResponse object
	 *         if the remote site rejects the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public DmaapObject getTopic(final String fqtn) throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(TOPICS, fqtn));
		logger.debug("getTopic: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getTopic: unexpected null response");
		DmaapObject response = null;
		try {
			response = mapper.readValue(hsr.getResponseString(), Topic.class);
		} catch (Exception ex) {
			logger.debug("getTopic: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			response = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
		}
		return response;
	}

	/**
	 * Creates a topic and grants appropriate permissions to specified pubs and
	 * subs.
	 * 
	 * @param topic
	 *            Message router topic properties
	 * @return Status and response: expect 200 and a Topic on success; a code
	 *         and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> postTopic(Topic topic) throws Exception {
		String jsonBody = mapper.writeValueAsString(topic);
		HttpStatusAndResponse<String> hsr = postRestContent(buildDmaapUri(TOPICS), jsonBody);
		logger.debug("postTopic: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("postTopic: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("postTopic: null response body");
			return response;
		}
		try {
			Topic resp = mapper.readValue(hsr.getResponseString(), Topic.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postTopic: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Deletes the message router topic with the specified FQTN.
	 * 
	 * @param fqtn
	 *            Fully qualified topic name to delete
	 * @return Status and response: expect 204 and a null on success; a code and
	 *         an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> deleteTopic(final String fqtn) throws Exception {
		HttpStatusAndResponse<String> hsr = deleteRestContent(buildDmaapUri(TOPICS, fqtn));
		logger.debug("deleteTopic: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("deleteTopic: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("deleteTopic: null response body");
			return response;
		}
		try {
			Topic resp = mapper.readValue(hsr.getResponseString(), Topic.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("deleteTopic: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/////////////////////////////////////////////////////////////////////

	/**
	 * Gets a list of message router clients.
	 * 
	 * @return List of DmaapObject: list contains MR_Client object(s) on
	 *         success; a single ErrorResponse object if the remote site rejects
	 *         the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public List<DmaapObject> getMRClients() throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(MR_CLIENTS));
		logger.debug("getMRClients: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getMRClients: unexpected null response");
		List<DmaapObject> responseList = null;
		try {
			TypeReference<List<MR_Client>> typeRef = new TypeReference<List<MR_Client>>() {
			};
			responseList = mapper.readValue(hsr.getResponseString(), typeRef);
		} catch (Exception ex) {
			logger.debug("getMRClients: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			responseList = new ArrayList<DmaapObject>();
			responseList.add(errResp);
		}
		return responseList;
	}

	/**
	 * Gets the message router client with the specified ID.
	 * 
	 * @param mrClientId
	 *            ID of the client to get
	 * @return DmaapObject: a MR_Client object on success; an ErrorResponse
	 *         object if the remote site rejects the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public DmaapObject getMRClient(final String mrClientId) throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(MR_CLIENTS, mrClientId));
		logger.debug("getMRClient: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getMRClient: unexpected null response");
		DmaapObject response = null;
		try {
			response = mapper.readValue(hsr.getResponseString(), MR_Client.class);
		} catch (Exception ex) {
			logger.debug("getMRClient: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			response = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
		}
		return response;
	}

	/**
	 * Creates a message router client.
	 * 
	 * @param mrClient
	 *            Message router client properties
	 * @return Status and response: expect 200 and a MR_Client on success; a
	 *         code and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> postMRClient(MR_Client mrClient) throws Exception {
		String jsonBody = mapper.writeValueAsString(mrClient);
		HttpStatusAndResponse<String> hsr = postRestContent(buildDmaapUri(MR_CLIENTS), jsonBody);
		logger.debug("postMRClient: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("postMRClient: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("postMRClient: null response body");
			return response;
		}
		try {
			MR_Client resp = mapper.readValue(hsr.getResponseString(), MR_Client.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postMRClient: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Updates a message router client.
	 * 
	 * @param mrClient
	 *            client to be updated
	 * @return Status and response; expect 200 and a MR_Client on success, a
	 *         string error on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> putMRClient(MR_Client mrClient) throws Exception {
		String jsonBody = mapper.writeValueAsString(mrClient);
		HttpStatusAndResponse<String> hsr = putRestContent(buildDmaapUri(MR_CLIENTS, mrClient.getMrClientId()),
				jsonBody);
		logger.debug("putMRClient: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("putMRClient: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("putMRClient: null response body");
			return response;
		}
		try {
			MR_Client resp = mapper.readValue(hsr.getResponseString(), MR_Client.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("putMRClient: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Deletes the message router client with the specified ID.
	 * 
	 * @param mrClientId
	 *            ID of the client to delete
	 * @return Status and response; expect 204 and a null on success, a string
	 *         error on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> deleteMRClient(final String mrClientId) throws Exception {
		HttpStatusAndResponse<String> hsr = deleteRestContent(buildDmaapUri(MR_CLIENTS, mrClientId));
		logger.debug("deleteMRClient: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("deleteMRClient: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("deleteMRClient: null response body");
			return response;
		}
		try {
			MR_Client resp = mapper.readValue(hsr.getResponseString(), MR_Client.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("deleteMRClient: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/////////////////////////////////////////////////////////////////////

	/**
	 * Gets a list of message router clusters.
	 * 
	 * @return List of DmaapObject: list contains MR_Cluster object(s) on
	 *         success; a single ErrorResponse object if the remote site rejects
	 *         the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public List<DmaapObject> getMRClusters() throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(MR_CLUSTERS));
		logger.debug("getMRClusters: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getMRClusters: unexpected null response");
		List<DmaapObject> responseList = null;
		try {
			TypeReference<List<MR_Cluster>> typeRef = new TypeReference<List<MR_Cluster>>() {
			};
			responseList = mapper.readValue(hsr.getResponseString(), typeRef);
		} catch (Exception ex) {
			logger.debug("getDcaeLocations: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			responseList = new ArrayList<DmaapObject>();
			responseList.add(errResp);
		}
		return responseList;
	}

	/**
	 * Gets the message router cluster with the specified location name.
	 * 
	 * @param dcaeLocName
	 *            name of the cluster to get
	 * @return DmaapObject: a MR_Cluster object on success; an ErrorResponse
	 *         object if the remote site rejects the request.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public DmaapObject getMRCluster(final String dcaeLocName) throws Exception {
		HttpStatusAndResponse<String> hsr = getRestContent(buildDmaapUri(MR_CLUSTERS, dcaeLocName));
		logger.debug("getMRCluster: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("getMRCluster: unexpected null response");
		DmaapObject response = null;
		try {
			response = mapper.readValue(hsr.getResponseString(), MR_Cluster.class);
		} catch (Exception ex) {
			logger.debug("getMRCluster: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			response = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
		}
		return response;
	}

	/**
	 * Creates a message router cluster.
	 * 
	 * @param mrCluster
	 *            Message router cluster properties
	 * @return Status and response: expect 200 and a MR_Cluster on success; a
	 *         code and an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> postMRCluster(MR_Cluster mrCluster) throws Exception {
		String jsonBody = mapper.writeValueAsString(mrCluster);
		HttpStatusAndResponse<String> hsr = postRestContent(buildDmaapUri(MR_CLUSTERS), jsonBody);
		logger.debug("postMRCluster: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("postMRCluster: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("postMRCluster: null response body");
			return response;
		}
		try {
			MR_Cluster resp = mapper.readValue(hsr.getResponseString(), MR_Cluster.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("postMRCluster: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Updates a message router cluster.
	 * 
	 * @param mrCluster
	 *            cluster to be updated
	 * @return Status and response; expect 200 and a MR_Cluster on success, a
	 *         string error on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> putMRCluster(MR_Cluster mrCluster) throws Exception {
		String jsonBody = mapper.writeValueAsString(mrCluster);
		HttpStatusAndResponse<String> hsr = putRestContent(buildDmaapUri(MR_CLUSTERS, mrCluster.getDcaeLocationName()),
				jsonBody);
		logger.debug("putMRCluster: resp is {}", hsr);
		if (hsr == null)
			throw new Exception("putMRCluster: unexpected null response");
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("putMRCluster: null response body");
			return response;
		}
		try {
			MR_Cluster resp = mapper.readValue(hsr.getResponseString(), MR_Cluster.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("putMRCluster: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/**
	 * Deletes the message router cluster with the specified location name.
	 * 
	 * @param dcaeLocName
	 *            Location name of the cluster to delete
	 * @return Status and response: expect 204 and a null on success; a code and
	 *         an ErrorResponse on failure.
	 * @throws Exception
	 *             if host cannot be reached, response cannot be parsed, etc.
	 */
	public HttpStatusAndResponse<Object> deleteMRCluster(final String dcaeLocName) throws Exception {
		HttpStatusAndResponse<String> hsr = deleteRestContent(buildDmaapUri(MR_CLUSTERS, dcaeLocName));
		if (hsr == null)
			throw new Exception("deleteMRCluster: unexpected null response");
		logger.debug("deleteMRCluster: resp is {}", hsr);
		HttpStatusAndResponse<Object> response = new HttpStatusAndResponse<Object>(hsr.getStatusCode(), null);
		if (hsr.getResponse() == null) {
			logger.debug("deleteMRCluster: null response body");
			return response;
		}
		try {
			MR_Cluster resp = mapper.readValue(hsr.getResponseString(), MR_Cluster.class);
			response.setResponse(resp);
		} catch (Exception ex) {
			logger.debug("deleteMRCluster: trying to parse response as error: {}", ex.toString());
			// If this parse fails, let the exception be thrown
			ErrorResponse errResp = mapper.readValue(hsr.getResponseString(), ErrorResponse.class);
			response.setResponse(errResp);
		}
		return response;
	}

	/////////////////////////////////////////////////////////////////////

	/**
	 * Builds the URI for the DMaaP REST endpoint using configuration and the
	 * specified task and path parameter(s). Deals with extra or missing slashes
	 * to allow for some flexibility in the config file.
	 * 
	 * @param requestPath
	 *            Last part of endpoint path
	 * @param pathParam
	 *            Additional path parameters in order; ignored if null or empty
	 * @return REST endpoint URI
	 * @throws Exception
	 *             if the RESAT URL property is not found
	 */
	private URI buildDmaapUri(String task, String... pathParam) throws Exception {
		if (dmaapRestUrl == null || dmaapRestUrl.length() == 0)
			throw new Exception("buildUrlPath: unconfigured, must set dmaapEndpointUrl");
		StringBuilder sb = new StringBuilder();
		// Clean the base of any trailing slashes
		sb.append(trimSlashes(dmaapRestUrl));
		sb.append('/');
		// task is controlled in this file, don't clean it.
		sb.append(task);
		if (pathParam != null) {
			for (String pp : pathParam) {
				sb.append('/');
				// path comes from the user, definitely clean it.
				sb.append(trimSlashes(pp));
			}
		}
		String urlPath = sb.toString();
		URIBuilder uriBuilder = new URIBuilder(urlPath);
		return uriBuilder.build();
	}

	/**
	 * Strips the specified string of leading and trailing forward-slash
	 * characters.
	 * 
	 * @param s
	 *            String to trim
	 * @return String without any leading or trailing '/' characters.
	 */
	private String trimSlashes(String s) {
		while (s.length() > 0 && s.charAt(0) == '/')
			s = s.substring(1, s.length());
		while (s.length() > 0 && s.charAt(s.length() - 1) == '/')
			s = s.substring(0, s.length() - 1);
		return s;
	}

}
