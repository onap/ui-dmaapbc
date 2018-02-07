package org.onap.dcae.dmaapbc.dbcapp.service;

import java.util.List;

import org.onap.dcae.dmaapbc.dbcapp.domain.DmaapAccess;
import org.onap.dcae.dmaapbc.dbcapp.domain.ManifestTransportModel;

/**
 * Defines methods to manipulate the database table with DmaapAccess domain
 * objects. No method throws a checked exception, in keeping with the Spring
 * philosophy of throwing unchecked exceptions.
 */
public interface DmaapAccessService {

	/**
	 * Gets build information.
	 * 
	 * @return List of key-value pairs; implementations may return null.
	 */
	ManifestTransportModel getManifest();

	/**
	 * Gets the number of Dmaap Access entries.
	 * 
	 * @return Number of rows in the table.
	 */
	int getDmaapAccessCount();

	/**
	 * Gets all DMaaP access rows in the table for the specified user.
	 * 
	 * @param userId
	 *            Login ID of the user
	 * @return List of DMaaP instance objects, which may be empty.
	 */
	List<DmaapAccess> getDmaapAccessList(String userId);

	/**
	 * Gets the DMaaP access object with the specified row ID.
	 * 
	 * @param dmaapId
	 *            Access profile ID
	 * @return DMaap instance; null if none exists.
	 */
	DmaapAccess getDmaapAccess(Long dmaapId);

	/**
	 * Creates a new managed object (a new row in the table).
	 * 
	 * @param dmaap
	 *            DMaaP instance to create.
	 */
	void saveDmaapAccess(DmaapAccess dmaap);

	/**
	 * Deletes the DMaaP access row with the specified ID.
	 * 
	 * @param dmaapId
	 *            Access profile ID
	 */
	void deleteDmaapAccess(Long dmaapId);

}
