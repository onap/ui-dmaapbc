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
app.controller('topicPopupCtrl', function($scope, $log, $modalInstance, modalService, message, MRTopicService) {
	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	if (message.topic == null)
		$scope.dbcapp.label = 'Add Topic';
	else
		$scope.dbcapp.label = 'Edit Topic';
	$scope.dbcapp.editTopic = message.topic;

	/**
	 * Validates content of user-editable fields.
	 * Returns null if all is well, 
	 * a descriptive error message otherwise.
	 */
	$scope.dbcapp.validateTopic = function(topic) {
		if (topic == null)
			return "No data found.\nPlease enter some values.";
		if (topic.topicName == null || topic.topicName.trim() == '')
			return "Name is required.\nPlease enter a value.";
		if (topic.topicDescription == null || topic.topicDescription.trim() == '')
			return "Description is required.\nPlease enter a value.";
		return null;
	}

	$scope.dbcapp.saveTopic = function(topic) {
		var validateMsg = $scope.dbcapp.validateTopic(topic);
		if (validateMsg != null) {
			modalService.showFailure("Invalid Content", validateMsg);
			return;			
		}
		
		if (topic.fqtn == null) {
			// No fqtn, so create a new one
			MRTopicService.addTopic(topic)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('topicPopupCtrl.saveTopic: error while adding: ' + error);
				}
			);
		}
		else {
			// Has fqtn, so update an existing one
			MRTopicService.updateTopic(topic)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('topicPopupCtrl.saveTopic: error while updating: ' + error);
				}
			);
		}

	}; // saveTopic

	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
