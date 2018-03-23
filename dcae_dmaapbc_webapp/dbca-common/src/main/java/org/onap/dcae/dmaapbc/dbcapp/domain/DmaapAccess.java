package org.onap.dcae.dmaapbc.dbcapp.domain;

import org.onap.portalsdk.core.domain.support.DomainVo;
import org.onap.portalsdk.core.onboarding.util.CipherUtil;

/**
 * Hold an access profile for a DMaaP REST endpoint. Represents one row in the
 * DBCA_DMAAP table.
 */
public class DmaapAccess extends DomainVo {

	private static final long serialVersionUID = 6443219375733216340L;

	// parent class defines these fields:
	// ID, created, modified, created_id, modified_id

	/** Login ID for user who owns this row */
	private String userId;
	/** Nickname for this row */
	private String name;
	/** REST API endpoint */
	private String dmaapUrl;
	/** Credentials */
	private String mechId;
	/** Credentials */
	private String password;
	/** User's preferred access profile */
	private boolean selected;

	/**
	 * Standard POJO no-arg constructor
	 */
	public DmaapAccess() {
	}

	/**
	 * Copy constructor
	 * 
	 * @param copy
	 *            Instance to copy
	 */
	public DmaapAccess(final DmaapAccess copy) {
		// Unfortunately DomainVo doesn't provide a copy constructor;
		// only the ID field is needed.
		this.id = copy.id;
		// Our fields
		this.userId = copy.userId;
		this.name = copy.name;
		this.dmaapUrl = copy.dmaapUrl;
		this.mechId = copy.mechId;
		this.password = copy.password;
		this.selected = copy.selected;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDmaapUrl() {
		return dmaapUrl;
	}

	public void setDmaapUrl(String dmaapUrl) {
		this.dmaapUrl = dmaapUrl;
	}

	public String getMechId() {
		return mechId;
	}

	public void setMechId(String mechId) {
		this.mechId = mechId;
	}

	/**
	 * Gets the encrypted password. Applications should use
	 * {@link #decryptPassword()}!
	 * 
	 * @return The encrypted password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * Sets the encrypted password. Applications should use
	 * {@link #encryptPassword(String)}!
	 * 
	 * @param password
	 *            The encrypted password
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	public boolean getSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

	/**
	 * A getter that decrypts the value read from the database and returns the
	 * clear text. Has no side effects.
	 * 
	 * @return Clear-text password.
	 * @throws Exception
	 *             If the password cannot be decrypted
	 */
	public String decryptPassword() throws Exception {
		if (password == null)
			return null;
		return CipherUtil.decrypt(password);
	}

	/**
	 * A setter that encrypts the clear-text in preparation for storing in the
	 * database.
	 * 
	 * @param clearText
	 *            The clear-text password to be encrypted
	 * @throws Exception
	 *             If the password cannot be encrypted
	 */
	public void encryptPassword(String clearText) throws Exception {
		if (clearText == null) {
			password = null;
			return;
		}
		password = CipherUtil.encrypt(clearText);
	}

	@Override
	public String toString() {
		return "DmaapAccess[id=" + id + ", url=" + dmaapUrl + ", ...]";
	}

}
