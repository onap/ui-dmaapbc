(function() {

angular.module('eAse',[])
	.controller('ETitleController',eTitleController);

	function eTitleController($scope){
		$scope.title = "My Sequence Diagram";
		$scope.titleEdit = true;
		$scope.editTitle = function() {
			$scope.titleEdit = !$scope.titleEdit;
		};
		$scope.doneEdit = function(event) {
			if(event.which === 13) {
				$scope.titleEdit = !$scope.titleEdit;
			}
		};
		$scope.blur = function(event) {
			$scope.titleEdit = !$scope.titleEdit;
		};
	}
})();









/*

app.controller('eSidebarController',function($scope){
	
});
app.controller('eGridController',function($scope){
	
});
app.controller('',function($scope){
	
});
app.directive('sequenceFlow', function () {
	return {
		restrict: 'E',
		templateUrl:  "../view-models/ase_view.html",
		controller: 'flowController',
		scope: '=',
		link: function(scope, element, attrs, flowCtrl) {
			flowCtrl.init();
		}
	}
});

*/

