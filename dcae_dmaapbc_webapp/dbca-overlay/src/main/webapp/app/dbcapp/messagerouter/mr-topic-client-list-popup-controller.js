appDS2.controller('topicClientListPopupCtrl', function($scope, $log, $modalInstance, modalService, message) {

	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	$scope.dbcapp.label = 'Clients of Topic ' + message.topic.topicName;
	
	// Source of data table
	$scope.dbcapp.showTopic = message.topic;

	// $log.debug('topicClientListPopupCtrl: showTopic.clients is ' + JSON.stringify($scope.dbcapp.showTopic.clients));

	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
