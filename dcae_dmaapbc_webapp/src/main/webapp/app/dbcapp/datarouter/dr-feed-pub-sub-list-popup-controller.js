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
app.controller('feedPubSubListPopupCtrl', function($scope, $log, $modalInstance, modalService, message) {

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
