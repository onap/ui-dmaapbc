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
 * Bean that models a DMaaP Message Router topic.
 */
public class Topic extends DmaapObject {

	/** fully qualified topic name (topic_ns_root.environment.topic_name) */
	private String fqtn;
	/** application supplied value for topicName */
	private String topicName;
	/** description of topic */
	private String topicDescription;
	/** what identity owns this topic */
	private String owner;
	/** flag to MR indicating whether transactions are enabled for this topic */
	private String tnxEnabled;
	/** id of format description of feed content */
	private String formatUuid;
	/** indicates what replication pattern, if any, is desired */
	private String replicationCase;
	/** name of a specific Global MR host */
	private String globalMrURL;
	/** a set of publishers and subscribers for this topic */
	private List<MR_Client> clients;

	public Topic() {
		this.clients = new ArrayList<MR_Client>();
	}

	public Topic(String lastMod, Dmaap_Status status, String fqtn, String topicName, String topicDescription,
			String owner, String tnxEnabled, String formatUuid, String replicationCase, String globalMrURL) {
		super(lastMod, status);
		this.fqtn = fqtn;
		this.topicName = topicName;
		this.topicDescription = topicDescription;
		this.owner = owner;
		this.tnxEnabled = tnxEnabled;
		this.formatUuid = formatUuid;
		this.replicationCase = replicationCase;
		this.globalMrURL = globalMrURL;
		this.clients = new ArrayList<MR_Client>();
	}

	public String getFqtn() {
		return fqtn;
	}

	public void setFqtn(String fqtn) {
		this.fqtn = fqtn;
	}

	public String getTopicName() {
		return topicName;
	}

	public void setTopicName(String topicName) {
		this.topicName = topicName;
	}

	public String getTopicDescription() {
		return topicDescription;
	}

	public void setTopicDescription(String topicDescription) {
		this.topicDescription = topicDescription;
	}

	public String getTnxEnabled() {
		return tnxEnabled;
	}

	public void setTnxEnabled(String tnxEnabled) {
		this.tnxEnabled = tnxEnabled;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getFormatUuid() {
		return formatUuid;
	}

	public void setFormatUuid(String formatUuid) {
		this.formatUuid = formatUuid;
	}

	public List<MR_Client> getClients() {
		return clients;
	}

	public void setClients(List<MR_Client> clients) {
		this.clients = clients;
	}

	public String getReplicationCase() {
		return replicationCase;
	}

	public void setReplicationCase(String replicationCase) {
		this.replicationCase = replicationCase;
	}

	public String getGlobalMrURL() {
		return globalMrURL;
	}

	public void setGlobalMrURL(String globalMrURL) {
		this.globalMrURL = globalMrURL;
	}
	
	@Override
	public String toString() {
		return "Topic[fqtn=" + fqtn + ", topicName=" + topicName + ", ...]";
	}

}
