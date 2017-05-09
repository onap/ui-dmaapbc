appDS2.factory('MRTopicService', function ($http, $q, $log) {
	return {		
		/**
		 * Gets one page of message router topic objects.
		 * @param {Number} pageNum - page number; e.g., 1 
		 * @param {Number} viewPerPage - number of items per page; e.g., 25
		 * @return {JSON} Response object from remote side
		 */
		getTopicsByPage: function(pageNum,viewPerPage) {
			// cache control for IE
			var cc = "&cc=" + new Date().getTime().toString();
			return $http({
					method: 'GET',
					url: 'mr_topic?pageNum=' + pageNum + '&viewPerPage=' + viewPerPage + cc,
					cache: false,
					responseType: 'json' })				
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('MRTopicService.getTopicsByPage: response.data null or not object');
				else 
					return response.data;
			}, 
			function(error) {
				$log.error('MRTopicService.getTopicsByPage failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			});
		},
		
		// Creates a new topic.
		addTopic: function(topic) {
			return $http({
					method: 'POST',
					url: 'mr_topic',
					data: topic,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('MRTopicService.addTopic: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('MRTopicService.addTopic failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},

		// Updates an existing topic.
		updateTopic: function(topic) {
			return $http({
					method: 'PUT',
					url: 'mr_topic/' + topic.fqtn,
					data: topic,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('MRTopicService.updateTopic: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('MRTopicService.updateTopic failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},

		// Deletes the topic with the specified FQTN.
		deleteTopic: function(fqtn) {
			return $http({
					method: 'DELETE',
					url: 'mr_topic/' + fqtn,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('MRTopicService.deleteTopic: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('MRTopicService.deleteTopic failed: ' + JSON.stringify(error));
				return $q.reject(error.statusText);
			 });	
		},
		
	};
});
