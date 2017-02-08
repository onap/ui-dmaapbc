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
app.factory('DRFeedService', function ($http, $q, $log) {
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
				$log.error('DRFeedService.getFeedsByPage failed: ' + error);
				return $q.reject(error.data);
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
				$log.error('DRFeedService.addFeed failed: ' + error);
				return $q.reject(error.data);
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
				$log.error('DRFeedService.updateFeed failed: ' + error);
				return $q.reject(error.data);
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
				$log.error('DRFeedService.deleteFeed failed: ' + error);
				return $q.reject(error.data);
			 });	
		},
		
	};
});
