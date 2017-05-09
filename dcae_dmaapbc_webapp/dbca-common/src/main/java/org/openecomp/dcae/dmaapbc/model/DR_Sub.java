/*-
 * ================================================================================
 * DCAE DMaaP Bus Controller Models
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
package org.openecomp.dcae.dmaapbc.model;

/**
 * Bean that models a DMaaP Data Router subscriber.
 */
public class DR_Sub extends DmaapObject {

	/** Tag where this publisher is deployed */
	private String dcaeLocationName;
	/** name used for basic authentication from DR */
	private String username;
	/** password used for basic authentication from DR */
	private String userpwd;
	/** tag of feed for which this publisher is a source */
	private String feedId;
	/** URL used by DR to deliver files to this subscriber */
	private String deliveryURL;
	/** URL for accessing the transaction log for this susbcriber */
	private String logURL;
	/** unique ID for a subscriber in this DR environment */
	private String subId;
	/** TODO */
	private boolean suspended;
	/** TODO */
	private boolean use100;
	/** TODO */
	private String owner;

	public DR_Sub() {
	}

	public DR_Sub(String lastMod, Dmaap_Status status, String dcaeLocationName, String username, String userpwd,
			String feedId, String deliveryURL, String logURL, String subId, boolean suspended, boolean use100,
			String owner) {
		super(lastMod, status);
		this.dcaeLocationName = dcaeLocationName;
		this.username = username;
		this.userpwd = userpwd;
		this.feedId = feedId;
		this.deliveryURL = deliveryURL;
		this.logURL = logURL;
		this.subId = subId;
		this.suspended = suspended;
		this.use100 = use100;
		this.owner = owner;
	}

	public String getDcaeLocationName() {
		return dcaeLocationName;
	}

	public void setDcaeLocationName(String dcaeLocationName) {
		this.dcaeLocationName = dcaeLocationName;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUserpwd() {
		return userpwd;
	}

	public void setUserpwd(String userpwd) {
		this.userpwd = userpwd;
	}

	public String getFeedId() {
		return feedId;
	}

	public void setFeedId(String feedId) {
		this.feedId = feedId;
	}

	public String getDeliveryURL() {
		return deliveryURL;
	}

	public void setDeliveryURL(String deliveryURL) {
		this.deliveryURL = deliveryURL;
	}

	public String getLogURL() {
		return logURL;
	}

	public void setLogURL(String logURL) {
		this.logURL = logURL;
	}

	public String getSubId() {
		return subId;
	}

	public void setSubId(String subId) {
		this.subId = subId;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public boolean isSuspended() {
		return suspended;
	}

	public void setSuspended(boolean suspended) {
		this.suspended = suspended;
	}

	public boolean isUse100() {
		return use100;
	}

	public void setUse100(boolean use100) {
		this.use100 = use100;
	}

	@Override
	public String toString() {
		return "DR_Sub[dcaeLocationName=" + dcaeLocationName + ", feedId=" + feedId + ", ...]";
	}

}
