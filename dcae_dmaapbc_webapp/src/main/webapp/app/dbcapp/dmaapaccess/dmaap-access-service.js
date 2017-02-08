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
app.factory('DmaapAccessService', function ($http, $q, $log) {
	return {
		/**
		 * Gets the list of DMaaP access profiles for the current user (not paginated).
		 * @return {JSON} Response object from remote side
		 */
		getDmaapAccessList: function() {
			// cache control for IE
			var cc = "?cc=" + new Date().getTime().toString();
			return $http({
					method: 'GET',
					url: 'dmaap_access' + cc,
					cache: false,
					responseType: 'json'})
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DmaapAccessService.getDmaapAccessList: response.data null or not object');
				else 
					return response.data;
			}, function(error) {
				$log.error('DmaapAccessService.getDmaapAccessList failed: ' + error.data);
				return $q.reject(error.data);
			});
		},

		// Gets and returns the selected DMaaP access profile for the current user.
		getSelectedDmaapAccess: function() {
			// cache control for IE
			var cc = "?cc=" + new Date().getTime().toString();
			return $http({
					method: 'GET',
					url: 'select_dmaap_access' + cc,
					cache: false,
					responseType: 'json'})
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DmaapAccessService.getSelectedDmaapAccess: response.data null or not object');
				else 
					return response.data;
			}, function(error) {
				$log.error('DmaapAccessService.getSelectedDmaapAccess failed: ' + error);
				return $q.reject(error.data);
			});
		},

		// Selects the specified DMaaP access profile for the current user.
		// Returns nothing.
		setSelectedDmaapAccess: function(dmaapId) {
			return $http({
				method: 'PUT',
				url: 'select_dmaap_access/' + dmaapId,
				responseType: 'json' })
			.then(function(response) {
				// successful response is status:200
				// $log.info('setSelectedDmaapAccess complete: ' + JSON.stringify(response));
			}, function(error) {
				$log.error('DmaapAccessService.setSelectedDmaapAccess failed: ' + error);
				return $q.reject(error.data);
			});
		},
		
		// Creates a new DMaaP access profile for the current user.
		// Returns the current DMaaP access list.
		addDmaapAccess: function(dmaapAccess) {
			return $http({
				method: 'POST',
				url: 'dmaap_access',
				data: dmaapAccess,
				responseType: 'json' })
			.then(function(response) {	
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DmaapAccessService.addDmaapAccess: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DmaapAccessService.addDmaapAccess failed: ' + error);
				return $q.reject(error.data);
			 });	
		},

		// Updates an existing DMaaP access profile for the current user
		// Returns the current DMaaP access list.
		updateDmaapAccess: function(dmaapAccess) {
			return $http({
				method: 'PUT',
				url: 'dmaap_access/' + dmaapAccess.id,
				data: dmaapAccess,
				responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DmaapAccessService.updateDmaapAccess: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DmaapAccessService.updateDmaapAccess failed: ' + error);
				return $q.reject(error.data);
			 });	
		},
		
		// Deletes the specified DMaaP access profile for the current user.
		// Returns the current DMaaP access list.
		deleteDmaapAccess: function(dmaapId) {
			return $http({
					method: 'DELETE',
					url: 'dmaap_access/' + dmaapId,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DmaapAccessService.deleteDmaapAccess: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('DmaapAccessService.deleteDmaapAccess failed: ' + error);
				return $q.reject(error.data);
			 });	
		},

		// Tests the URL in the access profile by fetching the DMaaP object from it.
		testDmaapAccess: function(dmaapAccess) {	
			return $http({
					method: 'POST',
					url: 'test_dmaap_access',
					data: dmaapAccess,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('DmaapAccessService.testDmaapAccess: response.data null or not object');
				else 
					return response.data;
			}, function(error) {
				$log.error('DmaapAccessService.testDmaapAccess failed: ' + error);
				return $q.reject(error.data);
			});
		},

		
	};
});
