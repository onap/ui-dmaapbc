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
app.controller('pubPopupCtrl', function($scope, $log, $modalInstance, modalService, message, DRPubService) {
	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	if (message.pub == null || message.pub.subId == null)
		$scope.dbcapp.label = 'Add Publisher';
	else
		$scope.dbcapp.label = 'Edit Publisher';
	$scope.dbcapp.editPub = message.pub;
	$scope.dbcapp.dcaeList = message.dcaeList;

	/**
	 * Validates content of user-editable fields.
	 * Returns null if all is well, 
	 * a descriptive error message otherwise.
	 */
	$scope.dbcapp.validatePub = function(pub) {
		if (pub == null)
			return "No data found.\nPlease enter some values.";
		if (pub.dcaeLocationName == null)
			return "DCAE Location is required.\nPlease select a value.";
		return null;
	}
	
	$scope.dbcapp.savePub = function(pub) {
		var validateMsg = $scope.dbcapp.validatePub(pub);
		if (validateMsg != null) {
			modalService.showFailure("Invalid Content", validateMsg);
			return;			
		}
		
		if (pub.pubId == null) {
			// No id, so create a new one
			DRPubService.addPub(pub)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('pubPopupCtrl: error while adding: ' + error);
				}
			);
		}
		else {
			// Has id, so update an existing one
			DRPubService.updatePub(pub)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('pubPopupCtrl: error while updating: ' + error);
				}
			);
		}

	};

	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
