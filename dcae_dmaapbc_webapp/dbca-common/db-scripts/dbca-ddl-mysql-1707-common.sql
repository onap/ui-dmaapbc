-- ---------------------------------------------------------------------------------------------------------------
-- This script creates tables for the DMaaP Bus Controller Application
-- in the 1707 release, same tables for both internal and external use.
-- 
-- This file is suitable for deployment to Application Hosting in 1704 and later:
-- 1. This file does NOT name the database; i.e., no statements like this:
-- 			"use foo;"
-- 2. This file uses "--" not NOT "/* */" comment notation; i.e., no statements from mysqldump like this:
-- 			/*!40101 SET character_set_client = utf8 */; 
-- 
-- Note to : Database Admin,  set the MySQL system variable called lower_case_table_names
--
--		It can be set 3 different ways: 
--			command-line options (Cmd-line), 
--			options valid in configuration files (Option file), or 
--			server system variables (System Var). 
--
-- It needs to be set to 1, then table names are stored in lowercase on disk and comparisons are not case sensitive. 
--
-- MySql/MariaDB Version compatibility information
-- $ mysql --version
-- mysql  Ver 15.1 Distrib 5.5.35-MariaDB, for Linux (x86_64) using readline 5.1
--
-- bash-4.2$ mysql --version  – cluster version
-- mysql  Ver 15.1 Distrib 10.1.13-MariaDB, for Linux (x86_64) using readline 5.1
--
-- All versions newer or older than these DO NOT necessarily mean they are compatible.
-- ------------------------------------------------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS=1; 

--
-- NAME: FN_LU_TIMEZONE; TYPE: TABLE 
--
create table fn_lu_timezone (
    TIMEZONE_ID INT(11) NOT NULL,
    TIMEZONE_NAME CHARACTER VARYING(100) NOT NULL,
    TIMEZONE_VALUE CHARACTER VARYING(100) NOT NULL
);

create table fn_user (
    USER_ID INT(11) NOT NULL PRIMARY KEY  AUTO_INCREMENT,
    ORG_ID INT(11),
    MANAGER_ID INT(11),
    FIRST_NAME CHARACTER VARYING(25),
    MIDDLE_NAME CHARACTER VARYING(25),
    LAST_NAME CHARACTER VARYING(25),
    PHONE CHARACTER VARYING(25),
    FAX CHARACTER VARYING(25),
    CELLULAR CHARACTER VARYING(25),
    EMAIL CHARACTER VARYING(50),
    ADDRESS_ID NUMERIC(11,0),
    ALERT_METHOD_CD CHARACTER VARYING(10),
    HRID CHARACTER VARYING(20),
    ORG_USER_ID CHARACTER VARYING(20),
    ORG_CODE CHARACTER VARYING(30),
    LOGIN_ID CHARACTER VARYING(25),
    LOGIN_PWD CHARACTER VARYING(25),
    LAST_LOGIN_DATE TIMESTAMP,
--    LAST_LOGIN_DATE TIMESTAMP WITHOUT TIME ZONE,
    ACTIVE_YN CHARACTER VARYING(1) DEFAULT 'Y' NOT NULL,
--    ACTIVE_YN CHARACTER VARYING(1) DEFAULT 'Y'::CHARACTER VARYING NOT NULL,
    CREATED_ID INT(11),
    CREATED_DATE TIMESTAMP DEFAULT NOW(),
--    CREATED_DATE TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    MODIFIED_ID INT(11),
    MODIFIED_DATE TIMESTAMP default now(),
--    MODIFIED_DATE TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    IS_INTERNAL_YN CHARACTER(1) DEFAULT 'N' NOT NULL,
--    IS_INTERNAL_YN CHARACTER(1) DEFAULT 'N'::BPCHAR NOT NULL,
    ADDRESS_LINE_1 CHARACTER VARYING(100),
    ADDRESS_LINE_2 CHARACTER VARYING(100),
    CITY CHARACTER VARYING(50),
    STATE_CD CHARACTER VARYING(3),
    ZIP_CODE CHARACTER VARYING(11),
    COUNTRY_CD CHARACTER VARYING(3),
    LOCATION_CLLI CHARACTER VARYING(8),
    ORG_MANAGER_USERID CHARACTER VARYING(6),
    COMPANY CHARACTER VARYING(100),
    DEPARTMENT_NAME CHARACTER VARYING(100),
    JOB_TITLE CHARACTER VARYING(100),
    TIMEZONE INT(11),
    DEPARTMENT CHARACTER VARYING(25),
    BUSINESS_UNIT CHARACTER VARYING(25),
    BUSINESS_UNIT_NAME CHARACTER VARYING(100),
    COST_CENTER CHARACTER VARYING(25),
    FIN_LOC_CODE CHARACTER VARYING(10),
    SILO_STATUS CHARACTER VARYING(10)
);

