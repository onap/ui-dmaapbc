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
package org.openecomp.dcae.dmaapbc.client;

import java.io.IOException;
import java.net.URI;

import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.AuthCache;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.config.RequestConfig.Builder;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.BasicAuthCache;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Provides a basic client to access a REST endpoint, optionally using HTTP
 * basic authentication.
 * 
 * Caveat: If HTTPS access is used and the server uses a self-signed
 * certificate, the local trust store must be extended appropriately. The client
 * throws exceptions if the JVM cannot validate the server certificate.
 */
public class SimpleRestClientBase {

	private static Logger logger = LoggerFactory.getLogger(SimpleRestClientBase.class);

	/**
	 * Credentials for HTTP basic authentication (optional).
	 */
	private final String username;
	private final String password;

	/**
	 * Timeouts (optional)
	 */
	private Integer connectTimeoutMs = null;
	private Integer connectionRequestTimeoutMs = null;
	private Integer socketTimeoutMs = null;

	/**
	 * Constructs a client that does not use any authentication and uses Apache
	 * HTTPD client default values for timeouts.
	 */
	public SimpleRestClientBase() {
		this(null, null, null, null, null);
	}

	/**
	 * Convenience constructor to build a client that uses the specified
	 * username and password for basic HTTP authentication on all requests. In
	 * other words, this client pre-emptively sends the "Basic" header instead
	 * of first trying the request without, failing, negotiating, then sending
	 * with credentials.
	 * 
	 * @param username
	 *            User name for basic HTTP authentication.
	 * @param password
	 *            Password for basic HTTP authentication.
	 */
	public SimpleRestClientBase(final String username, final String password) {
		this(username, password, null, null, null);
	}

	/**
	 * Convenience constructor to build a client that uses the specified
	 * timeouts on all requests.
	 *
	 * @param connectTimeoutMs
	 *            Connection timeout, in milliseconds
	 * @param connectionRequestTimeoutMs
	 *            Connection request timeout, in milliseconds
	 * @param socketTimeoutMs
	 *            Socket timeout, in milliseconds
	 */
	public SimpleRestClientBase(final Integer connectTimeoutMs, final Integer connectionRequestTimeoutMs,
			final Integer socketTimeoutMs) {
		this(null, null, connectTimeoutMs, connectionRequestTimeoutMs, socketTimeoutMs);
	}

	/**
	 * Constructs a client with the specified credentials and timeout values.
	 * 
	 * @param username
	 *            User name for basic HTTP authentication; ignored if null
	 * @param password
	 *            Password for basic HTTP authentication; ignored if null
	 * @param connectTimeoutMs
	 *            ignored if null
	 * @param connectionRequestTimeoutMs
	 *            ignored if null
	 * @param socketTimeoutMs
	 *            ignored if null
	 */
	public SimpleRestClientBase(final String username, final String password, final Integer connectTimeoutMs,
			final Integer connectionRequestTimeoutMs, final Integer socketTimeoutMs) {
		this.username = username;
		this.password = password;
		this.connectTimeoutMs = null;
		this.connectionRequestTimeoutMs = null;
		this.socketTimeoutMs = null;
	}

	/**
	 * Constructs and sends a GET request for the URI.
	 * 
	 * @param uri
	 *            REST endpoint
	 * @return Result of the get
	 * @throws Exception
	 *             On any error
	 */
	public HttpStatusAndResponse<String> getRestContent(final URI uri) throws Exception {
		HttpGet httpGet = new HttpGet(uri);
		return doRestRequest(httpGet);
	}

	/**
	 * Constructs and sends a POST request using the specified body.
	 * 
	 * @param uri
	 *            REST endpoint
	 * @param json
	 *            Content to post
	 * @return Result of the post; null if an error happens
	 * @throws Exception
	 *             On any error
	 */
	public HttpStatusAndResponse<String> postRestContent(final URI uri, final String json) throws Exception {
		HttpPost httpPost = new HttpPost(uri);
		StringEntity postEntity = new StringEntity(json, ContentType.create("application/json", Consts.UTF_8));
		httpPost.setEntity(postEntity);
		return doRestRequest(httpPost);
	}

