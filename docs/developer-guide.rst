===============
Developer Guide
===============

This is the Data Movement as a Platform (DMaaP) Bus Controller web application for ONAP.

Project Structure
-----------------

The following maven projects comprise the web application:

* dbca-common: project with Java code resources for both internal and external use
* dbca-overlay: project with CSS, HTML, Javascript and other web resources for both internal and external use
* dbca-os: master web app with Java code and web resources specific to the open-source
   version of the application.

Building the App
----------------

Run maven in the top-level folder:

::

 mvn package


Developing the App
------------------

The easiest way I know of developing and debugging this Java web app is to launch the application using Eclipse.  
This requires some setup:

- Create a local database with the expected table structure and content (see deployment guide)
- Prepare property files with the coordinates and credentials of the local database (see deployment guide), the critical file is src/main/webapp/WEB-INF/conf/system.properties
- Use the JEE version of Eclipse with the "Web Tools Platform" (WTP) plugin installed.
- Install a recent copy of Apache Tomcat; e.g., 8.5 or later
- Create a Tomcat server in the WTP "Servers" view
- In Eclipse, right click on the master web project "dmapp-bc-app-os", pick "Run As" then "Run on Server". This should apply the overlay files and gather everything into a bundle, then push it to the Tomcat server.
- The app should start and Eclipse will open a browser using the webapp context.  However, the app very much wants users to login via ONAP Portal, which might not be configured.  To work locally use this URL:

::

 http://localhost:8080/dmaap-bc-app-os/login_external.htm

Upgrading the App
-----------------

This section presents detail of upgrading the DMaaP BC web application for a new release of the ONAP Portal SDK.

Basics
^^^^^^

Generate a list of differences with this command:

::

 diff -q -r ../quantum/sdk-app/src src

Expected differences - verify but don't overwrite local changes:

::

 dcae_dmaapbc_webapp/db-scripts/EcompSdkDDLMySql.sql
 dcae_dmaapbc_webapp/db-scripts/EcompSdkDMLMySql.sql
 dcae_dmaapbc_webapp/src/main/java/com/att/fusionapp/conf/ExternalAppConfig.java
 dcae_dmaapbc_webapp/src/main/java/com/att/fusionapp/conf/HibernateMappingLocations.java
 dcae_dmaapbc_webapp/src/main/java/com/att/fusionapp/controller/WelcomeController.java
 dcae_dmaapbc_webapp/src/main/resources/logback.xml
 dcae_dmaapbc_webapp/src/main/resources/portal.properties
 dcae_dmaapbc_webapp/src/main/webapp/index.jsp
 dcae_dmaapbc_webapp/src/main/webapp/WEB-INF/conf/system.properties
 dcae_dmaapbc_webapp/src/main/webapp/WEB-INF/jsp/login.jsp
 dcae_dmaapbc_webapp/src/main/webapp/WEB-INF/web.xml

Directories in webapp only:

::

 src/main/webapp/WEB-INF/dbcapp

Directories in SDK, omitted from webapp:

::

 ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/raptor
 ../quantum/sdk-app/src/main/webapp/app/fusion/notebook-integration
 ../quantum/sdk-app/src/main/webapp/static/fusion/raptor
 ../quantum/sdk-app/src/test/java/com/att/workflow


Details about the 1702 upgrade
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Ignore all Java changes - no relevant commits were made to epsdk-app for this release:

::

 Only in ../quantum/sdk-app/src/main/java: com
 Only in src/main/java: org

Ignore all only-in-DBC-app:

::

 Only in src/main/webapp/WEB-INF: dbcapp
 Only in src/main/webapp/app: dbcapp
 Only in src/test: resources

Ignore all only-in-SDK-app:

::

 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/conf: quartz.properties
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/conf: raptor.properties
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/conf: raptor_app_fusion.properties
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/conf: raptor_db_fusion.properties
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/conf: raptor_pdf.properties
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp: broadcast.jsp
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp: broadcast_list.jsp
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp: collaborateList.jsp
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp: data_out.jsp
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp: es_suggest_demo.jsp
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp: webrtc
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion: raptor
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/jsp: leafletMap.jsp
 Only in ../quantum/sdk-app/src/main/webapp/WEB-INF/jsp: net_map.jsp
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion: notebook-integration
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/angular_js: appDS2.js
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/external/samples/html: busy_hour_traffic.html
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/external/samples/html: traffic_distribution.html
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers: admin-closed-cloop.js
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers: admin-whitelist.js
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models: reportdashboard-page
 Only in ../quantum/sdk-app/src/main/webapp/app/fusionapp/scripts: DS2-view-models
 Only in ../quantum/sdk-app/src/main/webapp/static/fusion: raptor
 Only in ../quantum/sdk-app/src/main/webapp/static/fusion: sample
 Only in ../quantum/sdk-app/src/main/webapp/static/fusion/images: ecomp-login.jpg
 Only in ../quantum/sdk-app/src/test/java/com/att: workflow

Ignored these at some risk of breakage:

::

 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/external: leaflet-0.7.3
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/external: lodash
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/external: showdown
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/external/angular-ui: ui-sortable
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/angular_js: angular-cookies-1.4.js

Ignore these because I don't want DS2 yet:

::

 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/external: ds2
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/scripts: DS2-controllers
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/scripts: DS2-directives
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/scripts: DS2-services
 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/scripts: DS2-view-models

Ignore these because I like my changes:

::

 Files ../quantum/sdk-app/src/main/resources/logback.xml and src/main/resources/logback.xml differ
 Files ../quantum/sdk-app/src/main/resources/portal.properties and src/main/resources/portal.properties differ
 Files ../quantum/sdk-app/src/main/webapp/WEB-INF/conf/system.properties and src/main/webapp/WEB-INF/conf/system.properties differ
 Files ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/defs/definitions.xml and src/main/webapp/WEB-INF/fusion/defs/definitions.xml differ
 Files ../quantum/sdk-app/src/main/webapp/WEB-INF/jsp/login.jsp and src/main/webapp/WEB-INF/jsp/login.jsp differ
 Files ../quantum/sdk-app/src/main/webapp/WEB-INF/web.xml and src/main/webapp/WEB-INF/web.xml differ
 Files ../quantum/sdk-app/src/main/webapp/index.jsp and src/main/webapp/index.jsp differ

Copy these:

::

 Only in ../quantum/sdk-app/src/main/webapp/app/fusion/styles: global.css
 Files ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp/ebz/ebz_footer.jsp and src/main/webapp/WEB-INF/fusion/jsp/ebz/ebz_footer.jsp differ
 Files ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp/ebz_template.jsp and src/main/webapp/WEB-INF/fusion/jsp/ebz_template.jsp differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/elementmap/scripts/element_map.js and src/main/webapp/app/fusion/elementmap/scripts/element_map.js differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/ebz_header/footer.css and src/main/webapp/app/fusion/external/ebz/ebz_header/footer.css differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/ebz_header/header.css and src/main/webapp/app/fusion/external/ebz/ebz_header/header.css differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/ebz_header/portal_ebz_header.css and src/main/webapp/app/fusion/external/ebz/ebz_header/portal_ebz_header.css differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/fn-ebz.css and src/main/webapp/app/fusion/external/ebz/fn-ebz.css differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers/adminController.js and src/main/webapp/app/fusion/scripts/controllers/adminController.js differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers/post-search-controller.js and src/main/webapp/app/fusion/scripts/controllers/post-search-controller.js differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers/role-controller.js and src/main/webapp/app/fusion/scripts/controllers/role-controller.js differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers/rolepopupmodelController.js and src/main/webapp/app/fusion/scripts/controllers/rolepopupmodelController.js differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/directives/header.js and src/main/webapp/app/fusion/scripts/directives/header.js differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/directives/leftMenu.js and src/main/webapp/app/fusion/scripts/directives/leftMenu.js differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/services/userInfoService.js and src/main/webapp/app/fusion/scripts/services/userInfoService.js differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/admin-page/admin.html and src/main/webapp/app/fusion/scripts/view-models/admin-page/admin.html differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/footer.html and src/main/webapp/app/fusion/scripts/view-models/footer.html differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/header.html and src/main/webapp/app/fusion/scripts/view-models/header.html differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/admin_closed_loop.html and src/main/webapp/app/fusion/scripts/view-models/profile-page/admin_closed_loop.html differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/admin_menu_edit.html and src/main/webapp/app/fusion/scripts/view-models/profile-page/admin_menu_edit.html differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/popup_modal_role.html and src/main/webapp/app/fusion/scripts/view-models/profile-page/popup_modal_role.html differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/role.html and src/main/webapp/app/fusion/scripts/view-models/profile-page/role.html differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/role_list.html and src/main/webapp/app/fusion/scripts/view-models/profile-page/role_list.html differ
 Files ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/self_profile.html and src/main/webapp/app/fusion/scripts/view-models/profile-page/self_profile.html differ
  