--
-- NAME: FN_ROLE; TYPE: TABLE 
--
create table fn_role (
    ROLE_ID INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ROLE_NAME CHARACTER VARYING(50) NOT NULL,
    ACTIVE_YN CHARACTER VARYING(1) DEFAULT 'Y' NOT NULL,
--    ACTIVE_YN CHARACTER VARYING(1) DEFAULT 'Y'::CHARACTER VARYING NOT NULL,
    PRIORITY NUMERIC(4,0)
);

--
-- NAME: FN_APP_MME_CPU; TYPE: TABLE 
--
create table fn_app_mme_cpu (
    MME CHARACTER VARYING(200),
    YEARMONTH INTEGER,
    SCTP_CPU INTEGER,
    AP_CPU INTEGER,
    DP_CPU INTEGER,
    ROUTER_CPU INTEGER,
    PEB_CPU INTEGER,
    SAU INTEGER
);

--
-- NAME: FN_AUDIT_ACTION; TYPE: TABLE 
--
create table fn_audit_action (
    AUDIT_ACTION_ID INTEGER NOT NULL,
    CLASS_NAME CHARACTER VARYING(500) NOT NULL,
    METHOD_NAME CHARACTER VARYING(50) NOT NULL,
    AUDIT_ACTION_CD CHARACTER VARYING(20) NOT NULL,
    AUDIT_ACTION_DESC CHARACTER VARYING(200),
    ACTIVE_YN CHARACTER VARYING(1)
);

--
-- NAME: FN_AUDIT_ACTION_LOG; TYPE: TABLE 
--
create table fn_audit_action_log (
    AUDIT_LOG_ID INTEGER NOT NULL PRIMARY KEY  AUTO_INCREMENT,
    AUDIT_ACTION_CD CHARACTER VARYING(200),
    ACTION_TIME TIMESTAMP,
--    ACTION_TIME TIMESTAMP WITHOUT TIME ZONE,
    USER_ID NUMERIC(11,0),
    CLASS_NAME CHARACTER VARYING(100),
    METHOD_NAME CHARACTER VARYING(50),
    SUCCESS_MSG CHARACTER VARYING(20),
    ERROR_MSG CHARACTER VARYING(500)
);

--
-- NAME: FN_LU_ACTIVITY; TYPE: TABLE 
--
create table fn_lu_activity (
    ACTIVITY_CD CHARACTER VARYING(50) NOT NULL PRIMARY KEY,
    ACTIVITY CHARACTER VARYING(50) NOT NULL
);

--
-- NAME: FN_AUDIT_LOG; TYPE: TABLE 
--
create table fn_audit_log (
    LOG_ID INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    USER_ID INT(11) NOT NULL,
    ACTIVITY_CD CHARACTER VARYING(50) NOT NULL,
    AUDIT_DATE TIMESTAMP DEFAULT NOW() NOT NULL,
--    AUDIT_DATE TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    COMMENTS CHARACTER VARYING(1000),
    AFFECTED_RECORD_ID_BK CHARACTER VARYING(500),
    AFFECTED_RECORD_ID CHARACTER VARYING(4000),
    CONSTRAINT FK_FN_AUDIT_REF_209_FN_USER FOREIGN KEY (USER_ID) REFERENCES FN_USER(USER_ID)
);

--
-- NAME: FN_BROADCAST_MESSAGE; TYPE: TABLE 
--
create table fn_broadcast_message (
    MESSAGE_ID INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    MESSAGE_TEXT CHARACTER VARYING(1000) NOT NULL,
    MESSAGE_LOCATION_ID NUMERIC(11,0) NOT NULL,
    BROADCAST_START_DATE TIMESTAMP NOT NULL  DEFAULT NOW(),
--    BROADCAST_START_DATE TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    BROADCAST_END_DATE TIMESTAMP NOT NULL DEFAULT NOW(),
--    BROADCAST_END_DATE TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    ACTIVE_YN CHARACTER(1) DEFAULT 'Y' NOT NULL,
--    ACTIVE_YN CHARACTER(1) DEFAULT 'Y'::BPCHAR NOT NULL,
    SORT_ORDER NUMERIC(4,0) NOT NULL,
    BROADCAST_SITE_CD CHARACTER VARYING(50)
);

--
-- NAME: FN_CHAT_LOGS; TYPE: TABLE 
--
create table fn_chat_logs (
    CHAT_LOG_ID INTEGER NOT NULL,
    CHAT_ROOM_ID INTEGER,
    USER_ID INTEGER,
    MESSAGE CHARACTER VARYING(1000),
    MESSAGE_DATE_TIME TIMESTAMP
--    MESSAGE_DATE_TIME TIMESTAMP WITHOUT TIME ZONE
);

--
-- NAME: FN_CHAT_ROOM; TYPE: TABLE 
--
create table fn_chat_room (
    CHAT_ROOM_ID INTEGER NOT NULL,
    NAME CHARACTER VARYING(50) NOT NULL,
    DESCRIPTION CHARACTER VARYING(500),
    OWNER_ID INTEGER,
    CREATED_DATE TIMESTAMP DEFAULT NOW(),
--    CREATED_DATE TIMESTAMP WITHOUT TIME ZONE,
    UPDATED_DATE TIMESTAMP DEFAULT NOW()
--    UPDATED_DATE TIMESTAMP WITHOUT TIME ZONE
);

