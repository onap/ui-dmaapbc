package org.openecomp.dcae.dmaapbc.dbcapp.domain;

import java.util.Map;

/**
 * Holds a set of String key-value pairs, the JSON version of a
 * java.util.Attributes object read from a jar/war file.
 */
public class ManifestTransportModel {

	private Map<String, String> manifest;

	/**
	 * Standard POJO no-arg constructor
	 */
	public ManifestTransportModel() {
	}

	public Map<String, String> getManifest() {
		return manifest;
	}

	public void setManifest(Map<String, String> manifest) {
		this.manifest = manifest;
	}

	@Override
	public String toString() {
		return "Manifest[size=" + manifest.size() + "]";
	}

}
