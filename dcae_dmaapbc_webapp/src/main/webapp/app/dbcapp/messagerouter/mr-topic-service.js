/*-
 * ================================================================================
 * DCAE DMaaP Bus Controller Web Application
 * ================================================================================
 * Copyright (C) 2017 AT&T Intellectual Property
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ================================================================================
 */
app.factory('MRTopicService', function ($http, $q, $log) {
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
				return $q.reject(error.data);
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
				return $q.reject(error.data);
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
				return $q.reject(error.data);
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
				return $q.reject(error.data);
			 });	
		},
		
	};
});