--
-- NAME: FN_CHAT_USERS; TYPE: TABLE 
--
create table fn_chat_users (
    CHAT_ROOM_ID INTEGER,
    USER_ID INTEGER,
    LAST_ACTIVITY_DATE_TIME TIMESTAMP,
--    LAST_ACTIVITY_DATE_TIME TIMESTAMP WITHOUT TIME ZONE,
    CHAT_STATUS CHARACTER VARYING(20),
    ID INTEGER NOT NULL
);

--
-- NAME: FN_DATASOURCE; TYPE: TABLE 
--
create table fn_datasource (
    ID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    NAME CHARACTER VARYING(50),
    DRIVER_NAME CHARACTER VARYING(256),
    SERVER CHARACTER VARYING(256),
    PORT INTEGER,
    USER_NAME CHARACTER VARYING(256),
    PASSWORD CHARACTER VARYING(256),
    URL CHARACTER VARYING(256),
    MIN_POOL_SIZE INTEGER,
    MAX_POOL_SIZE INTEGER,
    ADAPTER_ID INTEGER,
    DS_TYPE CHARACTER VARYING(20)
);

--
-- NAME: FN_FUNCTION; TYPE: TABLE 
--
create table fn_function (
    FUNCTION_CD CHARACTER VARYING(30) NOT NULL PRIMARY KEY,
    FUNCTION_NAME CHARACTER VARYING(50) NOT NULL
);

--
-- NAME: FN_LU_ALERT_METHOD; TYPE: TABLE 
--
create table fn_lu_alert_method (
    ALERT_METHOD_CD CHARACTER VARYING(10) NOT NULL,
    ALERT_METHOD CHARACTER VARYING(50) NOT NULL
);

--
-- NAME: FN_LU_BROADCAST_SITE; TYPE: TABLE 
--
create table fn_lu_broadcast_site (
    BROADCAST_SITE_CD CHARACTER VARYING(50) NOT NULL,
    BROADCAST_SITE_DESCR CHARACTER VARYING(100)
);

--
-- NAME: FN_LU_CALL_TIMES; TYPE: TABLE 
--
create table fn_lu_call_times (
    CALL_TIME_ID NUMERIC(10,0) NOT NULL,
    CALL_TIME_AMOUNT NUMERIC(10,0) NOT NULL,
    CALL_TIME_DISPLAY CHARACTER VARYING(50) NOT NULL
);

--
-- NAME: FN_LU_CITY; TYPE: TABLE 
--
create table fn_lu_city (
    CITY_CD CHARACTER VARYING(2) NOT NULL,
    CITY CHARACTER VARYING(100) NOT NULL,
    STATE_CD CHARACTER VARYING(2) NOT NULL
);

--
-- NAME: FN_LU_COUNTRY; TYPE: TABLE 
--
create table fn_lu_country (
    COUNTRY_CD CHARACTER VARYING(3) NOT NULL,
    COUNTRY CHARACTER VARYING(100) NOT NULL,
    FULL_NAME CHARACTER VARYING(100),
    WEBPHONE_COUNTRY_LABEL CHARACTER VARYING(30)
);

--
-- NAME: FN_LU_MENU_SET; TYPE: TABLE 
--
create table fn_lu_menu_set (
    MENU_SET_CD CHARACTER VARYING(10) NOT NULL PRIMARY KEY,
    MENU_SET_NAME CHARACTER VARYING(50) NOT NULL
);

--
-- NAME: FN_LU_PRIORITY; TYPE: TABLE 
--
create table fn_lu_priority (
    PRIORITY_ID NUMERIC(11,0) NOT NULL,
    PRIORITY CHARACTER VARYING(50) NOT NULL,
    ACTIVE_YN CHARACTER(1) NOT NULL,
    SORT_ORDER NUMERIC(5,0)
);

--
-- NAME: FN_LU_ROLE_TYPE; TYPE: TABLE 
--
create table fn_lu_role_type (
    ROLE_TYPE_ID NUMERIC(11,0) NOT NULL,
    ROLE_TYPE CHARACTER VARYING(50) NOT NULL
);

--
-- NAME: FN_LU_STATE; TYPE: TABLE 
--
create table fn_lu_state (
    STATE_CD CHARACTER VARYING(2) NOT NULL,
    STATE CHARACTER VARYING(100) NOT NULL
);

--
-- NAME: FN_LU_TAB_SET; TYPE: TABLE 
--
create table fn_lu_tab_set (
    TAB_SET_CD CHARACTER VARYING(30) NOT NULL,
    TAB_SET_NAME CHARACTER VARYING(50) NOT NULL
);

