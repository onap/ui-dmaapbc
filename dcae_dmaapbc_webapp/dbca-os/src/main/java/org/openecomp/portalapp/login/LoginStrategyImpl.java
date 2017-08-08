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

package org.openecomp.portalapp.login;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.openecomp.portalsdk.core.auth.LoginStrategy;
import org.openecomp.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.openecomp.portalsdk.core.onboarding.exception.PortalAPIException;
import org.openecomp.portalsdk.core.onboarding.util.CipherUtil;
import org.openecomp.portalsdk.core.onboarding.util.PortalApiConstants;
import org.openecomp.portalsdk.core.onboarding.util.PortalApiProperties;
import org.springframework.web.servlet.ModelAndView;

public class LoginStrategyImpl extends LoginStrategy {

	private static EELFLoggerDelegate logger = EELFLoggerDelegate.getLogger(LoginStrategyImpl.class);

	@Override
	public ModelAndView doLogin(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// 'login' for opensource is same as 'external' login.
		return doExternalLogin(request, response);
	}

	@Override
	public String getUserId(HttpServletRequest request) throws PortalAPIException {
		// Check ECOMP Portal cookie
		if (!isLoginCookieExist(request)) {
			logger.debug(EELFLoggerDelegate.debugLogger, "getUserId: no login cookie, returning null");
			return null;
		}

		String userid = null;
		try {
			userid = getUserIdFromCookie(request);
		} catch (Exception e) {
			logger.error(EELFLoggerDelegate.errorLogger, "getUserId failed", e);
		}
		return userid;
	}

	private static String getUserIdFromCookie(HttpServletRequest request) throws Exception {
		String userId = "";
		Cookie userIdCookie = getCookie(request, USER_ID);
		if (userIdCookie != null) {
			final String cookieValue = userIdCookie.getValue();
			final String decryptionKey = PortalApiProperties.getProperty(PortalApiConstants.Decryption_Key);
			if (decryptionKey == null)
				throw new Exception("Failed to find portal property " + PortalApiConstants.Decryption_Key);
			logger.debug(EELFLoggerDelegate.debugLogger, "getUserIdFromCookie: decode cookie value {} using {}",
					cookieValue, decryptionKey);
			userId = CipherUtil.decrypt(cookieValue, decryptionKey);
			logger.debug(EELFLoggerDelegate.debugLogger, "getUserIdFromCookie: decrypted as {}", userId);
		}
		return userId;
	}

	private static boolean isLoginCookieExist(HttpServletRequest request) {
		Cookie ep = getCookie(request, EP_SERVICE);
		return (ep != null);
	}

	private static Cookie getCookie(HttpServletRequest request, String cookieName) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null)
			for (Cookie cookie : cookies)
				if (cookie.getName().equals(cookieName))
					return cookie;
		return null;
	}

}
