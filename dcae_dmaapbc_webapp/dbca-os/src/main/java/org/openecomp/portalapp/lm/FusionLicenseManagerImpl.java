/*-
 * ================================================================================
 * ECOMP Portal SDK
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

package org.openecomp.portalapp.lm;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import org.openecomp.portalsdk.core.lm.FusionLicenseManager;

/**
 * Empty implementation to satisfy an interface.
 */
public class FusionLicenseManagerImpl implements FusionLicenseManager {

	public FusionLicenseManagerImpl() {
	}

	/**
	 * An implementation of the KeyStoreParam interface that returns the
	 * information required to work with the keystore containing the private key
	 */
	public void initKeyStoreParam() {
	}

	public void initCipherParam() {
	}

	public void initLicenseParam() {
	}

	public void doInitWork() {
	}

	public int installLicense() {
		return OPENSOURCE_LICENSE;
	}

	public synchronized int verifyLicense(ServletContext context) {
		return OPENSOURCE_LICENSE;
	}

	public void generateLicense(Map<String, String> clientInfoMap, List<String> ipAddressList) throws Exception {
	}

	public static String nvls(String s) {
		return null;
	}

	public String nvl(String s) {
		return null;
	}

	public Date getExpiredDate() {
		return null;
	}

	public void setExpiredDate(Date expiredDate) {
	}

}
