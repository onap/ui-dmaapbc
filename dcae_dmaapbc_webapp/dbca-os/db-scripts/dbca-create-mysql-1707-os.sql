-- ---------------------------------------------------------------------------------------------------------------
-- DMaaB Bus Control Web App database script for 1707 ONAP:
-- Creates database and sets as default ("USE").
-- Serves as the first part of a complete database script:
-- cat dbca-create-mysql-1707-os.sql ../../dbca-common/db-scripts/dbca-ddl-mysql-1707-common.sql dbca-dml-mysql-1707-os.sql > out.sql
-- ---------------------------------------------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS dbca_os;
USE dbca_os;