--
-- NAME: FN_MENU; TYPE: TABLE 
--
create table fn_menu (
    MENU_ID INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    LABEL CHARACTER VARYING(100),
    PARENT_ID INT(11),
    SORT_ORDER NUMERIC(4,0),
    ACTION CHARACTER VARYING(200),
    FUNCTION_CD CHARACTER VARYING(30),
    ACTIVE_YN CHARACTER VARYING(1) DEFAULT 'Y' NOT NULL,
--    ACTIVE_YN CHARACTER VARYING(1) DEFAULT 'Y'::CHARACTER VARYING NOT NULL,
    SERVLET CHARACTER VARYING(50),
    QUERY_STRING CHARACTER VARYING(200),
    EXTERNAL_URL CHARACTER VARYING(200),
    TARGET CHARACTER VARYING(25),
    MENU_SET_CD CHARACTER VARYING(10) DEFAULT 'APP',
--    MENU_SET_CD CHARACTER VARYING(10) DEFAULT 'APP'::CHARACTER VARYING,
    SEPARATOR_YN CHARACTER(1) DEFAULT 'N',
--    SEPARATOR_YN CHARACTER(1) DEFAULT 'N'::BPCHAR,
    IMAGE_SRC CHARACTER VARYING(100),
    CONSTRAINT FK_FN_MENU_REF_196_FN_MENU FOREIGN KEY (PARENT_ID) REFERENCES FN_MENU(MENU_ID),
    CONSTRAINT FK_FN_MENU_MENU_SET_CD FOREIGN KEY (MENU_SET_CD) REFERENCES FN_LU_MENU_SET(MENU_SET_CD),
    CONSTRAINT FK_FN_MENU_REF_223_FN_FUNCT FOREIGN KEY (FUNCTION_CD) REFERENCES FN_FUNCTION(FUNCTION_CD)
);

--
-- NAME: FN_ORG; TYPE: TABLE 
--
create table fn_org (
    ORG_ID INT(11) NOT NULL,
    ORG_NAME CHARACTER VARYING(50) NOT NULL,
    ACCESS_CD CHARACTER VARYING(10)
);

--
-- NAME: FN_RESTRICTED_URL; TYPE: TABLE 
--
create table fn_restricted_url (
    RESTRICTED_URL CHARACTER VARYING(250) NOT NULL,
    FUNCTION_CD CHARACTER VARYING(30) NOT NULL
);

--
-- NAME: FN_ROLE_COMPOSITE; TYPE: TABLE 
--
create table fn_role_composite (
    PARENT_ROLE_ID INT(11) NOT NULL,
    CHILD_ROLE_ID INT(11) NOT NULL,
    CONSTRAINT FK_FN_ROLE_COMPOSITE_CHILD FOREIGN KEY (CHILD_ROLE_ID) REFERENCES FN_ROLE(ROLE_ID),
    CONSTRAINT FK_FN_ROLE_COMPOSITE_PARENT FOREIGN KEY (PARENT_ROLE_ID) REFERENCES FN_ROLE(ROLE_ID)
);

--
-- NAME: FN_ROLE_FUNCTION; TYPE: TABLE 
--
create table fn_role_function (
    ROLE_ID INT(11) NOT NULL,
    FUNCTION_CD CHARACTER VARYING(30) NOT NULL,
    CONSTRAINT FK_FN_ROLE__REF_198_FN_ROLE FOREIGN KEY (ROLE_ID) REFERENCES FN_ROLE(ROLE_ID)
);

--
-- NAME: FN_TAB; TYPE: TABLE 
--
create table fn_tab (
    TAB_CD CHARACTER VARYING(30) NOT NULL,
    TAB_NAME CHARACTER VARYING(50) NOT NULL,
    TAB_DESCR CHARACTER VARYING(100),
    ACTION CHARACTER VARYING(100) NOT NULL,
    FUNCTION_CD CHARACTER VARYING(30) NOT NULL,
    ACTIVE_YN CHARACTER(1) NOT NULL,
    SORT_ORDER NUMERIC(11,0) NOT NULL,
    PARENT_TAB_CD CHARACTER VARYING(30),
    TAB_SET_CD CHARACTER VARYING(30)
);

--
-- NAME: FN_TAB_SELECTED; TYPE: TABLE 
--
create table fn_tab_selected (
    SELECTED_TAB_CD CHARACTER VARYING(30) NOT NULL,
    TAB_URI CHARACTER VARYING(40) NOT NULL
);

--
-- NAME: FN_USER_PSEUDO_ROLE; TYPE: TABLE 
--
create table fn_user_pseudo_role (
    PSEUDO_ROLE_ID INT(11) NOT NULL,
    USER_ID INT(11) NOT NULL
);

--
-- NAME: FN_USER_ROLE; TYPE: TABLE 
--
create table fn_user_role (
    USER_ID INT(10) NOT NULL,
    ROLE_ID INT(10) NOT NULL,
    PRIORITY NUMERIC(4,0),
    APP_ID INT(11) DEFAULT 1,
    CONSTRAINT FK_FN_USER__REF_172_FN_USER FOREIGN KEY (USER_ID) REFERENCES FN_USER(USER_ID),
    CONSTRAINT FK_FN_USER__REF_175_FN_ROLE FOREIGN KEY (ROLE_ID) REFERENCES FN_ROLE(ROLE_ID)
);

--
-- NAME: FN_XMLTYPE; TYPE: TABLE 
--
create table fn_xmltype (
    ID NUMERIC(10,0) NOT NULL,
    XML_DOCUMENT TEXT
);

