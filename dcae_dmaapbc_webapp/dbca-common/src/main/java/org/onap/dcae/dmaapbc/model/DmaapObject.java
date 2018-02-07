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

/**
 * Parent class for all DMaaP BC models.
 */
public abstract class DmaapObject {

	public enum Dmaap_Status {
		EMPTY, NEW, STAGED, VALID, INVALID, DELETED
	}

	/** time stamp when object was last modified */
	private String lastMod;
	/** indicator of health of this object using values common in this API */
	private Dmaap_Status status;
	/** TODO */
	private String type;
	
	public DmaapObject() {	
	}
	
	public DmaapObject(String lastMod, Dmaap_Status status) {
		this.lastMod = lastMod;
		this.status = status;
	}
	
	public String getLastMod() {
		return lastMod;
	}

	public void setLastMod(String lastMod) {
		this.lastMod = lastMod;
	}

	public Dmaap_Status getStatus() {
		return status;
	}

	public void setStatus(Dmaap_Status status) {
		this.status = status;
	}

	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}

}
