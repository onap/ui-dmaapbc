package org.openecomp.dcae.dmaapbc.dbcapp.rest;

/**
 * Models the responses sent by the micro service in JSON format.
 */
public class DbcUsvcRestResponse {

	private int status;
	private String data, error, exception;

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public String getException() {
		return exception;
	}

	public void setException(String exception) {
		this.exception = exception;
	}
}
