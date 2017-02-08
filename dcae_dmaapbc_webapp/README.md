DMaaP Bus Controller Application
================================

The DMaaP Bus Controller web application provides a front-end GUI to a subset of 
the OpenDCAE DMaaP Bus Controller API. The GUI offers a user-friendly way for DMaaP 
administrators to add, modify and remove Data Router feeds (transfers of large
file-based data sets) and Message Router topics (low-latency transfers of small 
messages).  Users can view all feeds and topics; add and remove feed  publishers; 
add and remove feed subscribers; and add and remove topic clients. 

The Data Bus Controller web application is a essentially proxy that passes thru 
all requests to the DMaaP bus controller's REST API, and displays the results. 
All data is stored in the DMaaP bus controller back-end; the application stores no 
data on feeds or topics.  The application only stores user-entered access profiles. 

This application is planned for integration with ECOMP Portal in release 1610, 
and is expected to run on the same virtual machines and the same Apache Tomcat web
containers as the Portal application.

This application is based on the ECOMP SDK.  Use Apache Maven to build and package
this webapp for deployment.  See the file dbc-app-deployment-guide.txt for complete 
details.

This application relies on the DBC Microservice to access DMaaP access profiles.
A related Maven project contains the code and deployment instructions for that 
micro service.