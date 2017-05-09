DMaaP Bus Controller Application
================================

The DMaaP Bus Controller web application provides a front-end GUI to a subset of 
the OpenDCAE DMaaP Bus Controller API. The GUI offers a user-friendly way for DMaaP 
administrators to add, modify and remove Data Router feeds (transfers of large
file-based data sets) and Message Router topics (low-latency transfers of small 
messages).  Users can view all feeds and topics; add and remove feed  publishers; 
add and remove feed subscribers; and add and remove topic clients. 

The Data Bus Controller web application is essentially a proxy that passes thru 
all requests to the DMaaP bus controller's REST API, and displays the results. 
All data is stored in the DMaaP bus controller back-end; the application stores no 
data on feeds or topics.  The application only stores user-entered access profiles. 
