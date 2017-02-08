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
app.controller('mrClientListCtrl', function($scope, $log, $modal, modalService, MRClientService){

	// populates the table of Message Router clients
	'use strict';

	// this object holds all app data and functions
	$scope.dbcapp = {};
	// models for controls on screen
	$scope.dbcapp.tableData=[];
	$scope.dbcapp.currentPageNum=1;
	$scope.dbcapp.totalPages=1;
	$scope.dbcapp.viewPerPage = 100;
	$scope.dbcapp.viewPerPageOptions = [
	   { index : 0, value :  100 }, 
	   { index : 1, value :  500 }, 
	   { index : 2,	value : 1000 }, 
	   { index : 3, value : 2500 }
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
     * Loads the table of message router clients.
     */
    $scope.dbcapp.loadTable = function() {
		$scope.dbcapp.isDataLoading = true;
    	MRClientService.getClientsByPage($scope.dbcapp.currentPageNum,$scope.dbcapp.viewPerPage)
    		.then(function(jsonObj){
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
    		$log.error("mrClientListCtrl.loadTable failed: " + error);
    		$scope.dbcapp.isRequestFailed = true;
    		$scope.dbcapp.errMsg = error;
    		$scope.dbcapp.tableData = [];
    		$scope.dbcapp.isDataLoading = false;
    	});    	
    };
 
	/**
	 * Shows a modal pop-up to edit a client. 
	 * Passes data in via an object named "message". 
	 * Always updates the table, even on failure, to discard 
	 * user-entered changes that were not persisted.
	 */
	$scope.dbcapp.editClientModalPopup = function(client) {
		$scope.dbcapp.editClient = client;
		var modalInstance = $modal.open({
			templateUrl : 'edit_client_popup.html',
			controller : 'clientPopupCtrl',
			resolve : {
				message : function() {
					var dataForPopup = {
						client     : $scope.dbcapp.editClient,
						clientList : $scope.dbcapp.tableData,
						dcaeList   : $scope.dbcapp.dcaeLocations
					};
					return dataForPopup;
				}
			}
		});
		modalInstance.result.then(function(response) {
			if (response == null) {
				// $log.debug('editClientModalPopup: user closed dialog');
			}
			else {
				// $log.debug('editClientModalPopup: response: ' + JSON.stringify(response));
				if (response.error != null)
					modalService.showFailure('Edit Failed', 
						'Failed to edit client:\n' + response.error);
				// refresh in all cases
				$scope.dbcapp.loadTable();
			}
		});
	};

	/**
	 * Shows a modal pop-up to confirm deletion of a client. 
	 * On successful completion, updates the table.
	 */
	$scope.dbcapp.deleteClientModalPopup = function(client) {
		modalService.popupConfirmWin("Confirm", 
				"Delete the client:\n" + client.mrClientId + "\nContinue?", 
			function() {
				// $log.debug('deleteClientModalPopup: ' + topic.fqtn);
				MRClientService.deleteClient(client.mrClientId)
				.then(
					function(response) {
						// $log.debug('deleteClientModalPopup: response: ' + JSON.stringify(response));
						if (response.error != null) {
							modalService.showFailure('Delete Failed', 
										'Failed to delete client ' + client.mrClientId
										+ '\n' + response.error);
						}
						else {
							// success, get the updated list.
							$scope.dbcapp.loadTable()
						}
					},
					function(error) {
						modalService.showFailure('Delete Failed', 
									'Request failed to delete client ' + client.mrClientId + '\n' 
										+ JSON.stringify(error));
					}
				);
		})
	};

	// Populate the table on load.
    $scope.dbcapp.loadTable();

});
