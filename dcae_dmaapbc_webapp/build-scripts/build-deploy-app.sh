#!/usr/bin/bash 
# Script for DMaaP Bus Controller web app on development host demeter.
# Checks out code, downloads jars from Maven Central, builds war file,
# stops Tomcat server, unpacks the war file, starts server.
# On demeter the webapp is deployed to same tomcat as ECOMP Portal app.

# URL of the project Git repository
GIT_REPO="https://gitlab/scm/ST_DBPA/dcae_dmaapbc_webapp.git"
# Name of git project
PROJECT_THIS_NAME=dcae_dmaapbc_webapp
# Branch to get from git
BRANCH="master"
# Name from the pom file
PROJECT_BUILD_NAME=dmaap-bc-app
# Version from the pom file
PROJECT_BUILD_VERSION=1.0.0
# Get yymmddhhmmss
BUILD_DATE=`date +%G%m%d%H%M%S`

# The following are highly specific to host demeter.

# Directory with maven binary, config and repository
MVN_HOME=/demeter/WebApps/dev/ECOMP_APP/apache-maven-3.3.3/
# Base directory for building
PROJECT_HOME=/demeter/WebApps/dev/DBCAPP
# Build directory
PROJECT_BUILD_HOME=${PROJECT_HOME}/build-dbcapp
# The deploy name is actually a link created by sanjayc from this directory:
#      /usr/local/add-on/apache-tomcat-8.0.35/build-ecompportal/webapps
PROJECT_DEPLOY_NAME=dmaap-bc-app

echo "Build and deploy begins"

# stop on any error
set -e
# be verbose
set -x

# clone or pull.
if [ -d $PROJECT_THIS_NAME -a ${PROJECT_THIS_NAME}/.git ]; then
    echo "git repo exists, pulling"
    cd $PROJECT_THIS_NAME
    git checkout ${BRANCH}
    git pull
    cd ..
else
    echo "cloning git repo"
    git clone -b ${BRANCH} ${GIT_REPO}
fi

# build 
cd $PROJECT_BUILD_HOME/$PROJECT_THIS_NAME
$MVN_HOME/bin/mvn clean package

# stop Tomcat server (it might not be running)
/usr/local/sbin/tomcatadmin-8.0-ecompportal stop || echo "Tomcat not running, continuing anyhow"

# move old deployment out of the way
cd $PROJECT_HOME
if [ -d ${PROJECT_DEPLOY_NAME} ]; then 
    mv ${PROJECT_DEPLOY_NAME} ${PROJECT_DEPLOY_NAME}_${BUILD_DATE}
fi

# unpack war in the appropriate directory
mkdir $PROJECT_HOME/$PROJECT_DEPLOY_NAME/
cd $PROJECT_HOME/$PROJECT_DEPLOY_NAME/
jar xf $PROJECT_BUILD_HOME/$PROJECT_THIS_NAME/target/${PROJECT_BUILD_NAME}.${PROJECT_BUILD_VERSION}.war

# copy in appropriate property files
cp $PROJECT_BUILD_HOME/properties/system.properties $PROJECT_HOME/$PROJECT_DEPLOY_NAME/WEB-INF/conf/
cp $PROJECT_BUILD_HOME/properties/fusion.properties $PROJECT_HOME/$PROJECT_DEPLOY_NAME/WEB-INF/fusion/conf/
cp $PROJECT_BUILD_HOME/properties/portal.properties $PROJECT_HOME/$PROJECT_DEPLOY_NAME/WEB-INF/classes/
cp $PROJECT_BUILD_HOME/properties/dbcapp.properties $PROJECT_HOME/$PROJECT_DEPLOY_NAME/WEB-INF/dbcapp/

# restart server
/usr/local/sbin/tomcatadmin-8.0-ecompportal start

echo "Build and deploy complete"
