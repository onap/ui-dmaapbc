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
app.controller('dmaapAccessListCtrl', function ($scope, $log, $modal, modalService, DmaapAccessService) {
	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
    // Model for radio-button selection group.
	// Uses database row ID as unique value.
    $scope.dbcapp.selectDmaapModel = { id: null };
	$("#dialog").hide();
	$scope.dbcapp.isDataLoading=true;

	/**
	 * Loads the table of DMaaP access profiles.
	 * 
	 * Interprets the remote controller's response and copies to scope
	 * variables. The response is either list to be assigned to tableData, 
	 * or an error to be shown.
	 */
	$scope.dbcapp.loadTable = function() {
		$scope.dbcapp.isDataLoading = true;
		DmaapAccessService.getDmaapAccessList()
			.then(function(jsonObj) {
			if (jsonObj.error) {
				$scope.dbcapp.isRequestFailed = true;
				$scope.dbcapp.errMsg = jsonObj.error;
				$scope.dbcapp.tableData = [];
			} else {
				$scope.dbcapp.isRequestFailed = false;
				$scope.dbcapp.errMsg = null;
				$scope.dbcapp.tableData = jsonObj.data;
				$scope.dbcapp.updateDmaapAccessSelection();
			}			
			$scope.dbcapp.isDataLoading = false;
		}, function(error) {
			// Called with a string, not JSON obj.
			$log.error("dmaapAccessListCtrl.getDmaapAccessList failed: " + error);
			$scope.dbcapp.isRequestFailed = true;
			$scope.dbcapp.errMsg = error;
			$scope.dbcapp.tableData = [];
			$scope.dbcapp.isDataLoading = false;
		});
	};
	
	/**
	 * Sets a value in the model for the radio-button selection group.
	 */
	$scope.dbcapp.updateDmaapAccessSelection = function() {
		for (var i in $scope.dbcapp.tableData) {
			var da = $scope.dbcapp.tableData[i];
			// Set radio button for the selected profile
			// $log.info('dmaapAccessListCtrl: examining ' + JSON.stringify(da));
			if (da.selected) {
				// $log.info('dmaapAccessListCtrl: selecting id ' + da.id);
				$scope.dbcapp.selectDmaapModel.id = da.id;
  			}
		}
	};
	
	/**
	 * Handles a click on radio button to select a profile.
	 */
    $scope.dbcapp.selectDmaapAccess = function(dmaapAccess) {
    	if (dmaapAccess == null || dmaapAccess.id == null)
    		$log.error('selectDmaapAccess invoked with null');
    	else
    		DmaapAccessService.setSelectedDmaapAccess(dmaapAccess.id);
    };
   
    /**
     * Shows a modal pop-up to add a DMaaP access profile.
     * Passes data in via an object named "message".
     * On successful completion, updates the profile list.
     * 
     * After implementing DE238329, this is never called.
     */
	$scope.dbcapp.addDmaapAccessModalPopup = function() {
		$scope.dbcapp.editDmaapAccess = null;
		var modalInstance = $modal.open({
		    templateUrl: 'edit_dmaap_access_popup.html',
		    controller: 'dmaapAccessPopupCtrl',
		    resolve: {
		    	message: function () {
		    		var dataForPopup = {
		    			dmaapAccess     : $scope.dbcapp.editDmaapAccess,
		    			dmaapAccessList : $scope.dbcapp.tableData
                    };
		    		return dataForPopup;
		        }					
		      }
		  }); 
		modalInstance.result.then(function(response) {
			if (response == null) {
				// $log.debug('addDmaapAccessModelPopup: user closed dialog');
			}
			else {
				if (response.error != null)
					modalService.showFailure('Add Profile Failed', 
						'Failed to add access profile:\n' + response.error);
				else
					// success, get the updated list.
					$scope.dbcapp.loadTable();
			}
        });
	};	
		
    /**
     * Shows a modal pop-up to edit a DMaaP access profile.
     * Passes data in via an object named "message".
     * On successful completion, updates the profile list.
     */
	$scope.dbcapp.editDmaapAccessModalPopup = function(dmaapAccess) {
		// edit a copy, not the model for the table row.
		$scope.dbcapp.editDmaapAccess = JSON.parse(JSON.stringify(dmaapAccess));
		var modalInstance = $modal.open({
		    templateUrl: 'edit_dmaap_access_popup.html',
		    controller: 'dmaapAccessPopupCtrl',
		    resolve: {
		    	message: function () {
		    		var dataForPopup = {
		    			dmaapAccess     : $scope.dbcapp.editDmaapAccess,
		    			dmaapAccessList : $scope.dbcapp.tableData 
                   	};
		    		return dataForPopup;
		        }					
		      }
		  }); 
		modalInstance.result.then(function(response) {
			if (response == null) {
				// $log.debug('addDmaapAccessModelPopup: user closed dialog');
			}
			else {
				if (response.error != null)
					modalService.showFailure('Edit Profile Failed', 
						'Failed to edit access profile:\n' + response.error);
				else
					// success, get the updated list.
					$scope.dbcapp.loadTable();
			}
        });
	};
	
    /**
     * Shows a modal pop-up to confirm deletion of a DMaaP access profile.
     * On successful completion, updates the profile list.
     * 
     * After implementing DE238329, this is never called.
     */
	$scope.dbcapp.deleteDmaapAccess = function(dmaapAccess) {
		modalService.popupConfirmWin("Confirm",	"Delete the DMaaP access profile: "
				+ dmaapAccess.name + "\nContinue?",	
			function() {
				// $log.debug('deleteDmaapAccess: deleting id ' + dmaapAccess.id);
				DmaapAccessService.deleteDmaapAccess(dmaapAccess.id).then(
					function(response) {
						if (response.error != null) {
							$log.error('deleteDmaapAccess: failed to delete: ' + response.error);
							modalService.showFailure('Delete Failed', 
									'Failed to delete access profile:\n' + response.error);
						}
						else {
							// success, get the updated list.
							$scope.dbcapp.loadTable()
						}
					},
			function(error) {
				 $log.error('deleteDmaapAccess failed: ' + error);
				 modalService.showFailure("Fail", "dmaapAccessListCtrl failed to delete object");
			 });
		})
	};

	// Populate the table on load.
	$scope.dbcapp.loadTable();
    
});
