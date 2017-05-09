appDS2.controller('dbcHomeCtrl', function($scope, $log, DmaapAccessService, ManifestService) {
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
			$scope.dbcapp.isDataLoading=false;
   		}
   		else {
			$scope.dbcapp.selectedDmaapAccess=jsonObj.data;

   			// Next get the manifest
   			ManifestService.getManifest()
   			.then(function(jsonObj) {
   				// $log.debug("dbcHomeCtrl: getManifest returned " + JSON.stringify(jsonObj));
   				if (jsonObj.error) {
   					$scope.dbcapp.isRequestFailed = true;
   					$scope.dbcapp.errMsg = jsonObj.error;
   					$scope.dbcapp.isDataLoading=false;
   				}
   				else {
   					$scope.dbcapp.manifest=jsonObj;
   					$scope.dbcapp.isDataLoading=false;
   				}
   			},function(error){
   				$log.error("dbcHomeCtrl getManifest failed: " + error);
   				$scope.dbcapp.isDataLoading=false;
   			});    	
 		
			}
   	},function(error){
   		$log.error("dbcHomeCtrl: getSelectdDmaapAccess failed: " + error);
   		$scope.dbcapp.isDataLoading=false;
   	});    	

      
});
