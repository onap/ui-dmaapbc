================
Deployment Guide
================

This is the Data Movement as a Platform (DMaaP) Bus Controller web application for ONAP.

This is a preliminary draft.  The web app was deployed in ONAP release 1.0  
with the ONAP Portal.  That deployment strategy is no longer in effect.

The application was designed to be on-boarded to the ONAP Portal for user
management and other features, so this deployment guide assumes the web
application will be on-boarded.

This application is delivered as a single WAR file with all CSS, HTML, 
JavaScript, compiled Java classes and Jar files together in a single 
deployable bundle.  No front-end/back-end separation is implemented.

Prerequisites
-------------

Java: Java version 1.8 with a recent update must be installed.  Java includes a
file with known root certificates, which may require changes to recognize
self-signed server certificates. 

App server: Version 8 of the Apache Tomcat server must be installed. 

Database: These instructions assume Mariadb version 10.1.13-MariaDB or later.

The DBC web application is built by maven and packaged as a war file.  This
deployment guide does not cover the build process, which is assumed to be
covered by Continuous Integration / Continuous Deployment efforts.

Property Files
--------------

The DBC web app requires appropriate configuration for each deployment environment.
Configurations are represented as key-values pairs stored in property files. 
	
Portal Properties for ecompFW Library
-------------------------------------

This file within the web application contains properties used by the EPSDK-FW library:

	WEB-INF/classes/portal.properties

The application requires the location of the hosting Portal's REST endpoint in
this config key:

* ecomp_rest_url

The application requires the unique UEB key that's assigned during the on-boarding
process in the following config key:

* ueb_app_key

Quantum Library System Properties
---------------------------------

This file within the web application database properties used by the EPSDK-core library:

* WEB-INF/conf/system.properties
	
The application requires suitable database coordinates in the following config keys.

* db.connectionURL
* db.userName
* db.password

As part of deployment, the following config key must be updated with a unique UUID.  
For example, a new value can be generated at https://www.uuidgenerator.net/version1

* instance_uuid

Data Bus Control App Properties
-------------------------------

This file within the web application properties used by the web application;
an example file is in source code management:

* WEB-INF/dbcapp/dbcapp.properties

The application requires a comma-separated list of DCAE DMaaP Bus Controller 
URLs in the following config key:

* dmaap.rest.url.list

Prepare the Database
--------------------

This uses MariaDB.
 
Login to the database with super user privileges and type the following commands
to create a database, create a user and grant privileges to the user to 
access all tables in the new database:  

::
 
 % mysql -u root -p
 create database dbca;
 create user 'dbca_user'@'%' identified by 'dbca_pass';
 grant all on dbca.* to dbcuser@'%';

As part of deployment the database must be loaded with menu items and a super user entry.
The following files are part of the application source tree:

*	dmaap-bc-app-common/db-scripts/dbca-ddl-mysql-1707-common.sql
*	dmaap-bc-app-os/db-scripts/dbca-dml-mysql-1707-os.sql

Create tables and populate the tables by running the scripts in the order shown below.  
On one node of the MariaDB Cluster, in the Mysql command-line client, execute the following 
commands:

::

 source dbca-ddl-mysql-1707-common.sql
 source dbca-dml-mysql-1707-os.sql


Application Installation
------------------------

Copy the war file to the Tomcat server's "webapps" area.

Launch the Tomcat server. It should deploy the application.  After starting, verify there are no 
relevant errors in file /opt/app/tomcat/logs/application.log

::

 service tomcat start
 service tomcat status
 tail -f /opt/app/tomcat/logs/catalina.out 

Login to Application
--------------------

After the database is first created the application has exactly one user, and that user has
administrator privileges.  Look in the file dbca-dml-mysql-1707-os.sql for the sole row added to 
the FN_USER table.  Use the username and password from that row to login at this URL in the 
running application.  Use the application deployment (context) name chosen above to form the
proper url, it will be something like this:

* http://servername.domain.com/dmaap-bc-app/login_external.htm


On-Board to ONAP Portal
-----------------------

The application must be on-boarded to an appropriate instance of the ONAP Portal.  Detailed 
instructions are available at this wiki page:
	
* https://wiki.onap.org/display/DW/Application+Onboarding

This section summarizes the steps that must be done.

Define Users and Roles
^^^^^^^^^^^^^^^^^^^^^^

Login directly to the application as discussed above and create roles.

Determine URLs
^^^^^^^^^^^^^^

Determine the URLs where the application is available:

The first URL to enter is the main application landing page. 

The second URL to enter is the REST endpoint, also known as the "aux" API where
the SDK-core library listens for requests to manage roles and users. 

Configure Portal
^^^^^^^^^^^^^^^^

An ONAP Portal administrator must use the Portal on-boarding screen to create/register 
this application.  

This screen accepts the URLs from the previous step. 

This screen accepts an application thumbnail image.  A PNG image file at resolution
170x130 is available in the docs folder "open_dcae_logo_170x130.png".

The onboarding process will cause new UEB key information to be generated
and emailed to the on-boarding user.  This information must be entered in the 
portal.properties file as discussed above.

Add Application Users from Portal
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

After successful on-boarding, the Portal should be able to manage users in the remote
application.  Use the User Management feature to provision new users on the application.

Test Access from Portal
^^^^^^^^^^^^^^^^^^^^^^^

The Portal will display a tile on the applications home screen.  Click the tile.  
This should open a tab in the user's browser with the DBC web application.  
