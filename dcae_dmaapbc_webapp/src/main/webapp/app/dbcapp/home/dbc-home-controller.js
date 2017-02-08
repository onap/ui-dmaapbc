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
app.controller('dbcHomeCtrl', function($scope, $log, DmaapAccessService, ManifestService) {
	// Loads info to show on the welcome page.
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	$scope.dbcapp.selectedDmaapAccess=null;
	$scope.dbcapp.isDataLoading = true;
	$scope.dbcapp.isRequestFailed = false;
	$scope.dbcapp.errMsg = null;
	$scope.dbcapp.manifest=null;
	
    DmaapAccessService.getSelectedDmaapAccess()
   		.then(function(jsonObj) {
   		// must match keys in java controller's method
   		if (jsonObj.error) {
			$scope.dbcapp.isRequestFailed = true;
			$scope.dbcapp.errMsg = jsonObj.error;
   		}
   		else {
			$scope.dbcapp.isRequestFailed = false;
			$scope.dbcapp.errMsg = null;
			$scope.dbcapp.selectedDmaapAccess=jsonObj.data;

   			// Next get the manifest
   			ManifestService.getManifest()
   			.then(function(jsonObj) {
   				// $log.debug("dbcHomeCtrl: getManifest returned " + JSON.stringify(jsonObj));
   				if (jsonObj.error) {
   					$scope.dbcapp.isRequestFailed = true;
   					$scope.dbcapp.errMsg = jsonObj.error;
   				}
   				else {
   					$scope.dbcapp.manifest=jsonObj.manifest;
   				}
   			},function(error){
   				$log.error("dbcHomeCtrl getManifest failed: " + error);
   			});    	

   		}
   		$scope.dbcapp.isDataLoading=false;
   	},function(error){
   		$log.error("dbcHomeCtrl: getSelectdDmaapAccess failed: " + error);
   		$scope.dbcapp.isDataLoading=false;
   	});    	

      
});
