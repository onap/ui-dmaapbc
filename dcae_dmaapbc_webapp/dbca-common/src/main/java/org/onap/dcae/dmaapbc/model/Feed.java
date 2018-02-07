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
package org.onap.dcae.dmaapbc.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Bean that models a DMaaP Data Router feed.
 */
public class Feed extends DmaapObject {

	public enum Feed_Status {
		EMPTY, NEW, STAGED, VALID, INVALID, DELETED
	}

	/** unique id assigned by the DR PROV server for this feed */
	private String feedId;
	/** name of feed. Combined with feedVersion must be unique */
	private String feedName;
	/** version of feed. Combined with feedName must be unique */
	private String feedVersion;
	/** description */
	private String feedDescription;
	/** ASPR classification */
	private String asprClassification;
	/** provisioning URL for adding subscribers to this feed */
	private String subscribeURL;
	/** URL publisher use to connect to DR */
	private String publishURL;
	/** URL for transaction log for this feed */
	private String logURL;
	/** indicator of whether the feed is suspended */
	private boolean suspended;
	/** what identity owns this feed */
	private String owner;
	/** id of format description of feed content */
	private String formatUuid;
	/** a set of publishers for this feed */
	private List<DR_Pub> pubs;
	/** a set of subscribers for this feed */
	private List<DR_Sub> subs;

	public Feed() {
		this.pubs = new ArrayList<DR_Pub>();
		this.subs = new ArrayList<DR_Sub>();
	}

	public Feed(Dmaap_Status status, String lastMod, String feedName, String feedVersion, String feedDescription,
			String asprClassification, String subscribeURL, String publishURL, String logURL, boolean suspended,
			String owner, String formatUuid) {
		super(lastMod, status);
		this.feedName = feedName;
		this.feedVersion = feedVersion;
		this.feedDescription = feedDescription;
		this.asprClassification = asprClassification;
		this.subscribeURL = subscribeURL;
		this.publishURL = publishURL;
		this.logURL = logURL;
		this.suspended = suspended;
		this.owner = owner;
		this.formatUuid = formatUuid;
		this.pubs = new ArrayList<DR_Pub>();
		this.subs = new ArrayList<DR_Sub>();
	}

	public String getFeedId() {
		return feedId;
	}

	public void setFeedId(String feedId) {
		this.feedId = feedId;
	}

	public String getFeedName() {
		return feedName;
	}

	public void setFeedName(String feedName) {
		this.feedName = feedName;
	}

	public String getFeedVersion() {
		return feedVersion;
	}

	public void setFeedVersion(String feedVersion) {
		this.feedVersion = feedVersion;
	}

	public String getFeedDescription() {
		return feedDescription;
	}

	public void setFeedDescription(String feedDescription) {
		this.feedDescription = feedDescription;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getAsprClassification() {
		return asprClassification;
	}

	public void setAsprClassification(String asprClassification) {
		this.asprClassification = asprClassification;
	}

	public String getSubscribeURL() {
		return subscribeURL;
	}

	public void setSubscribeURL(String subscribeURL) {
		this.subscribeURL = subscribeURL;
	}

	public String getPublishURL() {
		return publishURL;
	}

	public void setPublishURL(String publishURL) {
		this.publishURL = publishURL;
	}

	public String getLogURL() {
		return logURL;
	}

	public void setLogURL(String logURL) {
		this.logURL = logURL;
	}

	public boolean isSuspended() {
		return suspended;
	}

	public void setSuspended(boolean suspended) {
		this.suspended = suspended;
	}

	public String getFormatUuid() {
		return formatUuid;
	}

	public void setFormatUuid(String formatUuid) {
		this.formatUuid = formatUuid;
	}

	public List<DR_Pub> getPubs() {
		return pubs;
	}

	public void setPubs(List<DR_Pub> pubs) {
		this.pubs = pubs;
	}

	public List<DR_Sub> getSubs() {
		return subs;
	}

	public void setSubs(List<DR_Sub> subs) {
		this.subs = subs;
	}

	@Override
	public String toString() {
		return "Feed[feedId=" + feedId + ", feedName=" + feedName + ", feedVersion=" + feedVersion + ", ...]";
	}

}
