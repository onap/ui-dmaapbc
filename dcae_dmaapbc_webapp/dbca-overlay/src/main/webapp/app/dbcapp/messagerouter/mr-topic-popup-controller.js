appDS2.controller('topicPopupCtrl', function($scope, $log, $modalInstance, modalService, message, MRTopicService) {
	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	if (message.topic == null)
		$scope.dbcapp.label = 'Add Topic';
	else
		$scope.dbcapp.label = 'Show Topic';
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
			alert('Invalid Content:\n' + validateMsg);
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
