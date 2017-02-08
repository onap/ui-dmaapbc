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
app.factory('DRSubService', function ($http, $q, $log) {
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
				$log.error('DRSubService.getSubsByPage failed: ' + error);
				return $q.reject(error.data);
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
				$log.error('DRSubService.addSub failed: ' + error);
				return $q.reject(error.data);
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
				$log.error('DRSubService.updateSub failed: ' + error);
				return $q.reject(error.data);
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
				$log.error('DRSubService.deleteSub failed: ' + error);
				return $q.reject(error.data);
			 });	
		},

	};
});
