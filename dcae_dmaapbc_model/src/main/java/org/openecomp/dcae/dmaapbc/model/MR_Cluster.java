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

import java.util.List;

/**
 * Bean that models a DMaaP Message Router cluster.
 */
public class MR_Cluster extends DmaapObject {

	/** dcaeLocation where cluster VMs are deployed */
	private String dcaeLocationName;
	/** DNS name used by MR clients for this cluster */
	private String fqdn;
	/** an array of hosts that are part of the MR Cluster. */
	private List<String> hosts;
	/** TODO */
	private String topicPort;
	/** TODO */
	private String topicProtocol;

	public MR_Cluster() {
	}

	/**
	 * @param dcaeLocationName
	 * @param fqdn
	 * @param hosts
	 */
	public MR_Cluster(Dmaap_Status status, String lastMod, String dcaeLocationName, String fqdn,
			final String[] hosts) {
		super(lastMod, status);
		this.dcaeLocationName = dcaeLocationName;
		this.fqdn = fqdn;
		for (String h : hosts)
			this.hosts.add(h);
	}

	public String getDcaeLocationName() {
		return dcaeLocationName;
	}

	public void setDcaeLocationName(String dcaeLocationName) {
		this.dcaeLocationName = dcaeLocationName;
	}

	public String getFqdn() {
		return fqdn;
	}

	public void setFqdn(String fqdn) {
		this.fqdn = fqdn;
	}

	public List<String> getHosts() {
		return hosts;
	}

	public void setHosts(List<String> hosts) {
		this.hosts = hosts;
	}

	public String getTopicPort() {
		return topicPort;
	}

	public void setTopicPort(String topicPort) {
		this.topicPort = topicPort;
	}

	public String getTopicProtocol() {
		return topicProtocol;
	}

	public void setTopicProtocol(String topicProtocol) {
		this.topicProtocol = topicProtocol;
	}

	@Override
	public String toString() {
		return "MR_Cluster[dcaeLocationName=" + dcaeLocationName + ", fqdn=" + fqdn + ", ...]";
	}

}
