appDS2.filter('dbcYesNoFilter', 
	function() {
		return function(input) {
			return input ? 'Y' : 'N';
		}
	}
);
