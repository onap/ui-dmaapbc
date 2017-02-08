/*-
 * ================================================================================
 * DCAE DMaaP Bus Controller Web Application
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
package org.openecomp.dmaapbc.dbcapp.service;

import java.util.List;

import org.openecomp.dmaapbc.dbcapp.domain.DmaapAccess;

/**
 * Defines methods to manipulate the database table with DmaapAccess domain
 * objects. No method throws a checked exception, in keeping with the Spring
 * philosophy of throwing unchecked exceptions.
 */
public interface DmaapAccessService {

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
	 *             UID of the user
	 * @return List of DMaaP instance objects, which may be empty.
	 */
	List<DmaapAccess> getDmaapAccessList(String userId);

	/**
	 * Gets the DMaaP access object with the specified row ID.
	 * 
	 * @param dmaapId
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
	 */
	void deleteDmaapAccess(Long dmaapId);
	
}
