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
app.controller('clientPopupCtrl', function($scope, $log, $modalInstance, modalService, message, MRClientService) {

	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	if (message.client == null || message.client.mrClientId == null)
		$scope.dbcapp.label = 'Add Client';
	else
		$scope.dbcapp.label = 'Edit Client';

	// client object brings fqtn
	$scope.dbcapp.editClient = message.client;
	$scope.dbcapp.dcaeList = message.dcaeList;
	
	// Models for checkboxes
	var PUB = 0;
	var SUB = 1;
	var VIEW = 2;
	$scope.dbcapp.clientactionbox = [];
	$scope.dbcapp.clientactionbox[PUB] = false;
	$scope.dbcapp.clientactionbox[SUB] = false;
	$scope.dbcapp.clientactionbox[VIEW] = false;

	// Morph the list of action strings into checks in boxes
	for (var aidx in $scope.dbcapp.editClient.action) {
		var action = $scope.dbcapp.editClient.action[aidx];
		// $log.debug('clientPopupCtrl: action idx ' + aidx + ', action ' + action);
		if ("pub" == action)
			$scope.dbcapp.clientactionbox[PUB] = true;
		else if ("sub" == action)
			$scope.dbcapp.clientactionbox[SUB] = true;
		else if ("view" == action)
			$scope.dbcapp.clientactionbox[VIEW] = true;
	}
	
	/**
	 * Validates content of user-editable fields.
	 * Returns null if all is well, 
	 * a descriptive error message otherwise.
	 */
	$scope.dbcapp.validateClient = function(client) {
		if (client == null)
			return "No data found.\nPlease enter some values.";
		if (client.dcaeLocationName == null)
			return "DCAE Location is required.\nPlease select a value.";
		if (client.clientRole == null || client.clientRole.trim() == '')
			return "Client role is required.\nPlease enter a value.";
		// I don't like hardcoded strings, but what to do?
		// IE does not support startsWith method
		// $log.debug('validateClient: ' + client.clientRole.indexOf('com.openecomp.'));
		if (client.clientRole.toLowerCase().indexOf('com.openecomp.') != 0)
			return "Unexpected client role prefix.\nPlease enter a value starting with 'com.openecomp.'";
		if (client.action.length == 0)
			return "An action is required.\nPlease select one or more actions.";
		return null;
	}
	
	$scope.dbcapp.saveClient = function(client) {
		// Store list of action strings (if any)
		var action_list = [];
		for (var aidx in $scope.dbcapp.clientactionbox) {
			if (aidx == PUB && $scope.dbcapp.clientactionbox[aidx]) 
				action_list.push('pub');
			else if (aidx == SUB && $scope.dbcapp.clientactionbox[aidx]) 
				action_list.push('sub');
			else if (aidx == VIEW && $scope.dbcapp.clientactionbox[aidx]) 
				action_list.push('view');
		}
		$scope.dbcapp.editClient.action = action_list;

		var validateMsg = $scope.dbcapp.validateClient(client);
		if (validateMsg != null) {
			modalService.showFailure("Invalid Content", validateMsg);
			return;			
		}

		if (client.mrClientId == null) {
			// No id, so create a new one
			MRClientService.addClient(client)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('clientPopupCtrl.saveClient: error while adding: ' + error);
				}
			);
		}
		else {
			// Has ID, so update an existing one
			MRClientService.updateClient(client)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('clientPopupCtrl.saveClient: error while updating: ' + error);
				}
			);
		}

	}; // saveClient

	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