--
-- NAME: SCHEMA_INFO; TYPE: TABLE 
--
create table schema_info (
    SCHEMA_ID CHARACTER VARYING(25) NOT NULL,
    SCHEMA_DESC CHARACTER VARYING(75) NOT NULL,
    DATASOURCE_TYPE CHARACTER VARYING(100),
    CONNECTION_URL VARCHAR(200) NOT NULL,
    USER_NAME VARCHAR(45) NOT NULL,
    PASSWORD VARCHAR(45) NULL DEFAULT NULL,
    DRIVER_CLASS VARCHAR(100) NOT NULL,
    MIN_POOL_SIZE INT NOT NULL,
    MAX_POOL_SIZE INT NOT NULL,
    IDLE_CONNECTION_TEST_PERIOD INT NOT NULL

);

-- ----------------------------------------------------------
-- NAME: FN_APP; TYPE: TABLE
-- ----------------------------------------------------------
create table fn_app (
  APP_ID int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  APP_NAME varchar(100) NOT NULL DEFAULT '?',
  APP_IMAGE_URL varchar(256) DEFAULT NULL,
  APP_DESCRIPTION varchar(512) DEFAULT NULL,
  APP_NOTES varchar(4096) DEFAULT NULL,
  APP_URL varchar(256) DEFAULT NULL,
  APP_ALTERNATE_URL varchar(256) DEFAULT NULL,
  APP_REST_ENDPOINT varchar(2000) DEFAULT NULL,
  ML_APP_NAME varchar(50) NOT NULL DEFAULT '?',
  ML_APP_ADMIN_ID varchar(7) NOT NULL DEFAULT '?',
  MOTS_ID int(11) DEFAULT NULL,
  APP_PASSWORD varchar(256) NOT NULL DEFAULT '?',
  OPEN char(1) DEFAULT 'N',
  ENABLED char(1) DEFAULT 'Y',
  THUMBNAIL mediumblob,
  APP_USERNAME varchar(50),
  UEB_KEY VARCHAR(256) DEFAULT NULL,
  UEB_SECRET VARCHAR(256) DEFAULT NULL,
  UEB_TOPIC_NAME VARCHAR(256) DEFAULT NULL
  
);

-- ----------------------------------------------------------
-- NAME: FN_FN_WORKFLOW; TYPE: TABLE
-- ----------------------------------------------------------
create table fn_workflow (
  id mediumint(9) NOT NULL AUTO_INCREMENT,
  name varchar(20) NOT NULL,
  description varchar(500) DEFAULT NULL,
  run_link varchar(300) DEFAULT NULL,
  suspend_link varchar(300) DEFAULT NULL,
  modified_link varchar(300) DEFAULT NULL,
  active_yn varchar(300) DEFAULT NULL,
  created varchar(300) DEFAULT NULL,
  created_by int(11) DEFAULT NULL,
  modified varchar(300) DEFAULT NULL,
  modified_by int(11) DEFAULT NULL,
  workflow_key varchar(50) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
);

-- ----------------------------------------------------------
-- NAME: FN_SCHEDULE_WORKFLOWS; TYPE: TABLE
-- ----------------------------------------------------------
create table fn_schedule_workflows (
  id_schedule_workflows bigint(25) PRIMARY KEY NOT NULL AUTO_INCREMENT, 
  workflow_server_url varchar(45) DEFAULT NULL,
  workflow_key varchar(45) NOT NULL,
  workflow_arguments varchar(45) DEFAULT NULL,
  startDateTimeCron varchar(45) DEFAULT NULL,
  endDateTime TIMESTAMP DEFAULT NOW(),
  start_date_time TIMESTAMP DEFAULT NOW(),
  recurrence varchar(45) DEFAULT NULL
  );
  
--
-- Name: fn_license; Type: TABLE
--
create table fn_license (
    id numeric(11,0) NOT NULL,
    app_id numeric(11,0) NOT NULL,
    ip_address character varying(100) NOT NULL,
    quantum_version_id numeric(11,0) NOT NULL,
    created_date timestamp DEFAULT now(),
    -- created_date timestamp without time zone DEFAULT now(),
    modified_date timestamp DEFAULT now(),
    -- modified_date timestamp without time zone DEFAULT now(),
    created_id numeric(11,0),
    modified_id numeric(11,0),
    end_date timestamp default '2036-01-19 03:14:07'
    -- end_date timestamp without time zone
);

--
-- Name: fn_license_app; Type: TABLE
--
create table fn_license_app (
    id numeric(11,0) NOT NULL,
    app_name character varying(100) NOT NULL,
    ctxt_name character varying(100)
);

--
-- Name: fn_license_contact; Type: TABLE
--
create table fn_license_contact (
    id integer NOT NULL,
    license_id integer,
    sbcid character varying(20)
);

