appDS2.controller('mrTopicListCtrl', function($scope, $log, $modal, modalService, MRTopicService){

	// populates the table of Message Router topics
	'use strict';

	// this object holds all app data and functions
	$scope.dbcapp = {};
	// models for controls on screen
	$scope.dbcapp.tableData=[];
	$scope.dbcapp.currentPageNum=1;
	$scope.dbcapp.totalPages=1;
	$scope.dbcapp.viewPerPage = 100;
	$scope.dbcapp.viewPerPageOptions = [
	   { index : 0, value :   50 }, 
	   { index : 1, value :  100 }, 
	   { index : 2, value :  500 }, 
	   { index : 3,	value : 1000 }, 
	   { index : 4, value : 2500 }
	];
	// other
	$scope.dbcapp.errMsg=null;
	$scope.dbcapp.isDataLoading=true;
	$scope.dbcapp.isRequestFailed=false;
    
    /**
     * Answers an array of the specified size - makes Angular iteration easy.
     */
    $scope.dbcapp.buildArraySizeN = function(num) {
    	// $log.debug("buildArraySizeN: invoked with " + num);
    	return new Array(num);   
    }

    /**
     * Loads the table of message router topics.
     */
    $scope.dbcapp.loadTable = function() {
		$scope.dbcapp.isDataLoading = true;
    	MRTopicService.getTopicsByPage($scope.dbcapp.currentPageNum, $scope.dbcapp.viewPerPage)
    		.then(function(jsonObj){
    		// must match keys in java controller's method
    		if (jsonObj.error) {
    			$scope.dbcapp.isRequestFailed = true;
    			$scope.dbcapp.errMsg = jsonObj.error;
    			$scope.dbcapp.tableData = [];
    		}
    		else {
    			$scope.dbcapp.isRequestFailed = false;
    			$scope.dbcapp.errMsg = null;
				$scope.dbcapp.profileName = jsonObj.profileName;
    			$scope.dbcapp.dmaapName = jsonObj.dmaapName;
    			$scope.dbcapp.dcaeLocations = jsonObj.dcaeLocations;
    			$scope.dbcapp.totalPages = jsonObj.totalPages;
    			$scope.dbcapp.tableData = jsonObj.data;
    		}
    		$scope.dbcapp.isDataLoading=false;
    	},function(error){
    		$log.error("mrTopicListCtrl.loadTable failed: " + error);
    		$scope.dbcapp.isRequestFailed = true;
    		$scope.dbcapp.errMsg = error;
    		$scope.dbcapp.tableData = [];
    		$scope.dbcapp.isDataLoading = false;
    	});    	
    };
 
    /**
	 * Shows a modal pop-up to add a topic. Passes data in via an object named
	 * "message". On successful completion, updates the table.
	 */
	$scope.dbcapp.addTopicModalPopup = function() {
		$scope.dbcapp.editTopic = null;
		var modalInstance = $modal.open({
			templateUrl : 'edit_topic_popup.html',
			controller : 'topicPopupCtrl',
			windowClass: 'modal-docked',
			sizeClass: 'modal-small',
			resolve : {
				message : function() {
					var dataForPopup = {
						topic : $scope.dbcapp.editTopic,
						topicList : $scope.dbcapp.tableData
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			if (response == null) {
				// $log.debug('addFeedModalPopup: user closed dialog');
			}
			else {
				if (response.error != null)
					alert('Failed to add topic:\n' + response.error);
				else
					// success, get the updated list.
					$scope.dbcapp.loadTable();
			}
		});
	};

	/**
	 * Shows a modal pop-up with topic details.
	 * Currently topics cannot be edited.
	 */
	$scope.dbcapp.showTopicModalPopup = function(topic) {
		$scope.dbcapp.editTopic = topic;
		var modalInstance = $modal.open({
			templateUrl : 'show_topic_popup.html',
			controller : 'topicPopupCtrl',
			windowClass: 'modal-docked',
			sizeClass: 'modal-small',
			resolve : {
				message : function() {
					var dataForPopup = {
						topic : $scope.dbcapp.editTopic,
						topicList : $scope.dbcapp.tableData
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			// Do nothing
		});
	};
	
	/**
	 * Shows a modal pop-up to edit a topic. 
	 * Passes data in via an object named "message". 
	 * Always updates the table, even on failure, to discard 
	 * user-entered changes that were not persisted.
	 * 
	 * TOPICS CANNOT BE EDITED YET.
	 * 
	$scope.dbcapp.editTopicModalPopup = function(topic) {
		$scope.dbcapp.editTopic = topic;
		var modalInstance = $modal.open({
			templateUrl : 'edit_topic_popup.html',
			controller : 'topicPopupCtrl',
			resolve : {
				message : function() {
					var dataForPopup = {
						topic : $scope.dbcapp.editTopic,
						topicList : $scope.dbcapp.tableData
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			if (response == null) {
				// $log.debug('editTopicModalPopup: user closed dialog');
			}
			else {
				// $log.debug('editTopicModalPopup: response: ' + JSON.stringify(response));
				if (response.error != null)
					alert('Failed to edit topic ' + topic.fqtn
						+ '\n' + response.error);
				// refresh in all cases
				$scope.dbcapp.loadTable();
			}
		});
	};
	 */

	/**
	 * Shows a modal pop-up to confirm deletion of a topic. On successful
	 * completion, updates the table.
	 */
	$scope.dbcapp.deleteTopicModalPopup = function(topic) {
		modalService.popupConfirmWin("Confirm", 
				"Delete topic " + topic.fqtn, 
			function() {
				// $log.debug('deleteTopicModalPopup: ' + topic.fqtn);
				MRTopicService.deleteTopic(topic.fqtn)
				.then(
					function(response) {
						// $log.debug('deleteTopicModalPopup: response: ' + JSON.stringify(response));
						if (response.error != null) {
							$log.error('deleteTopicModalPopup: failed to delete: ' + response.error);
							alert('Failed to delete topic ' + topic.fqtn + '\n' + response.error);
						}
						else {
							// success, get the updated list.
							$scope.dbcapp.loadTable()
						}
					},
					function(error) {
						alert('Request failed to delete topic ' + topic.fqtn + '\n' 
										+ JSON.stringify(error));
					}
				);
		})
	};
	
	/**
	 * Shows a modal pop-up with all clients of a topic.
	 * Passes data in via an object named "message". 
	 */
	$scope.dbcapp.showTopicClientsModalPopup = function(topic) {
		var modalInstance = $modal.open({
			templateUrl : 'topic_client_list_popup.html',
			controller : 'topicClientListPopupCtrl',
			windowClass: 'modal-docked',
			sizeClass: 'modal-jumbo',
			resolve : {
				message : function() {
					var dataForPopup = {
						topic : topic
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
	 * Shows a modal pop-up to add a client to a topic 
	 * Passes data in via an object named "message". 
	 * On successful completion, updates the table.
	 */
	$scope.dbcapp.addTopicClientModalPopup = function(topic) {
		$scope.dbcapp.editClient = { fqtn : topic.fqtn }
		var modalInstance = $modal.open({
			templateUrl : 'edit_client_popup.html',
			controller : 'clientPopupCtrl',
			windowClass: 'modal-docked',
			sizeClass: 'modal-small',
			resolve : {
				message : function() {
					var dataForPopup = {
						client     : $scope.dbcapp.editClient,
						clientList : [], // empty list
						dcaeList   : $scope.dbcapp.dcaeLocations
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			if (response == null) {
				// $log.debug('addTopicClientModalPopup: user closed dialog');
			}
			else {
				if (response.error != null)
					alert('Failed to add client to topic:\n' + response.error);
				else
					// success, get the updated list.
					$scope.dbcapp.loadTable();
			}
		});
	};
	
	// Populate the table on load.  Note that the b2b selector code
	// sets the page-number value, and the change event calls load table.
	// Do not call this here to avoid double load: 
	// $scope.dbcapp.loadTable();
    	
});
