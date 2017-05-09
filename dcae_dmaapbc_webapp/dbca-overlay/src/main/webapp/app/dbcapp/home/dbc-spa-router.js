appDS2.config(function($routeProvider) {
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
	/* user category */
	.when('/profile_search', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/profile_searchDS2.html',
		controller : "profileSearchCtrlDS2"
	})
	.when('/post_search', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/post.html',
		controller: 'postController'
	})
	.when('/self_profile', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-profile/self_profile.html',
		controller: 'selfProfileController'
	})	
	/* admin category */
	.when('/role_list', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/role_list.html',
		controller : 'adminController'
	})
	.when('/role_function_list', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/role-function.html',
		controller : "adminController"
	})
	.when('/jcs_admin', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/jcs_admin.html',
		controller: 'adminController'
	})
	.when('/admin_menu_edit', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/admin-menu-edit.html',
		controller: 'AdminMenuEditController'
	})
	.when('/usage_list', {
		templateUrl: 'app/fusion/scripts/DS2-view-models/ds2-admin/usage.html',
		controller: 'usageListControllerDS2'
	})	
	/* catch-all */
	.otherwise({
		templateUrl: 'app/dbcapp/home/dbc_home_body.html',
		controller: 'dbcHomeCtrl'
	})
	;

});