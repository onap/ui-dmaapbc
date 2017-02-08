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
app.controller('feedPopupCtrl', function($scope, $log, $modalInstance, modalService, message, DRFeedService) {
	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	if (message.feed == null) {
		$scope.dbcapp.label = 'Add Feed';
		// Must add publisher with a feed.
		$scope.dbcapp.editFeed = 
				{
				pubs: [
				       { username: null }
				      ]
				};
	}
	else {
		$scope.dbcapp.label = 'Edit Feed';
		$scope.dbcapp.editFeed = message.feed;
	}
	$scope.dbcapp.dcaeList = message.dcaeList;

	// for populating selection boxes on add and edit popup templates
	$scope.dbcapp.asprClassificationList = [
	    "unclassified",
		"Non-Sensitive Customer Data",
		"AT&T Proprietary (Internal Use Only)",
		"AT&T Proprietary (Secure Restricted)",
		"AT&T Proprietary (Restricted)",
		"AT&T Proprietary (Sensitive Personal Information)",
		"Customer Sensitive Data", 
		"Customer Data Conduit",
	];

	/**
	 * Validates content of user-editable fields.
	 * Uses the list in message.feedList 
	 * Returns null if all is well, 
	 * a descriptive error message otherwise.
	 */
	$scope.dbcapp.validateFeed = function(feed) {
		if (feed == null)
			return "No data found.\nPlease enter some values.";
		if (feed.feedName == null || feed.feedName.trim() == '')
			return "Name is required.\nPlease enter a value.";
		if (feed.feedVersion == null || feed.feedVersion.trim() == '')
			return "Version is required.\nPlease enter a value.";
		if (feed.feedDescription == null || feed.feedDescription.trim() == '')
			return "Description is required.\nPlease enter a value.";
		if (feed.asprClassification == null || feed.asprClassification.trim() == '')
			return "ASPR Classification is required.\nPlease select a value.";
		for (var x in message.feedList) {
			// Ignore the one being edited.
			if (message.feedList[x].feedId == feed.feedId)
				continue;
			if (message.feedList[x].feedName == feed.feedName)
				return "Name " + feed.feedName + " exists.\n"
					+ "Please choose a different name.";
		}
		// Extra validation if adding a new feed - check first publisher 
		if (feed.feedId == null && feed.pubs != null && feed.pubs[0] != null) {
			$log.info('validateFeed: pubs[0] is ' + JSON.stringify(feed.pubs[0]));
			if (feed.pubs[0].dcaeLocationName == null)
				return "DCAE Location is required.\nPlease select a value.";
			// username, userpwd are optional
		}
		return null;
	}
	
	$scope.dbcapp.saveFeed = function(feed) {
		var validateMsg = $scope.dbcapp.validateFeed(feed);
		if (validateMsg != null) {
			modalService.showFailure("Invalid Content", validateMsg);
			return;			
		}
		
		if (feed.feedId == null) {
			// No id, so create a new one
			DRFeedService.addFeed(feed)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('feedPopupCtrl: error while adding: ' + error);
				}
			);
		}
		else {
			// Has id, so update an existing one
			DRFeedService.updateFeed(feed)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('feedPopupCtrl: error while updating: ' + error);
				}
			);
		}

	};

	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
