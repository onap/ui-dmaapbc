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

/**
 * Holds the status code and body that result from accessing an HTTP URL.
 */
public class HttpStatusAndResponse<ResponseType> {

	private int statusCode;
	private ResponseType response;

	public HttpStatusAndResponse(int status, ResponseType resp) {
		this.statusCode = status;
		this.response = resp;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(final int code) {
		this.statusCode = code;
	}

	public ResponseType getResponse() {
		return response;
	}

	public void setResponse(ResponseType response) {
		this.response = response;
	}

	/**
	 * Convenience method to avoid testing for null and calling .toString()
	 * 
	 * @return String version of the response object; null if the object is
	 *         null.
	 */
	public String getResponseString() {
		return response == null ? null : response.toString();
	}

	@Override
	public String toString() {
		return "HttpStatusAndResponse[" + Integer.toString(statusCode) + ";"
				+ (response == null ? "" : response.toString()) + "]";
	}
}
