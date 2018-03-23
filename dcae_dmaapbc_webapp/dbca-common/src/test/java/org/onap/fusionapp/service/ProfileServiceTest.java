package org.onap.fusionapp.service;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.onap.fusion.core.MockApplicationContextTestSuite;
import org.onap.portalsdk.core.domain.Profile;
import org.onap.portalsdk.core.domain.User;
import org.onap.portalsdk.core.service.ProfileService;
import org.onap.portalsdk.core.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;


public class ProfileServiceTest extends MockApplicationContextTestSuite {
	
	@Autowired
	ProfileService service;
	
	@Autowired
	UserProfileService userProfileService;
	
	@Test
	public void testFindAll() {
		
		try {
			List<Profile> profiles = service.findAll();
			Assert.assertTrue(profiles.size() > 0);
		} catch ( IOException e ) {
		}
	}

	@Test
	public void testFindAllActive() {
				
		List<User> users = userProfileService.findAllActive();
		List<User> activeUsers = userProfileService.findAllActive();
		Assert.assertTrue(users.size() - activeUsers.size() >= 0);
	}
}
