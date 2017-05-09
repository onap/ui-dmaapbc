appDS2.factory('DRPubService', function ($http, $q, $log) {
	return {		
		/**
		 * Gets one page of data router publisher objects.
		 * @param {Number} pageNum - page number; e.g., 1 
		 * @param {Number} viewPerPage - number of items per page; e.g., 25
		 * @return {JSON} Response object from remote side
		 */
		getPubsByPage: function(pageNum,viewPerPage) {
			// cache control for IE
			var cc = "&cc=" + new Date().getTime().toString();
			return $http({
					method: 'GET',
					url: 'dr_pub?pageNum=' + pageNum + '&viewPerPage=' + viewPerPage + cc,
					cache: false,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRPubService.getPubsByPage: response.data null or not object');
				else 
					return response.data;
			}, 
			function(error) {
				$log.error('DRPubService.getPubsByPage failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			});
		},
		
		// Creates a new publisher.
		addPub: function(pub) {
			return $http({
					method: 'POST',
					url: 'dr_pub',
					data: pub,
					responseType: 'json' })
			.then(function(response) {
				// $log.debug('DRPubService.addPub: response: ' + JSON.stringify(response));
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRPubService.addPub: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRPubService.addPub failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},

		// Updates an existing publisher.
		updatePub: function(pub) {
			return $http({
					method: 'PUT',
					url: 'dr_pub/' + pub.pubId,
					data: pub,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRPubService.updatePub: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRPubService.updatePub failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},

		// Deletes the publisher with the specified ID.
		deletePub: function(pubId) {
			return $http({
					method: 'DELETE',
					url: 'dr_pub/' + pubId,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRPubService.deletePub: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRPubService.deletePub failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},
		
	};
});
