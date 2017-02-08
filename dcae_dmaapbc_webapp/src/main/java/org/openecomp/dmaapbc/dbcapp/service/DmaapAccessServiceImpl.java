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

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.openecomp.dmaapbc.dbcapp.domain.DmaapAccess;
import org.openecomp.portalsdk.core.service.DataAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Hibernate-assisted methods to manipulate the DBCA_DMAAP table.
 */
@Service("dmaapAccessService")
@Transactional
public class DmaapAccessServiceImpl implements DmaapAccessService {

	@Autowired
	private DataAccessService dataAccessService;

	public DataAccessService getDataAccessService() {
		return dataAccessService;
	}

	public void setDataAccessService(DataAccessService dataAccessService) {
		this.dataAccessService = dataAccessService;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public int getDmaapAccessCount() {
		List<DmaapAccess> accesses = (List<DmaapAccess>) getDataAccessService().getList(DmaapAccess.class, null);
		return accesses.size();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DmaapAccess> getDmaapAccessList(String userId) {
		List<Criterion> restrictionsList = new ArrayList<Criterion>();
		Criterion criterion1 = Restrictions.eq("userId", userId);
		restrictionsList.add(criterion1);
		List<DmaapAccess> accesses = (List<DmaapAccess>) getDataAccessService().getList(DmaapAccess.class, null,
				restrictionsList, null);
		return accesses;
	}

	@Override
	public DmaapAccess getDmaapAccess(Long dmaapId) {
		return (DmaapAccess) getDataAccessService().getDomainObject(DmaapAccess.class, dmaapId, null);
	}

	@Override
	public void saveDmaapAccess(DmaapAccess dmaap) {
		getDataAccessService().saveDomainObject(dmaap, null);
	}

	@Override
	public void deleteDmaapAccess(Long dmaapId) {
		DmaapAccess dmaapAccess = getDmaapAccess(dmaapId);
		if (dmaapAccess != null)
			getDataAccessService().deleteDomainObject(dmaapAccess, null);
	}

}
