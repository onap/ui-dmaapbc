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
 * Bean that models a DMaaP Data Router node.
 */
public class DR_Node extends DmaapObject {

	private String fqdn;
	/** dcaeLocation where node VM is deployed */
	private String dcaeLocationName;
	/**
	 * name for this VM (sometimes this is a local VM name and may be different
	 * than FQDN)
	 */
	private String hostName;
	/** version of Node software package */
	private String version;

	public DR_Node() {
	}

	public DR_Node(String lastMod, Dmaap_Status status, String fqdn, String dcaeLocationName, String hostName,
			String version) {
		super(lastMod, status);
		this.fqdn = fqdn;
		this.dcaeLocationName = dcaeLocationName;
		this.hostName = hostName;
		this.version = version;
	}

	public String getFqdn() {
		return fqdn;
	}

	public void setFqdn(String fqdn) {
		this.fqdn = fqdn;
	}

	public String getDcaeLocationName() {
		return dcaeLocationName;
	}

	public void setDcaeLocationName(String dcaeLocationName) {
		this.dcaeLocationName = dcaeLocationName;
	}

	public String getHostName() {
		return hostName;
	}

	public void setHostName(String hostName) {
		this.hostName = hostName;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	@Override
	public String toString() {
		return "DR_Node[fqdn=" + fqdn + ", dcaeLocationName=" + dcaeLocationName + ", ...]";
	}

}
