package org.openecomp.dcae.dmaapbc.dbcapp.rest;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.openecomp.dcae.dmaapbc.dbcapp.domain.DmaapAccess;
import org.openecomp.dcae.dmaapbc.dbcapp.domain.ManifestTransportModel;
import org.openecomp.dcae.dmaapbc.dbcapp.service.DmaapAccessService;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

/**
 * Provides methods for accessing the DBC microservice via REST using basic HTTP
 * authentication.
 * 
 */
public class DbcUsvcRestClient implements DmaapAccessService {

	public static final String endpointPath = "/dmaap_access";
	private final String baseUrl;
	private final RestTemplate restTemplate;

	/**
	 * Builds a restTemplate that uses basic HTTP authentication for use by all
	 * methods in this class.
	 * 
	 * @param webapiUrl
	 *            URL of the web endpoint
	 * @param user
	 *            user name
	 * @param pass
	 *            password
	 */
	public DbcUsvcRestClient(String webapiUrl, String user, String pass) {
		if (webapiUrl == null || user == null || pass == null)
			throw new IllegalArgumentException("Nulls not permitted");

		baseUrl = webapiUrl;
		URL url = null;
		try {
			url = new URL(baseUrl);
		} catch (MalformedURLException ex) {
			throw new RuntimeException("Failed to parse URL", ex);
		}
		final HttpHost httpHost = new HttpHost(url.getHost(), url.getPort());

		// Build a client with a credentials provider
		CredentialsProvider credsProvider = new BasicCredentialsProvider();
		credsProvider.setCredentials(new AuthScope(httpHost), new UsernamePasswordCredentials(user, pass));
		HttpClientBuilder clientBuilder = HttpClientBuilder.create();
		CloseableHttpClient httpClient = clientBuilder.setDefaultCredentialsProvider(credsProvider).build();

		// Create request factory with our superpower client
		HttpComponentsClientHttpRequestFactoryBasicAuth requestFactory = new HttpComponentsClientHttpRequestFactoryBasicAuth(
				httpHost);
		requestFactory.setHttpClient(httpClient);

		// Put the factory in the template
		this.restTemplate = new RestTemplate();
		restTemplate.setRequestFactory(requestFactory);
	}

	/**
	 * Gets the manifest from the micro service.
	 */
	@Override
	public ManifestTransportModel getManifest() {
		String url = baseUrl + "/manifest";
		ResponseEntity<ManifestTransportModel> daResponse = restTemplate.exchange(url, HttpMethod.GET, null,
				ManifestTransportModel.class);
		ManifestTransportModel response = daResponse.getBody();
		return response;
	}

	/**
	 * Gets the count of DMaaP access profiles.
	 * 
	 * @return Number of access profiles in the database.
	 */
	public int getDmaapAccessCount() {
		String url = baseUrl + "/count_dmaap_access";
		ResponseEntity<DbcUsvcRestResponse> daResponse = restTemplate.exchange(url, HttpMethod.GET, null,
				DbcUsvcRestResponse.class);
		DbcUsvcRestResponse response = daResponse.getBody();
		return response.getStatus();
	}

	/**
	 * Gets the DMaaP access profiles for the specified userId.
	 * 
	 * @param userId
	 *            User ID
	 * @return List of access profiles
	 */
	@Override
	public List<DmaapAccess> getDmaapAccessList(final String userId) {
		String url = baseUrl + endpointPath + "?userId=" + userId;
		ResponseEntity<List<DmaapAccess>> daResponse = restTemplate.exchange(url, HttpMethod.GET, null,
				new ParameterizedTypeReference<List<DmaapAccess>>() {
				});
		List<DmaapAccess> daList = daResponse.getBody();
		return daList;
	}

	/**
	 * Gets the specified DMaaP access profile.
	 */
	@Override
	public DmaapAccess getDmaapAccess(Long dmaapId) {
		String url = baseUrl + endpointPath + "?dmaapId=" + dmaapId;
		ResponseEntity<DmaapAccess> daResponse = restTemplate.exchange(url, HttpMethod.GET, null,
				new ParameterizedTypeReference<DmaapAccess>() {
				});
		DmaapAccess da = daResponse.getBody();
		return da;
	}

	/**
	 * POSTs or PUTs the DMaaP access profile as needed, based on whether the
	 * object's ID field is set. If not set it creates a new row; if set, it
	 * updates a row in the remote service table.
	 * 
	 * @param dmaapAccess
	 *            Access profile
	 */
	@Override
	public void saveDmaapAccess(final DmaapAccess dmaapAccess) {
		if (dmaapAccess.getId() == null) {
			String url = baseUrl + endpointPath;
			restTemplate.postForObject(url, dmaapAccess, String.class);
		} else {
			String url = baseUrl + endpointPath + "/" + Long.toString(dmaapAccess.getId());
			restTemplate.put(url, dmaapAccess);
		}
	}

	/**
	 * Deletes the DMaaP access profile row in the remote service table with the
	 * specified id.
	 * 
	 * @param id
	 *            Access profile ID
	 */
	@Override
	public void deleteDmaapAccess(final Long id) {
		String url = baseUrl + endpointPath + "/" + Long.toString(id);
		restTemplate.delete(url);
	}

	/**
	 * Simple test
	 * 
	 * @param args
	 *            UserID
	 * @throws Exception
	 *             On any failure
	 */
	public static void main(String[] args) throws Exception {
		if (args.length != 1)
			throw new IllegalArgumentException("Single argument expected: userid");
		DbcUsvcRestClient client = new DbcUsvcRestClient("http://localhost:8081/dbus", "dbus_user", "dbus_pass");
		final String userId = args[0];
		System.out.println("Requesting profiles for user " + userId);
		List<DmaapAccess> access = client.getDmaapAccessList(userId);
		if (access == null)
			System.err.println("Received null");
		else
			for (DmaapAccess da : access)
				System.out.println(da);
	}

}
