angular.module("modalServices",[]).service('modalService', ['$modal', function ($modal) {

	/* 
	 * Defines the same functions available in DS1 using DS2 icons etc.
	 * Relies on templates defined in dbc_popup_templates.html
	 */
	
	var ModalInstanceCtrl = function ($scope, $modalInstance, $rootScope, items) {
		// Pass thru to template as object "msg"
		$scope.msg = items;
		
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	};
	
	this.showIconTitleTextOkModal = function (icon, title, text) {
    	var modalInstance = $modal.open({
			templateUrl: 'dbc_title_text_ok_modal.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small',
			resolve: {
                items: function () {
					return {
						icon: icon,
						title: title,
	                   	text:  text
	                };
                }
	        }
	});
    };

	/* modals used in many DBC pages */
	this.showFailure = function (title, text) {
		this.showIconTitleTextOkModal('icon-primary-alert', title, text);
	};

	this.showSuccess = function (title, text) {
		this.showIconTitleTextOkModal('icon-primary-approval', title, text);
	};
    
    /* Replicate modals defined by ds2-modal/modalService.js */
	errorPopUp = function(text) {
		this.showFailure('Error', text);
	};	
	successPopUp = function(text) {
		this.showSuccess('Success', text);
	};
		
	this.popupConfirmWin = function(title, text, callback) {
    	var modalInstance = $modal.open({
			templateUrl: 'dbc_title_text_ok_cancel_modal.html',
			controller: ModalInstanceCtrl,
			sizeClass: 'modal-small',
			resolve: {
                items: function () {
					return {
						icon: 'icon-primary-questionmark',
						title: title,
	                   	text:  text
	                };
                }
	        }
		});
    	var args = Array.prototype.slice.call(arguments, 0);
   		args.splice(0, 3); 
   		modalInstance.result.then(function(){
   			callback.apply(null, args);
   		}, function() {
   			//
   		})['finally'](function(){
   			modalInstance = undefined;
   		});
   	};
   		
 }]);
