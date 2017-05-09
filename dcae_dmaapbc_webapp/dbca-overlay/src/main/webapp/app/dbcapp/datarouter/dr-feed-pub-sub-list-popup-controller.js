appDS2.controller('feedPubSubListPopupCtrl', function($scope, $log, $modalInstance, modalService, message) {

	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	$scope.dbcapp.label = 'Pub/Sub of Feed ' + message.feed.feedName;
	
	// Source of data table
	$scope.dbcapp.showFeed = message.feed;

	// $log.debug('feedPubSubListPopupCtrl: showFeed.pubs is ' + JSON.stringify($scope.dbcapp.showFeed.pubs));
	
	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
