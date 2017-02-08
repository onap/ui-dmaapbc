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
app.factory('ManifestService', function ($http, $q, $log) {
	return {
		// Gets and returns the manifest for the webapp.
		getManifest: function() {
			// cache control for IE
			var cc = "?cc=" + new Date().getTime().toString();
			return $http({
					method: 'GET',
					url: 'manifest' + cc,
					cache: false,
					responseType: 'json'})
			.then(function(response) {
				// $log.debug("ManifestService.getManifest: " + JSON.stringify(response));
				if (response.data == null || typeof response.data != 'object') 
					return $q.reject('ManifestService.getManifest: response.data null or not object');
				else 
					return response.data;
			}, function(error) {
				$log.error('ManifestService.getManifest failed: ' + error.data);
				return $q.reject(error.data);
			});
		}		
	};
});
