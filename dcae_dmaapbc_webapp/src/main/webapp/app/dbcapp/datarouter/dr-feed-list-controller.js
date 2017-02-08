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
app.controller('drFeedListCtrl', function($scope, $log, $modal, modalService, DRFeedService) {
	
	// populates the table of Data Router feeds
	'use strict';

	// this object holds all app data and functions
	$scope.dbcapp = {};
	// models for controls on screen
	$scope.dbcapp.tableData = [];
	$scope.dbcapp.currentPageNum = 1;
	$scope.dbcapp.totalPages = 1;
	$scope.dbcapp.viewPerPage = 100;
	$scope.dbcapp.viewPerPageOptions = [
	   { index : 0, value :  100 }, 
	   { index : 1, value :  500 }, 
	   { index : 2,	value : 1000 }, 
	   { index : 3, value : 2500 }
	];
	// other
	$scope.dbcapp.errMsg = null;
	$scope.dbcapp.isDataLoading = true;
	$scope.dbcapp.isRequestFailed = false;

	/**
	 * Answers an array of the specified size - makes Angular iteration easy.
	 */
	$scope.dbcapp.buildArraySizeN = function(num) {
		// $log.debug("buildArraySizeN: invoked with " + num);
		return new Array(num);
	}

	/**
	 * Loads the table of data router feeds.
	 * 
	 * Interprets the remote controller's response and copies to scope
	 * variables. The response is either list to be assigned to tableData, or an
	 * error to be shown.
	 */
	$scope.dbcapp.loadTable = function() {
		$scope.dbcapp.isDataLoading = true;
		DRFeedService.getFeedsByPage($scope.dbcapp.currentPageNum, $scope.dbcapp.viewPerPage)
			.then(function(jsonObj) {
			if (jsonObj.error) {
				$scope.dbcapp.isRequestFailed = true;
				$scope.dbcapp.errMsg = jsonObj.error;
				$scope.dbcapp.tableData = [];
			} else {
				$scope.dbcapp.isRequestFailed = false;
				$scope.dbcapp.errMsg = null;
				$scope.dbcapp.profileName = jsonObj.profileName;
    			$scope.dbcapp.dmaapName=jsonObj.dmaapName;
    			$scope.dbcapp.dcaeLocations=jsonObj.dcaeLocations;
				$scope.dbcapp.totalPages = jsonObj.totalPages;
				$scope.dbcapp.tableData = jsonObj.data;
			}			
			$scope.dbcapp.isDataLoading = false;
		}, function(error) {
			$log.error("drFeedListCtrl.loadTable failed: " + error);
			$scope.dbcapp.isRequestFailed = true;
			$scope.dbcapp.errMsg = error;
			$scope.dbcapp.tableData = [];
			$scope.dbcapp.isDataLoading = false;
		});
	};

	/**
	 * Shows a modal pop-up to add a feed. 
	 * Passes data in via an object named "message". 
	 * On success, updates the table.
	 */
	$scope.dbcapp.addFeedModalPopup = function() {
		$scope.dbcapp.editFeed = null;
		var modalInstance = $modal.open({
			templateUrl : 'add_feed_popup.html',
			controller : 'feedPopupCtrl',
			resolve : {
				message : function() {
					var dataForPopup = {
						feed : $scope.dbcapp.editFeed,
						feedList : $scope.dbcapp.tableData,
						dcaeList: $scope.dbcapp.dcaeLocations
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			// $log.debug('addFeedModalPopup: response: ' + JSON.stringify(response));
			if (response == null) {
				// $log.debug('addFeedModalPopup: user closed dialog');
			}
			else {
				if (response.error != null)
					modalService.showFailure('Add Failed', 
						'Failed to add feed:\n' + response.error);
				else
					// success, get the updated list.
					$scope.dbcapp.loadTable()
			}
		});
	};

	/**
	 * Shows a modal pop-up to edit a feed. 
	 * Passes data in via an object named "message". 
	 * Always updates the table, even on failure, to discard 
	 * user-entered changes that were not persisted.
	 */
	$scope.dbcapp.editFeedModalPopup = function(feed) {
		$scope.dbcapp.editFeed = feed;
		var modalInstance = $modal.open({
			templateUrl : 'edit_feed_popup.html',
			controller : 'feedPopupCtrl',
			resolve : {
				message : function() {
					var dataForPopup = {
						feed : $scope.dbcapp.editFeed,
						feedList : $scope.dbcapp.tableData
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			if (response == null) {
				// $log.debug('editFeedModalPopup: user closed dialog');
			}
			else {
				// $log.debug('editFeedModalPopup: response: ' + JSON.stringify(response));
				if (response.error != null)
					modalService.showFailure('Edit Failed', 
						'Failed to edit feed ' + feed.feedName
						+ '\n' + response.error);
				// refresh in all cases
				$scope.dbcapp.loadTable();
			}
		});
	};

	/**
	 * Shows a modal pop-up to confirm deletion of a feed. 
	 * On successful completion, updates the table.
	 */
	$scope.dbcapp.deleteFeedModalPopup = function(feed) {
		modalService.popupConfirmWin("Confirm", "Delete the feed: "
				+ feed.feedName + "\nContinue?", function() {
			DRFeedService.deleteFeed(feed.feedId).then(
					function(response) {
						// $log.debug('deleteFeedModalPopup: response: ' + JSON.stringify(response));
						if (response.error != null) {
							$log.error('deleteFeedModalPopup: failed to delete: ' + response.error);
							modalService.showFailure('Delete Failed', 
										'Failed to delete feed ' + feed.feedName
										+ '\n' + response.error);
						}
						else {
							// success, get the updated list.
							$scope.dbcapp.loadTable()
						}
					},
					function(error) {
						$log.error('deleteFeed failed');
						modalService.showFailure('Delete Failed', 'feedListCtrl failed to delete object: ' 
								+ JSON.stringify(error));
					});
		})
	};

	/**
	 * Shows a modal pop-up with all publishers and subscribers of a feed.
	 * Passes data in via an object named "message". 
	 */
	$scope.dbcapp.showFeedPubsSubsModalPopup = function(feed) {
		var modalInstance = $modal.open({
			templateUrl : 'feed_pub_sub_list_popup.html',
			controller : 'feedPubSubListPopupCtrl',
			resolve : {
				message : function() {
					var dataForPopup = {
						feed : feed
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			// No response expected.
		});
	};

	/**
	 * Shows a modal pop-up to add a feed publisher. 
	 * Passes data in via an object named "message". 
	 * On successful completion, updates the table.
	 */
	$scope.dbcapp.addFeedPublisherModalPopup = function(feed) {
		$scope.dbcapp.editPub = { feedId : feed.feedId }
		var modalInstance = $modal.open({
			templateUrl : 'edit_pub_popup.html',
			controller : 'pubPopupCtrl',
			resolve : {
				message : function() {
					var dataForPopup = {
						pub : $scope.dbcapp.editPub,
						pubList : [],
						dcaeList: $scope.dbcapp.dcaeLocations
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			if (response == null) {
				// $log.debug('addFeedPublisherModalPopup: user closed dialog');
			}
			else {
				if (response.error != null)
					modalService.showFailure('Add Publisher Failed', 
						'Failed to add publisher to feed:\n' + response.error);
				else
					// success, get the updated list.
					$scope.dbcapp.loadTable();
			}
		});
	};
	
	/**
	 * Shows a modal pop-up to add a feed subscriber. 
	 * Passes data in via an object named "message". 
	 * On successful completion, updates the table.
	 */
	$scope.dbcapp.addFeedSubscriberModalPopup = function(feed) {
		// Create a subscriber object with the feed ID
		$scope.dbcapp.editSub = { feedId : feed.feedId }
		var modalInstance = $modal.open({
			templateUrl : 'edit_sub_popup.html',
			controller : 'subPopupCtrl',
			resolve : {
				message : function() {
					var dataForPopup = {
						sub : $scope.dbcapp.editSub,
						subList : [],
						dcaeList: $scope.dbcapp.dcaeLocations
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			if (response == null) {
				// $log.debug('addFeedSubscriberModalPopup: user closed dialog');
			}
			else {
				if (response.error != null)
					modalService.showFailure('Add Subscriber Failed', 
						'Failed to add subscriber to feed:\n' + response.error);
				else
					// success, get the updated list.
					$scope.dbcapp.loadTable();
			}
		});
	};
	
	// Populate the table on load.
	$scope.dbcapp.loadTable();

});