--
-- Name: fn_license_history; Type: TABLE
--
create table fn_license_history (
    license_id numeric(11,0),
    app_id numeric(11,0),
    ip_address character varying(100),
    quantum_version_id numeric(11,0),
    created_date timestamp default now(),
    -- created_date timestamp without time zone,
    modified_date timestamp default now(),
    -- modified_date timestamp without time zone,
    created_id numeric(11,0),
    modified_id numeric(11,0),
    id numeric(11,0) NOT NULL
);

--
-- Name: fn_license_version; Type: TABLE 
--
create table fn_license_version (
    id numeric(11,0) NOT NULL,
    quantum_version character varying(25)
);

--
-- Name: fn_lu_message_location; Type: TABLE
--

CREATE TABLE fn_lu_message_location (
    message_location_id numeric(11,0) NOT NULL,
    message_location_descr character varying(30) NOT NULL
);

--
-- Name: fn_lu_message_location_MESSAGE_LOCATION_ID; Type: CONSTRAINT
--

ALTER TABLE fn_lu_message_location
    ADD CONSTRAINT fn_lu_message_location_MESSAGE_LOCATION_ID PRIMARY KEY (message_location_id);

-- ------------------ CREATE VIEW SECTION
--
-- NAME: V_URL_ACCESS; TYPE: VIEW
--
CREATE VIEW v_url_access AS
 SELECT DISTINCT M.ACTION AS URL,
    M.FUNCTION_CD
   FROM FN_MENU M
  WHERE (M.ACTION IS NOT NULL)
UNION
 SELECT DISTINCT T.ACTION AS URL,
    T.FUNCTION_CD
   FROM FN_TAB T
  WHERE (T.ACTION IS NOT NULL)
UNION
 SELECT R.RESTRICTED_URL AS URL,
    R.FUNCTION_CD
   FROM FN_RESTRICTED_URL R;

--
-- NAME: FN_AUDIT_ACTION_AUDIT_ACTION_ID; TYPE: CONSTRAINT 
--
alter table fn_audit_action
    add constraint fn_audit_action_audit_action_id primary key (audit_action_id);  
--
--
-- NAME: FK_FN_AUDIT_REF_205_FN_LU_AC; TYPE: CONSTRAINT 
--
alter table fn_audit_log
	add constraint fk_fn_audit_ref_205_fn_lu_ac foreign key (activity_cd) references fn_lu_activity(activity_cd);
--
-- NAME: FK_FN_ROLE__REF_201_FN_FUNCT; TYPE: CONSTRAINT 
--    
alter table fn_role_function
	add constraint fk_fn_role__ref_201_fn_funct foreign key (function_cd) references fn_function(function_cd);
--
-- NAME: FN_CHAT_LOGS_CHAT_LOG_ID; TYPE: CONSTRAINT 
--
alter table fn_chat_logs
    add constraint fn_chat_logs_chat_log_id primary key (chat_log_id);
--
-- NAME: FN_CHAT_ROOM_CHAT_ROOM_ID; TYPE: CONSTRAINT 
--
alter table fn_chat_room
    add constraint fn_chat_room_chat_room_id primary key (chat_room_id);
--
-- NAME: FN_CHAT_USERS_ID; TYPE: CONSTRAINT 
--
alter table fn_chat_users  
    add constraint fn_chat_users_id primary key (id);
--
-- NAME: FN_LU_ALERT_METHOD_ALERT_METHOD_CD; TYPE: CONSTRAINT 
--
alter table fn_lu_alert_method
    add constraint fn_lu_alert_method_alert_method_cd primary key (alert_method_cd);
--
-- NAME: FN_LU_BROADCAST_SITE_BROADCAST_SITE_CD; TYPE: CONSTRAINT 
--
alter table fn_lu_broadcast_site
    add constraint fn_lu_broadcast_site_broadcast_site_cd primary key (broadcast_site_cd);
--
-- NAME: FN_LU_CALL_TIMES_CALL_TIME_ID; TYPE: CONSTRAINT 
--
alter table fn_lu_call_times
    add constraint fn_lu_call_times_call_time_id primary key (call_time_id);
--
-- NAME: FN_LU_CITY_CITY_CDSTATE_CD; TYPE: CONSTRAINT 
--
alter table fn_lu_city
    add constraint fn_lu_city_city_cdstate_cd primary key (city_cd, state_cd);
--
-- NAME: FN_LU_COUNTRY_COUNTRY_CD; TYPE: CONSTRAINT 
--
alter table fn_lu_country
    add constraint fn_lu_country_country_cd primary key (country_cd);
--
-- NAME: FN_LU_PRIORITY_PRIORITY_ID; TYPE: CONSTRAINT 
--
alter table fn_lu_priority
    add constraint fn_lu_priority_priority_id primary key (priority_id);
--
-- NAME: FN_LU_ROLE_TYPE_ROLE_TYPE_ID; TYPE: CONSTRAINT 
--
alter table fn_lu_role_type
    add constraint fn_lu_role_type_role_type_id primary key (role_type_id);
--
-- NAME: FN_LU_STATE_STATE_CD; TYPE: CONSTRAINT 
--
alter table fn_lu_state
    add constraint fn_lu_state_state_cd primary key (state_cd);
