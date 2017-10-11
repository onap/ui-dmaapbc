package org.openecomp.dcae.dmaapbc.model;

import org.junit.Assert;
import org.junit.Test;
import org.openecomp.dcae.dmaapbc.model.DmaapObject.Dmaap_Status;

/**
 * Trivial POJO test.
 */
public class DcaeLocationTest {

	// superclass
	final String lastMod = "lastMod";
	final Dmaap_Status status = Dmaap_Status.NEW;
	// class
	final String clli = "clli";
	final String dcaeLayer = "dcaeLayer";
	final String dcaeLocationName = "dcaeLocationName";
	final String openStackAvailabilityZone = "openStackAvailabilityZone";
	
	@Test
	public void testModel() throws Exception {
		DcaeLocation model = new DcaeLocation();
		model.setLastMod(lastMod);
		model.setStatus(status);
		model.setClli(clli);
		model.setDcaeLayer(dcaeLayer);
		model.setDcaeLocationName(dcaeLocationName);
		model.setOpenStackAvailabilityZone(openStackAvailabilityZone);
		checkValues(model);
		
		model = new DcaeLocation( lastMod,  status,  clli,  dcaeLayer,  dcaeLocationName,
				 openStackAvailabilityZone);
		checkValues(model);
	}

	private void checkValues(DcaeLocation model) {
		Assert.assertEquals(lastMod, model.getLastMod());
		Assert.assertEquals(status,  model.getStatus());
		Assert.assertEquals(clli,  model.getClli());
		Assert.assertEquals(dcaeLayer,  model.getDcaeLayer());
		Assert.assertEquals(dcaeLocationName,  model.getDcaeLocationName());
		Assert.assertEquals(openStackAvailabilityZone,  model.getOpenStackAvailabilityZone());
	}

}
