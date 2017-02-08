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
app.factory('MRClientService', function ($http, $q, $log) {
	return {		
		/**
		 * Gets one page of message router client objects.
		 * @param {Number} pageNum - page number; e.g., 1 
		 * @param {Number} viewPerPage - number of items per page; e.g., 25
		 * @return {JSON} Response object from remote side
		 */
		getClientsByPage: function(pageNum,viewPerPage) {
			// cache control for IE
			var cc = "&cc=" + new Date().getTime().toString();
			return $http({
					method: 'GET',
					url: 'mr_client?pageNum=' + pageNum + '&viewPerPage=' + viewPerPage + cc,
					cache: false,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('MRClientService.getClientsByPage: response.data null or not object');
				else 
					return response.data;
			}, 
			function(error) {
				$log.error('MRClientService.getClientsByPage failed: ' + error);
				return $q.reject(error.data);
			});
		},
		
		// Creates a new client.
		addClient: function(client) {
			return $http({
					method: 'POST',
					url: 'mr_client',
					data: client,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('MRClientService.addClient: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('MRClientService.addClient failed: ' + error);
				return $q.reject(error.data);
			 });	
		},

		// Updates an existing client.
		updateClient: function(client) {
			return $http({
					method: 'PUT',
					url: 'mr_client/' + client.mrClientId,
					data: client,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('MRClientService.updateClient: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				$log.error('MRClientService.updateClient failed: ' + JSON.stringify(error));
				return $q.reject(error.data);
			 });	
		},

		// Deletes the client with the specified ID
		deleteClient: function(mrClientId) {
			return $http({
					method: 'DELETE',
					url: 'mr_client/' + mrClientId,
					responseType: 'json' })
			.then(function(response) {
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('MRClientService.deleteClient: response.data null or not object');
				else 
					return response.data;
			},
			function(error) {
				 $log.error('MRClientService.deleteClient failed: ' + error);
				return $q.reject(error.data);
			 });	
		},

	};
});
