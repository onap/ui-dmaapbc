appDS2.factory('DRFeedService', function ($http, $q, $log) {
	return {
		/**
		 * Gets one page of data router feed objects.
		 * @param {Number} pageNum - page number; e.g., 1 
		 * @param {Number} viewPerPage - number of items per page; e.g., 25
		 * @return {JSON} Response object from remote side
		 */
		getFeedsByPage: function(pageNum,viewPerPage) {
			// cache control for IE
			var cc = "&cc=" + new Date().getTime().toString();
			return $http({
					method: 'GET',
					url: 'dr_feed?pageNum=' + pageNum + '&viewPerPage=' + viewPerPage + cc,
					cache: false,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRFeedService.getFeedsByPage: response.data null or not object');
				else 
					return response.data;
			}, 
			function(error) {
				$log.error('DRFeedService.getFeedsByPage failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			});
		},
		
		// Creates a new feed.
		addFeed: function(feed) {
			return $http({
					method: 'POST',
					url: 'dr_feed',
					data: feed,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRFeedService.addFeed: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRFeedService.addFeed failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},

		// Updates an existing feed.
		updateFeed: function(feed) {
			return $http({
					method: 'PUT',
					url: 'dr_feed/' + feed.feedId,
					data: feed,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRFeedService.updateFeed: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRFeedService.updateFeed failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},
		
		// Deletes the feed with the specified ID.
		deleteFeed: function(feedId) {
			return $http({
					method: 'DELETE',
					url: 'dr_feed/' + feedId,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRFeedService.deleteFeed: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DRFeedService.deleteFeed failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},
		
		/**
		 * Gets a list of string values that classify data sensitivity.
		 */
		getFeedPiiTypes: function() {
			return $http({
					method: 'GET',
					url: 'dr_feed_pii_types',
					cache: false,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DRFeedService.getFeedPiiTypes: response.data null or not object');
				else 
					return response.data;
			}, 
			function(error) {
				$log.error('DRFeedService.getFeedPiiTypes failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			});
		},

	};
});