	/**
	 * Constructs and sends a PUT request using the specified body.
	 * 
	 * @param uri
	 *            REST endpoint
	 * @param json
	 *            Content to put
	 * @return Result of the put; null if an error happens
	 * @throws Exception
	 *             On any error
	 */
	public HttpStatusAndResponse<String> putRestContent(final URI uri, final String json) throws Exception {
		HttpPut httpPut = new HttpPut(uri);
		StringEntity postEntity = new StringEntity(json, ContentType.create("application/json", Consts.UTF_8));
		httpPut.setEntity(postEntity);
		return doRestRequest(httpPut);
	}

	/**
	 * Constructs and sends a DELETE request for the URI.
	 * 
	 * @param uri
	 *            REST endpoint
	 * @return Result of the get
	 * @throws Exception
	 *             On any error
	 */
	public HttpStatusAndResponse<String> deleteRestContent(final URI uri) throws Exception {
		HttpDelete httpDel = new HttpDelete(uri);
		return doRestRequest(httpDel);
	}

	/**
	 * Executes the specified request and gathers the response.
	 * 
	 * @param request
	 *            HttpGet, HttpPost, etc.
	 * @return Status code and response body
	 * @throws ClientProtocolException
	 *             On HTTP protocol error
	 * @throws IOException
	 *             On read/write error
	 */
	private HttpStatusAndResponse<String> doRestRequest(final HttpRequestBase request)
			throws ClientProtocolException, IOException {

		// Set up authentication if needed
		final HttpClientContext context = HttpClientContext.create();
		if (this.username != null || this.password != null) {
			UsernamePasswordCredentials credentials = new UsernamePasswordCredentials(this.username, this.password);
			CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
			credentialsProvider.setCredentials(AuthScope.ANY, credentials);
			context.setCredentialsProvider(credentialsProvider);

			HttpHost host = new HttpHost(request.getURI().getHost(), request.getURI().getPort(),
					request.getURI().getScheme());
			AuthCache authCache = new BasicAuthCache();
			authCache.put(host, new BasicScheme());
			context.setAuthCache(authCache);
		}
		final Builder requestConfigBuilder = RequestConfig.custom();
		if (connectionRequestTimeoutMs != null)
			requestConfigBuilder.setConnectionRequestTimeout(connectionRequestTimeoutMs);
		if (connectTimeoutMs != null)
			requestConfigBuilder.setConnectTimeout(connectTimeoutMs);
		if (socketTimeoutMs != null)
			requestConfigBuilder.setSocketTimeout(socketTimeoutMs);
		RequestConfig requestConfig = requestConfigBuilder.build();
		final CloseableHttpClient httpClient = HttpClients.custom().setDefaultRequestConfig(requestConfig).build();
		CloseableHttpResponse response = null;
		String responseJson = null;
		try {
			response = httpClient.execute(request, context);
			// Some methods return non-200 on success
			logger.debug("doRestRequest: status is {}", response.getStatusLine());
			HttpEntity entity = response.getEntity();
			// This is common; don't warn
			if (entity == null) {
				logger.debug("doRestRequest: Entity is null");
			} else {
				// entity content length is never set;
				// this naively tries to read everything.
				responseJson = EntityUtils.toString(entity);
				EntityUtils.consume(entity);
				// Don't give back empty string;
				// it has no more meaning than null.
				if (responseJson.length() == 0)
					responseJson = null;
			}
		} finally {
			if (response != null)
				response.close();
		}
		if (response == null)
			return null;
		return new HttpStatusAndResponse<String>(response.getStatusLine().getStatusCode(), responseJson);
	}

	/**
	 * Basic test invocation.
	 * 
	 * @param args
	 *            Expect 1 argument, the URL of a REST endpoint.
	 * @throws Exception
	 *             if anything goes wrong
	 */
	public static void main(String[] args) throws Exception {
		if (args.length != 1)
			throw new IllegalArgumentException("Expect 1 argument: REST URL for GET");
		SimpleRestClientBase client = new SimpleRestClientBase();
		URIBuilder uriBuilder = new URIBuilder(args[0]);
		URI uri = uriBuilder.build();
		HttpStatusAndResponse<String> hsr = client.getRestContent(uri);
		System.out.println("Response code is " + hsr.getStatusCode());
		System.out.println(hsr.getResponseString());
		System.out.println("main ends.");
	}
}
