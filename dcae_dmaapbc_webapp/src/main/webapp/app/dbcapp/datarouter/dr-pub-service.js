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
app.factory('DRPubService', function ($http, $q, $log) {
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
				$log.error('DRPubService.getPubsByPage failed: ' + error);
				return $q.reject(error.data);
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
				$log.error('DRPubService.addPub failed: ' + error);
				return $q.reject(error.data);
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
				$log.error('DRPubService.updatePub failed: ' + error);
				return $q.reject(error.data);
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
				$log.error('DRPubService.deletePub failed: ' + error);
				return $q.reject(error.data);
			 });	
		},
		
	};
});
