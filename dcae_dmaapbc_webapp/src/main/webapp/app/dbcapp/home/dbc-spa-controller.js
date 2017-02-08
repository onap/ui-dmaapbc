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
app.config(function($routeProvider) {
	$routeProvider
	.when('/dmaap', {
		templateUrl: 'app/dbcapp/dmaapaccess/dmaap_access_list.html',
		controller : 'dmaapAccessListCtrl'
	})
	.when('/dr_feed', {
		templateUrl: 'app/dbcapp/datarouter/dr_feed_list.html',
		controller : 'drFeedListCtrl'
	})
	.when('/dr_pub', {
		templateUrl: 'app/dbcapp/datarouter/dr_pub_list.html',
		controller: 'drPubListCtrl'
	})
	.when('/dr_sub', {
		templateUrl: 'app/dbcapp/datarouter/dr_sub_list.html',
		controller: 'drSubListCtrl'
	})
	.when('/mr_topic', {
		templateUrl: 'app/dbcapp/messagerouter/mr_topic_list.html',
		controller : "mrTopicListCtrl"
	})
	.when('/mr_client', {
		templateUrl: 'app/dbcapp/messagerouter/mr_client_list.html',
		controller: 'mrClientListCtrl'
	})
	.otherwise({
		templateUrl: 'app/dbcapp/home/dbc_home_body.html',
		controller: 'dbcHomeCtrl'
	});
});