--
-- NAME: FN_LU_TAB_SET_TAB_SET_CD; TYPE: CONSTRAINT 
--
alter table fn_lu_tab_set
    add constraint fn_lu_tab_set_tab_set_cd primary key (tab_set_cd);
--
-- NAME: FN_LU_TIMEZONE_TIMEZONE_ID; TYPE: CONSTRAINT 
--
alter table fn_lu_timezone
    add constraint fn_lu_timezone_timezone_id primary key (timezone_id);
--
-- NAME: FN_ORG_ORG_ID; TYPE: CONSTRAINT 
--
alter table fn_org
    add constraint fn_org_org_id primary key (org_id);
--
-- NAME: FN_RESTRICTED_URL_RESTRICTED_URLFUNCTION_CD; TYPE: CONSTRAINT 
--
alter table fn_restricted_url
    add constraint fn_restricted_url_restricted_urlfunction_cd primary key (restricted_url, function_cd);
--
-- NAME: FN_ROLE_COMPOSITE_PARENT_ROLE_IDCHILD_ROLE_ID; TYPE: CONSTRAINT 
--
alter table fn_role_composite
    add constraint fn_role_composite_parent_role_idchild_role_id primary key (parent_role_id, child_role_id);
--
-- NAME: FN_ROLE_FUNCTION_ROLE_IDFUNCTION_CD; TYPE: CONSTRAINT 
--
alter table fn_role_function
    add constraint fn_role_function_role_idfunction_cd primary key (role_id, function_cd);
--
-- NAME: FN_TAB_TAB_CD; TYPE: CONSTRAINT 
--
alter table fn_tab
    add constraint fn_tab_tab_cd primary key (tab_cd);
--
-- NAME: FN_TAB_SELECTED_SELECTED_TAB_CDTAB_URI; TYPE: CONSTRAINT 
--
alter table fn_tab_selected
    add constraint fn_tab_selected_selected_tab_cdtab_uri primary key (selected_tab_cd, tab_uri);
--
-- NAME: FN_USER_PSEUDO_ROLE_PSEUDO_ROLE_IDUSER_ID; TYPE: CONSTRAINT 
--
alter table fn_user_pseudo_role
    add constraint fn_user_pseudo_role_pseudo_role_iduser_id primary key (pseudo_role_id, user_id);
--
-- NAME: FN_USER_ROLE_USER_IDROLE_ID; TYPE: CONSTRAINT 
--
alter table fn_user_role
    add constraint fn_user_role_user_idrole_id primary key (user_id, role_id, app_id);
--
-- Name: fn_license_ID; Type: CONSTRAINT 
--
alter table fn_license
    add constraint fn_license_id primary key (id);
--
-- Name: fn_license_contact_ID; Type: CONSTRAINT  
--
alter table fn_license_contact
    add constraint fn_license_contact_id primary key (id);
--
-- Name: fn_license_history_ID; Type: CONSTRAINT 
--
alter table fn_license_history
    add constraint fn_license_history_id primary key (id);
--
-- Name: fn_license_version_ID; Type: CONSTRAINT  
--
alter table fn_license_version
    add constraint fn_license_version_id primary key (id);

--
-- NAME: FN_AUDIT_LOG_ACTIVITY_CD; TYPE: INDEX 
--
create index fn_audit_log_activity_cd using btree on fn_audit_log (activity_cd);
--
-- NAME: FN_AUDIT_LOG_USER_ID; TYPE: INDEX 
--
create index fn_audit_log_user_id using btree on fn_audit_log (user_id);
--
-- NAME: FN_MENU_FUNCTION_CD; TYPE: INDEX 
--
create index fn_menu_function_cd using btree on fn_menu (function_cd);
--
-- NAME: FN_ORG_ACCESS_CD; TYPE: INDEX 
--
create index fn_org_access_cd using btree on fn_org (access_cd);
--
-- NAME: FN_ROLE_FUNCTION_FUNCTION_CD; TYPE: INDEX 
--
create index fn_role_function_function_cd using btree on fn_role_function (function_cd);
--
-- NAME: FN_ROLE_FUNCTION_ROLE_ID; TYPE: INDEX 
--
create index fn_role_function_role_id using btree on fn_role_function (role_id);
--
-- NAME: FN_USER_ADDRESS_ID; TYPE: INDEX 
--
create index fn_user_address_id using btree on fn_user (address_id); 
--
-- NAME: FN_USER_ALERT_METHOD_CD; TYPE: INDEX 
--
create index fn_user_alert_method_cd using btree on fn_user (alert_method_cd); 
--
-- NAME: FN_USER_HRID; TYPE: INDEX 
--
create unique index fn_user_hrid using btree on fn_user (hrid); 
--
-- NAME: FN_USER_LOGIN_ID; TYPE: INDEX 
--
create unique index fn_user_login_id using btree on fn_user (login_id); 
--
-- NAME: FN_USER_ORG_ID; TYPE: INDEX 
--
create index fn_user_org_id using btree on fn_user (org_id); 
--
-- NAME: FN_USER_ROLE_ROLE_ID; TYPE: INDEX 
--
create index fn_user_role_role_id using btree on fn_user_role (role_id);
--
-- NAME: FN_USER_ROLE_USER_ID; TYPE: INDEX 
--
create index fn_user_role_user_id using btree on fn_user_role (user_id);
--
-- NAME: FN_XMLTYPE_ID; TYPE: INDEX 
--
create unique index fn_xmltype_id using btree on fn_xmltype (id);
--
-- NAME: FK_FN_USER__REF_178_FN_APP_idx; TYPE: INDEX 
--
create index fk_fn_user__ref_178_fn_app_IDX on fn_user_role (app_id);
--
-- Name: fn_license_app_ID; Type: INDEX  
--
create index fn_license_app_id using btree on fn_license_app (id);

