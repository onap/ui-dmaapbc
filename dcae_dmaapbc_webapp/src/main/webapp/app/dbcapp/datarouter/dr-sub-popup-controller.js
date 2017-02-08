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
app.controller('subPopupCtrl', function($scope, $log, $modalInstance, modalService, message, DRSubService) {
	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	if (message.sub == null || message.sub.subId == null)
		$scope.dbcapp.label = 'Add Subscriber';
	else
		$scope.dbcapp.label = 'Edit Subscriber';
	$scope.dbcapp.editSub = message.sub;
	$scope.dbcapp.dcaeList = message.dcaeList;

	/**
	 * Validates content of user-editable fields.
	 * Returns null if all is well, 
	 * a descriptive error message otherwise.
	 */
	$scope.dbcapp.validateSub = function(sub) {
		if (sub == null)
			return "No data found.\nPlease enter some values.";
		if (sub.dcaeLocationName == null)
			return "DCAE Location is required.\nPlease select a value.";
		if (sub.deliveryURL == null || sub.deliveryURL.trim() == '')
			return "Delivery URL is required.\nPlease enter a value.";
		if (sub.username == null || sub.username.trim() == '') 
			return "User Name is required.\nPlease enter a value.";
		if (sub.userpwd == null || sub.userpwd.trim() == '') 
			return "Password is required.\nPlease enter a value.";
		return null;
	}

	$scope.dbcapp.saveSub = function(sub) {
		var validateMsg = $scope.dbcapp.validateSub(sub);
		if (validateMsg != null) {
			modalService.showFailure("Invalid Content", validateMsg);
			return;			
		}
		
		if (sub.subId == null) {
			// No id, so create a new one
			DRSubService.addSub(sub)
				.then(function(response) {
					// $log.debug('subPopupCtrl.saveSub: ' + JSON.stringify(response));
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('subPopupCtrl: error while adding: ' + error);
				}
			);
		}
		else {
			// Has id, so update an existing one
			DRSubService.updateSub(sub)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('subPopupCtrl: error while updating: ' + error);
				}
			);
		}

	};

	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
