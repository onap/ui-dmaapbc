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
 * Bean that models a DMaaP DCAE location.
 */
public class DcaeLocation extends DmaapObject {

	public enum Dcae_Status {
		EMPTY, NEW, STAGED, VALID, INVALID
	}

	/**
	 * AT&T network location code used to identify the location. (might there be more
	 * than one location per clli?)
	 */
	private String clli;
	/**
	 * indicator of DCAE layer. Either opendcae-central or opendcae-local-ntc
	 */
	private String dcaeLayer;
	/**
	 * unique name of this dcaeLocation. Value should match what DCAE Controller
	 * uses.
	 */
	private String dcaeLocationName;
	/** determines â€œwhere,â€� within the OpenStack deployment, the edge exists */
	private String openStackAvailabilityZone;

	public DcaeLocation() {
	}

	public DcaeLocation(String lastMod, Dmaap_Status status, String clli, String dcaeLayer, String dcaeLocationName,
			String openStackAvailabilityZone) {
		super(lastMod, status);
		this.clli = clli;
		this.dcaeLayer = dcaeLayer;
		this.dcaeLocationName = dcaeLocationName;
		this.openStackAvailabilityZone = openStackAvailabilityZone;
	}

	public String getClli() {
		return clli;
	}

	public void setClli(String clli) {
		this.clli = clli;
	}

	public String getDcaeLayer() {
		return dcaeLayer;
	}

	public void setDcaeLayer(String dcaeLayer) {
		this.dcaeLayer = dcaeLayer;
	}

	public String getDcaeLocationName() {
		return dcaeLocationName;
	}

	public void setDcaeLocationName(String dcaeLocationName) {
		this.dcaeLocationName = dcaeLocationName;
	}

	public String getOpenStackAvailabilityZone() {
		return openStackAvailabilityZone;
	}

	public void setOpenStackAvailabilityZone(String openStackAvailabilityZone) {
		this.openStackAvailabilityZone = openStackAvailabilityZone;
	}

	@Override
	public String toString() {
		return "DcaeLocation[dcaeLocationName=" + dcaeLocationName + ", dcaeLayer=" + dcaeLayer + ", ...]";
	}

}