Using these commands:

::

 cp ../quantum/sdk-app/src/main/webapp/app/fusion/styles/global.css src/main/webapp/app/fusion/styles
 cp ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp/ebz/ebz_footer.jsp src/main/webapp/WEB-INF/fusion/jsp/ebz/ebz_footer.jsp 
 cp ../quantum/sdk-app/src/main/webapp/WEB-INF/fusion/jsp/ebz_template.jsp src/main/webapp/WEB-INF/fusion/jsp/ebz_template.jsp 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/elementmap/scripts/element_map.js src/main/webapp/app/fusion/elementmap/scripts/element_map.js 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/ebz_header/footer.css src/main/webapp/app/fusion/external/ebz/ebz_header/footer.css 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/ebz_header/header.css src/main/webapp/app/fusion/external/ebz/ebz_header/header.css 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/ebz_header/portal_ebz_header.css src/main/webapp/app/fusion/external/ebz/ebz_header/portal_ebz_header.css 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/external/ebz/fn-ebz.css src/main/webapp/app/fusion/external/ebz/fn-ebz.css 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers/adminController.js src/main/webapp/app/fusion/scripts/controllers/adminController.js 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers/post-search-controller.js src/main/webapp/app/fusion/scripts/controllers/post-search-controller.js 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers/role-controller.js src/main/webapp/app/fusion/scripts/controllers/role-controller.js 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/controllers/rolepopupmodelController.js src/main/webapp/app/fusion/scripts/controllers/rolepopupmodelController.js 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/directives/header.js src/main/webapp/app/fusion/scripts/directives/header.js 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/directives/leftMenu.js src/main/webapp/app/fusion/scripts/directives/leftMenu.js 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/services/userInfoService.js src/main/webapp/app/fusion/scripts/services/userInfoService.js 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/admin-page/admin.html src/main/webapp/app/fusion/scripts/view-models/admin-page/admin.html 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/footer.html src/main/webapp/app/fusion/scripts/view-models/footer.html 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/header.html src/main/webapp/app/fusion/scripts/view-models/header.html 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/admin_closed_loop.html src/main/webapp/app/fusion/scripts/view-models/profile-page/admin_closed_loop.html 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/admin_menu_edit.html src/main/webapp/app/fusion/scripts/view-models/profile-page/admin_menu_edit.html 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/popup_modal_role.html src/main/webapp/app/fusion/scripts/view-models/profile-page/popup_modal_role.html 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/role.html src/main/webapp/app/fusion/scripts/view-models/profile-page/role.html 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/role_list.html src/main/webapp/app/fusion/scripts/view-models/profile-page/role_list.html 
 cp ../quantum/sdk-app/src/main/webapp/app/fusion/scripts/view-models/profile-page/self_profile.html src/main/webapp/app/fusion/scripts/view-models/profile-page/self_profile.html 
