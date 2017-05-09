appDS2.controller('pubPopupCtrl', function($scope, $log, $modalInstance, modalService, message, DRPubService) {
	'use strict';
	
	// this object holds all app data and functions
	$scope.dbcapp = {};
	
	// Set the label variable for the template
	if (message.pub == null || message.pub.pubId == null)
		$scope.dbcapp.label = 'Add Publisher';
	else
		$scope.dbcapp.label = 'Edit Publisher';
	$scope.dbcapp.editPub = message.pub;
	$scope.dbcapp.dcaeList = message.dcaeList;

	$log.info('pubPopupCtrl: dbcapp object: ', $scope.dbcapp);
	
	/**
	 * Validates content of user-editable fields.
	 * Returns null if all is well, 
	 * a descriptive error message otherwise.
	 */
	$scope.dbcapp.validatePub = function(pub) {
		if (pub == null)
			return "No data found.\nPlease enter some values.";
		if (pub.dcaeLocationName == null)
			return "DCAE Location is required.\nPlease select a value.";
		return null;
	}
	
	$scope.dbcapp.savePub = function(pub) {
		var validateMsg = $scope.dbcapp.validatePub(pub);
		if (validateMsg != null) {
			alert("Invalid Content:\n" + validateMsg);
			return;			
		}
		
		if (pub.pubId == null) {
			// No id, so create a new one
			DRPubService.addPub(pub)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('pubPopupCtrl: error while adding: ' + error);
				}
			);
		}
		else {
			// Has id, so update an existing one
			DRPubService.updatePub(pub)
				.then(function(response) {
					$modalInstance.close(response);
				},
				function (error) {
					$log.error('pubPopupCtrl: error while updating: ' + error);
				}
			);
		}

	};

	$scope.dbcapp.close = function() {
		$modalInstance.close();
	};
});
