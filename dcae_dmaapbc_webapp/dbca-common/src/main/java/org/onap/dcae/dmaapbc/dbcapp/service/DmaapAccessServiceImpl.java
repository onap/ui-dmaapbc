package org.onap.dcae.dmaapbc.dbcapp.service;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.onap.dcae.dmaapbc.dbcapp.domain.DmaapAccess;
import org.onap.dcae.dmaapbc.dbcapp.domain.ManifestTransportModel;
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
	
	/*
	 * (non-Javadoc)
	 * @see org.onap.dmaapbc.dbcapp.service.DmaapAccessService#getManifest()
	 */
	@Override
	public ManifestTransportModel getManifest() {
		return null;
	}
	
	/*
	 * (non-Javadoc)
	 * @see org.onap.dmaapbc.dbcapp.service.DmaapAccessService#getDmaapAccessCount()
	 */
	@SuppressWarnings("unchecked")
	@Override
	public int getDmaapAccessCount() {
		List<DmaapAccess> accesses = (List<DmaapAccess>) getDataAccessService().getList(DmaapAccess.class, null);
		return accesses.size();
	}

	/*
	 * (non-Javadoc)
	 * @see org.onap.dmaapbc.dbcapp.service.DmaapAccessService#getDmaapAccessList(java.lang.String)
	 */
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

	/*
	 * (non-Javadoc)
	 * @see org.onap.dmaapbc.dbcapp.service.DmaapAccessService#getDmaapAccess(java.lang.Long)
	 */
	@Override
	public DmaapAccess getDmaapAccess(Long dmaapId) {
		return (DmaapAccess) getDataAccessService().getDomainObject(DmaapAccess.class, dmaapId, null);
	}

	/*
	 * (non-Javadoc)
	 * @see org.onap.dmaapbc.dbcapp.service.DmaapAccessService#saveDmaapAccess(org.onap.dmaapbc.dbcapp.domain.DmaapAccess)
	 */
	@Override
	public void saveDmaapAccess(DmaapAccess dmaap) {
		getDataAccessService().saveDomainObject(dmaap, null);
	}

	/*
	 * (non-Javadoc)
	 * @see org.onap.dmaapbc.dbcapp.service.DmaapAccessService#deleteDmaapAccess(java.lang.Long)
	 */
	@Override
	public void deleteDmaapAccess(Long dmaapId) {
		DmaapAccess dmaapAccess = getDmaapAccess(dmaapId);
		if (dmaapAccess != null)
			getDataAccessService().deleteDomainObject(dmaapAccess, null);
	}

}
