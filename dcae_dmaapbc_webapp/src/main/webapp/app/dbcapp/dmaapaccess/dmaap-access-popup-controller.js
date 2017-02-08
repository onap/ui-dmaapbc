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
app.controller('dmaapAccessPopupCtrl', function($scope, $log, $modalInstance, modalService, message, DmaapAccessService) {
	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	if (message.dmaapAccess == null)
		$scope.dbcapp.label = 'Add Access Profile';
	else
		$scope.dbcapp.label = 'Edit Access Profile';
	$scope.dbcapp.editDmaapAccess = message.dmaapAccess;

	/**
	 * Validates content of user-editable fields.
	 * Returns null if all is well, 
	 * a descriptive error message otherwise.
	 */
	$scope.dbcapp.validateProfile = function(dmaapAccess) {
		if (dmaapAccess == null)
			return "No data found.\nPlease enter some values.";
		if (dmaapAccess.name == null || dmaapAccess.name.trim() == '')
			return "Name is required.\nPlease enter a value.";
		// User cannot edit URL
		//if (dmaapAccess.dmaapUrl == null || dmaapAccess.dmaapUrl.trim() == '')
		//	return "URL is required.\nPlease enter a value.";
		//if (dmaapAccess.dmaapUrl.toLowerCase().indexOf('http') != 0)
		//	return "Unexpected URL prefix.\nPlease enter a URL starting with 'http'.";
		for (var x in message.dmaapAccessList) {
			// $log.debug('saveDmaapAccess: checking item >' + message.dmaapAccessList[x].name + '<');
			// Ignore the name in the one being edited.
			if (message.dmaapAccessList[x].id == dmaapAccess.id)
				continue;
			if (message.dmaapAccessList[x].name == dmaapAccess.name)
				return "Name " + dmaapAccess.name + " exists.\nPlease enter a different name.";
		}
		return null;
	}
	
	/**
	 * Tests the URL for validity.  Shows a modal dialog to display test result.
	 * Returns nothing.
	 */
	$scope.dbcapp.testDmaapAccess = function(dmaapAccess) {
		if (dmaapAccess == null || dmaapAccess.dmaapUrl == null || dmaapAccess.dmaapUrl.trim() == '') {
			modalService.showFailure("Missing Input", "No URL found.\nPlease enter a URL.");
			return;
		}
		// result should have a data aggregate that's a serialized DMaaP object 
		DmaapAccessService.testDmaapAccess(dmaapAccess)
			.then(function(response) {
				if (response.error != null)
					modalService.showFailure("Invalid Content", response.error);
				else
					modalService.showSuccess("Valid URL", "DMaaP name is " + response.data.dmaapName)
			},
			function (error) {
				modalService.showFailure("Invalid Content", error);				
			}
		);
	}

	/**
	 * Validates the content; on success, calls service to save it.
	 */
	$scope.dbcapp.saveDmaapAccess = function(dmaapAccess) {
		var validateMsg = $scope.dbcapp.validateProfile(dmaapAccess);
		if (validateMsg != null) {
			modalService.showFailure("Invalid Content", validateMsg);
			return;			
		}

		// Set the selected flag if this is the only access profile.
		if (dmaapAccess.id == null && message.dmaapAccessList.length == 0)
			dmaapAccess.selected = true;
		
		if (dmaapAccess.id == null) {
			// No id, so create a new one
			DmaapAccessService.addDmaapAccess(dmaapAccess)
				.then(function(dmaapAccessList) {

					$modalInstance.close(dmaapAccessList);
				},
				function (error) {
					$log.error('dmaapAccessPopupCtrl: error while adding: ' + error);
				}
			);
		}
		else {
			// Has id, so update an existing one
			DmaapAccessService.updateDmaapAccess(dmaapAccess)
				.then(function(dmaapAccessList) {
					$modalInstance.close(dmaapAccessList);
				},
				function (error) {
					$log.error('dmaapAccessPopupCtrl: error while updating: ' + error);
				}
			);
		}

	};

	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
