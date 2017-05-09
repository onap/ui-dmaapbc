appDS2.controller('subPopupCtrl', function($scope, $log, $modalInstance, modalService, message, DRSubService) {
	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	if (message.sub == null || message.sub.subId == null)
		$scope.dbcapp.label = 'Add Subscriber';
	else
		$scope.dbcapp.label = 'Edit Subscriber';
	$scope.dbcapp.editSub = message.sub;
	$scope.dbcapp.dcaeList = message.dcaeList;

	/**
	 * Validates content of user-editable fields.
	 * Returns null if all is well, 
	 * a descriptive error message otherwise.
	 */
	$scope.dbcapp.validateSub = function(sub) {
		if (sub == null)
			return "No data found.\nPlease enter some values.";
		if (sub.dcaeLocationName == null)
			return "DCAE Location is required.\nPlease select a value.";
		if (sub.deliveryURL == null || sub.deliveryURL.trim() == '')
			return "Delivery URL is required.\nPlease enter a value.";
		if (sub.username == null || sub.username.trim() == '') 
			return "User Name is required.\nPlease enter a value.";
		if (sub.userpwd == null || sub.userpwd.trim() == '') 
			return "Password is required.\nPlease enter a value.";
		return null;
	}

	$scope.dbcapp.saveSub = function(sub) {
		var validateMsg = $scope.dbcapp.validateSub(sub);
		if (validateMsg != null) {
			alert("Invalid Content\n:" + validateMsg);
			return;			
		}
		
		if (sub.subId == null) {
			// No id, so create a new one
			DRSubService.addSub(sub)
				.then(function(response) {
					// $log.debug('subPopupCtrl.saveSub: ' + JSON.stringify(response));
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('subPopupCtrl: error while adding: ' + error);
				}
			);
		}
		else {
			// Has id, so update an existing one
			DRSubService.updateSub(sub)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('subPopupCtrl: error while updating: ' + error);
				}
			);
		}

	};

	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