-- ------------------ ALTER TABLE ADD CONSTRAINT FOREIGN KEY SECTION
--
-- NAME: FK_FN_USER__REF_178_FN_APP; TYPE: FK CONSTRAINT
--
alter table fn_user_role
	add constraint fk_fn_user__ref_178_fn_app foreign key (app_id) references fn_app(app_id);
--
-- NAME: FK_FN_TAB_FUNCTION_CD; TYPE: FK CONSTRAINT
--
alter table fn_tab
    add constraint fk_fn_tab_function_cd foreign key (function_cd) references fn_function(function_cd);
--
-- NAME: FK_FN_TAB_SELECTED_TAB_CD; TYPE: FK CONSTRAINT
--
alter table fn_tab_selected
    add constraint fk_fn_tab_selected_tab_cd foreign key (selected_tab_cd) references fn_tab(tab_cd);
--
-- NAME: FK_FN_TAB_SET_CD; TYPE: FK CONSTRAINT
--
alter table fn_tab
    add constraint fk_fn_tab_set_cd foreign key (tab_set_cd) references fn_lu_tab_set(tab_set_cd);
--
-- NAME: FK_FN_USER_REF_110_FN_ORG; TYPE: FK CONSTRAINT
-- 
alter table fn_user
    add constraint fk_fn_user_ref_110_fn_org foreign key (org_id) references fn_org(org_id); 
--
-- NAME: FK_FN_USER_REF_123_FN_LU_AL; TYPE: FK CONSTRAINT
--
alter table fn_user
    add constraint fk_fn_user_ref_123_fn_lu_al foreign key (alert_method_cd) references fn_lu_alert_method(alert_method_cd); 
--
-- NAME: FK_FN_USER_REF_197_FN_USER; TYPE: FK CONSTRAINT
--
alter table fn_user  
    add constraint fk_fn_user_ref_197_fn_user foreign key (manager_id) references fn_user(user_id); 
--
-- NAME: FK_FN_USER_REF_198_FN_USER; TYPE: FK CONSTRAINT
--
alter table fn_user  
    add constraint fk_fn_user_ref_198_fn_user foreign key (created_id) references fn_user(user_id); 
--
-- NAME: FK_FN_USER_REF_199_FN_USER; TYPE: FK CONSTRAINT
--
alter table fn_user  
    add constraint fk_fn_user_ref_199_fn_user foreign key (modified_id) references fn_user(user_id);    
--
-- NAME: FK_PSEUDO_ROLE_PSEUDO_ROLE_ID; TYPE: FK CONSTRAINT
--
alter table fn_user_pseudo_role 
    add constraint fk_pseudo_role_pseudo_role_id foreign key (pseudo_role_id) references fn_role(role_id);
--
-- NAME: FK_PSEUDO_ROLE_USER_ID; TYPE: FK CONSTRAINT
--
alter table fn_user_pseudo_role 
    add constraint fk_pseudo_role_user_id foreign key (user_id) references fn_user(user_id);
--
-- NAME: FK_RESTRICTED_URL_FUNCTION_CD; TYPE: FK CONSTRAINT
--
alter table fn_restricted_url
    add constraint fk_restricted_url_function_cd foreign key (function_cd) references fn_function(function_cd);
--
-- NAME: FK_TIMEZONE; TYPE: FK CONSTRAINT
--
alter table fn_user
    add constraint fk_timezone foreign key (timezone) references fn_lu_timezone(timezone_id); 
--
-- Name: fn_license_r02; Type: FK CONSTRAINTs
--
alter table fn_license
    add constraint fn_license_r02 foreign key (quantum_version_id) references fn_license_version(id);

--
-- DBCA adds just one table to the base EPSDK set.
-- Content is added by app for users.
-- 
DROP TABLE IF EXISTS `dbca_dmaap_access`;
CREATE TABLE `dbca_dmaap_access` (
  `DMAAP_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USER_ID` varchar(16) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `DMAAP_URL` varchar(256) NOT NULL,
  `MECH_ID` varchar(96) DEFAULT NULL,
  `PASSWORD` varchar(96) DEFAULT NULL,
  `CREATED_ID` int(11) DEFAULT NULL,
  `CREATED_DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `MODIFIED_ID` int(11) DEFAULT NULL,
  `MODIFIED_DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SELECT_YN` char(1) DEFAULT 'N',
  PRIMARY KEY (`DMAAP_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;

commit;
