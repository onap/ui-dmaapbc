appDS2.factory('DRSubService', function ($http, $q, $log) {
	return {		
		/**
		 * Gets one page of data router subscriber objects.
		 * @param {Number} pageNum - page number; e.g., 1 
		 * @param {Number} viewPerPage - number of items per page; e.g., 25
		 * @return {JSON} Response object from remote side
		 */
		getSubsByPage: function(pageNum,viewPerPage) {
			// cache control for IE
			var cc = "&cc=" + new Date().getTime().toString();
			return $http({
					method: 'GET',
					url: 'dr_sub?pageNum=' + pageNum + '&viewPerPage=' + viewPerPage + cc,
					cache: false,
					responseType: 'json'})
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRSubService.getSubsByPage: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRSubService.getSubsByPage failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			});
		},
		
		// Creates a new subscriber.
		addSub: function(sub) {
			return $http({
					method: 'POST',
					url: 'dr_sub',
					data: sub,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRSubService.addSub: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRSubService.addSub failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},
		
		// Updates an existing subscriber.
		updateSub: function(sub) {
			return $http({
					method: 'PUT',
					url: 'dr_sub/' + sub.subId,
					data: sub,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRSubService.updateSub: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRSubService.updateSub failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},
		
		// Deletes the subscriber with the specified ID.
		deleteSub: function(subId) {
			return $http({
					method: 'DELETE',
					url: 'dr_sub/' + subId,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRSubService.deleteSub: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRSubService.deleteSub failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},

	};
});
