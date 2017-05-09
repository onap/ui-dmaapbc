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
 * Bean that models a DMaaP instance.
 */
public class Dmaap extends DmaapObject {

	/** the version of DMaaP BC software */
	private String version;
	/** the root portion of the topic namespace */
	private String topicNsRoot;
	/**
	 * a unique identifier for this instance.
	 */
	private String dmaapName;
	/** URL for DR Provisioning Server */
	private String drProvUrl;
	/**
	 * topic name used by MR Bridge Admin to communicate which topics to
	 * replicate
	 */
	private String bridgeAdminTopic;
	/** used by DCAE Controller to upload event logs */
	private String loggingUrl;
	/** used by DCAE Controller to authenticate inter-node messages */
	private String nodeKey;
	/** used by DCAE Controller to set up ssh access to VMs */
	private String accessKeyOwner;

	public Dmaap() {
	}

	public Dmaap(String lastMod, Dmaap_Status status, String version, String topicNsRoot, String dmaapName,
			String drProvUrl, String loggingUrl, String nodeKey, String accessKeyOwner) {
		super(lastMod, status);
		this.version = version;
		this.topicNsRoot = topicNsRoot;
		this.dmaapName = dmaapName;
		this.drProvUrl = drProvUrl;
		this.loggingUrl = loggingUrl;
		this.nodeKey = nodeKey;
		this.accessKeyOwner = accessKeyOwner;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getTopicNsRoot() {
		return topicNsRoot;
	}

	public void setTopicNsRoot(String topicNsRoot) {
		this.topicNsRoot = topicNsRoot;
	}

	public String getDmaapName() {
		return dmaapName;
	}

	public void setDmaapName(String dmaapName) {
		this.dmaapName = dmaapName;
	}

	public String getDrProvUrl() {
		return drProvUrl;
	}

	public void setDrProvUrl(String drProvUrl) {
		this.drProvUrl = drProvUrl;
	}

	public String getLogginUrl() {
		return loggingUrl;
	}

	public void setLogginUrl(String logginUrl) {
		this.loggingUrl = logginUrl;
	}

	public String getNodeKey() {
		return nodeKey;
	}

	public void setNodeKey(String nodeKey) {
		this.nodeKey = nodeKey;
	}

	public String getAccessKeyOwner() {
		return accessKeyOwner;
	}

	public void setAccessKeyOwner(String accessKeyOwner) {
		this.accessKeyOwner = accessKeyOwner;
	}

	public String getLoggingUrl() {
		return loggingUrl;
	}

	public void setLoggingUrl(String loggingUrl) {
		this.loggingUrl = loggingUrl;
	}

	public String getBridgeAdminTopic() {
		return bridgeAdminTopic;
	}

	public void setBridgeAdminTopic(String bridgeAdminTopic) {
		this.bridgeAdminTopic = bridgeAdminTopic;
	}

	@Override
	public String toString() {
		return "Dmaap[dmaapName=" + dmaapName + ", version=" + version + ", ...]";
	}

}
