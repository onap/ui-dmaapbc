-- ---------------------------------------------------------------------------------------------------------------
-- This script populates tables for the DMaaP Bus Controller Application
-- in the 1707 release with data for the open-source ONAP version.
--
-- This file is suitable for deployment to Application Hosting in 1704 and later:
-- This file uses "--" not NOT "/* */" comment notation; i.e., no statements from mysqldump like this:
-- 			/*!40101 SET character_set_client = utf8 */; 
-- 
-- Most of the data loaded here is default data for the EP-SDK application (but much reduced).
-- A few entries are specific to the DBC application.
-- Main change: no import-profile page.
-- ---------------------------------------------------------------------------------------------------------------

set foreign_key_checks=1; 

-- fn_function
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('login','Login');
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('menu_home','Home Menu');
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('menu_profile','Profile Menu');
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('menu_admin','Admin Menu');
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('menu_help','Help Menu');
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('menu_logout','Logout Menu');
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('menu_profile_create','Profile Create');
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('menu_data_router','Data Router');
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('menu_dbc','Data Bus Controller');
Insert into fn_function (FUNCTION_CD,FUNCTION_NAME) values ('menu_message_router','Message Router');

-- fn_lu_activity
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('add_role','add_role');
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('remove_role','remove_role');
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('add_user_role','add_user_role');
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('remove_user_role','remove_user_role');
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('add_role_function','add_role_function');
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('remove_role_function','remove_role_function');
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('add_child_role','add_child_role');
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('remove_child_role','remove_child_role');
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('login','Login');
Insert into fn_lu_activity (ACTIVITY_CD,ACTIVITY) values ('logout','Logout');

-- fn_lu_alert_method
Insert into fn_lu_alert_method (ALERT_METHOD_CD,ALERT_METHOD) values ('PHONE','Phone');
Insert into fn_lu_alert_method (ALERT_METHOD_CD,ALERT_METHOD) values ('FAX','Fax');
Insert into fn_lu_alert_method (ALERT_METHOD_CD,ALERT_METHOD) values ('PAGER','Pager');
Insert into fn_lu_alert_method (ALERT_METHOD_CD,ALERT_METHOD) values ('EMAIL','Email');
Insert into fn_lu_alert_method (ALERT_METHOD_CD,ALERT_METHOD) values ('SMS','SMS');

-- fn_lu_country
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('YU','Yugoslavia','Yugoslavia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ZA','South Africa','South Africa',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ZM','Zambia','Zambia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ZR','Zaire','Zaire',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ZW','Zimbabwe','Zimbabwe',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AD','Andorra','Andorra',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AE','United Arab Emirates','United Arab Emirates',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AF','Afghanistan','Afghanistan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AG','Antigua and Barbuda','Antigua and Barbuda',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AI','Anguilla','Anguilla',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AL','Albania','Albania',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AM','Armenia','Armenia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AN','Netherlands Antilles','Netherlands Antilles',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AO','Angola','Angola',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AQ','Antarctica','Antarctica',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AR','Argentina','Argentina',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AS','American Samoa','American Samoa',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AT','Austria','Austria',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AU','Australia','Australia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AW','Aruba','Aruba',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('AZ','Azerbaidjan','Azerbaidjan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BA','Bosnia-Herzegovina','Bosnia-Herzegovina',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BB','Barbados','Barbados',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BD','Bangladesh','Bangladesh',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BE','Belgium','Belgium',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BF','Burkina Faso','Burkina Faso',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BG','Bulgaria','Bulgaria',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BH','Bahrain','Bahrain',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BI','Burundi','Burundi',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BJ','Benin','Benin',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BM','Bermuda','Bermuda',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BN','Brunei Darussalam','Brunei Darussalam',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BO','Bolivia','Bolivia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BR','Brazil','Brazil',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BS','Bahamas','Bahamas',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BT','Bhutan','Bhutan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BV','Bouvet Island','Bouvet Island',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BW','Botswana','Botswana',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BY','Belarus','Belarus',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('BZ','Belize','Belize',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CA','Canada','Canada',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CC','Cocos (Keeling) Islands','Cocos (Keeling) Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CF','Central African Republic','Central African Republic',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CG','Congo','Congo',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CH','Switzerland','Switzerland',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CI','Ivory Coast (Cote D''Ivoire)','Ivory Coast (Cote D''Ivoire)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CK','Cook Islands','Cook Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CL','Chile','Chile',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CM','Cameroon','Cameroon',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CN','China','China','China');
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CO','Colombia','Colombia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CR','Costa Rica','Costa Rica',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CS','Former Czechoslovakia','Former Czechoslovakia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CU','Cuba','Cuba',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CV','Cape Verde','Cape Verde',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CX','Christmas Island','Christmas Island',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CY','Cyprus','Cyprus',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('CZ','Czech Republic','Czech Republic',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('DE','Germany','Germany',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('DJ','Djibouti','Djibouti',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('DK','Denmark','Denmark',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('DM','Dominica','Dominica',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('DO','Dominican Republic','Dominican Republic',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('DZ','Algeria','Algeria',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('EC','Ecuador','Ecuador',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('EE','Estonia','Estonia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('EG','Egypt','Egypt',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('EH','Western Sahara','Western Sahara',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ER','Eritrea','Eritrea',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ES','Spain','Spain',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ET','Ethiopia','Ethiopia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('FI','Finland','Finland',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('FJ','Fiji','Fiji',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('FK','Falkland Islands','Falkland Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('FM','Micronesia','Micronesia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('FO','Faroe Islands','Faroe Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('FR','France','France',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('FX','France (European Territory)','France (European Territory)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GA','Gabon','Gabon',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GB','Great Britain','Great Britain',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GD','Grenada','Grenada',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GE','Georgia','Georgia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GF','French Guyana','French Guyana',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GH','Ghana','Ghana',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GI','Gibraltar','Gibraltar',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GL','Greenland','Greenland',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GM','Gambia','Gambia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GN','Guinea','Guinea',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GP','Guadeloupe (French)','Guadeloupe (French)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GQ','Equatorial Guinea','Equatorial Guinea',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GR','Greece','Greece',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GS','S. Georgia and S. Sandwich Isls.','S. Georgia and S. Sandwich Isls.',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GT','Guatemala','Guatemala',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GU','Guam (USA)','Guam (USA)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GW','Guinea Bissau','Guinea Bissau',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('GY','Guyana','Guyana',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('HK','Hong Kong','Hong Kong',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('HM','Heard and McDonald Islands','Heard and McDonald Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('HN','Honduras','Honduras',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('HR','Croatia','Croatia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('HT','Haiti','Haiti',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('HU','Hungary','Hungary',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ID','Indonesia','Indonesia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('IE','Ireland','Ireland',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('IL','Israel','Israel',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('IN','India','India',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('IO','British Indian Ocean Territory','British Indian Ocean Territory',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('IQ','Iraq','Iraq',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('IR','Iran','Iran',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('IS','Iceland','Iceland',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('IT','Italy','Italy',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('JM','Jamaica','Jamaica',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('JO','Jordan','Jordan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('JP','Japan','Japan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KE','Kenya','Kenya',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KG','Kyrgyzstan','Kyrgyzstan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KH','Cambodia','Cambodia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KI','Kiribati','Kiribati',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KM','Comoros','Comoros',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KN','Saint Kitts and Nevis Anguilla','Saint Kitts and Nevis Anguilla',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KP','North Korea','North Korea',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KR','South Korea','South Korea',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KW','Kuwait','Kuwait',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KY','Cayman Islands','Cayman Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('KZ','Kazakhstan','Kazakhstan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LA','Laos','Laos',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LB','Lebanon','Lebanon',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LC','Saint Lucia','Saint Lucia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LI','Liechtenstein','Liechtenstein',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LK','Sri Lanka','Sri Lanka',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LR','Liberia','Liberia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LS','Lesotho','Lesotho',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LT','Lithuania','Lithuania',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LU','Luxembourg','Luxembourg',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LV','Latvia','Latvia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('LY','Libya','Libya',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MA','Morocco','Morocco',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MC','Monaco','Monaco',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MD','Moldavia','Moldavia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MG','Madagascar','Madagascar',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MH','Marshall Islands','Marshall Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MK','Macedonia','Macedonia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ML','Mali','Mali',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MM','Myanmar','Myanmar',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MN','Mongolia','Mongolia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MO','Macau','Macau',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MP','Northern Mariana Islands','Northern Mariana Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MQ','Martinique (French)','Martinique (French)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MR','Mauritania','Mauritania',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MS','Montserrat','Montserrat',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MT','Malta','Malta',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MU','Mauritius','Mauritius',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MV','Maldives','Maldives',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MW','Malawi','Malawi',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MX','Mexico','Mexico','Mexico');
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MY','Malaysia','Malaysia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('MZ','Mozambique','Mozambique',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NA','Namibia','Namibia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NC','New Caledonia (French)','New Caledonia (French)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NE','Niger','Niger',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NF','Norfolk Island','Norfolk Island',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NG','Nigeria','Nigeria',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NI','Nicaragua','Nicaragua',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NL','Netherlands','Netherlands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NO','Norway','Norway',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NP','Nepal','Nepal',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NR','Nauru','Nauru',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NU','Niue','Niue',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('NZ','New Zealand','New Zealand',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('OM','Oman','Oman',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PA','Panama','Panama',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PE','Peru','Peru',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PF','Polynesia (French)','Polynesia (French)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PG','Papua New Guinea','Papua New Guinea',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PH','Philippines','Philippines',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PK','Pakistan','Pakistan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PL','Poland','Poland',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PM','Saint Pierre and Miquelon','Saint Pierre and Miquelon',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PN','Pitcairn Island','Pitcairn Island',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PR','Puerto Rico','Puerto Rico',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PT','Portugal','Portugal',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PW','Palau','Palau',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('PY','Paraguay','Paraguay',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('QA','Qatar','Qatar',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('RE','Reunion (French)','Reunion (French)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('RO','Romania','Romania',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('RU','Russian Federation','Russian Federation',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('RW','Rwanda','Rwanda',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SA','Saudi Arabia','Saudi Arabia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SB','Solomon Islands','Solomon Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SC','Seychelles','Seychelles',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SD','Sudan','Sudan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SE','Sweden','Sweden',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SG','Singapore','Singapore',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SH','Saint Helena','Saint Helena',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SI','Slovenia','Slovenia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SJ','Svalbard and Jan Mayen Islands','Svalbard and Jan Mayen Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SK','Slovak Republic','Slovak Republic',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SL','Sierra Leone','Sierra Leone',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SM','San Marino','San Marino',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SN','Senegal','Senegal',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SO','Somalia','Somalia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SR','Suriname','Suriname',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('ST','Saint Tome (Sao Tome) and Principe','Saint Tome (Sao Tome) and Principe',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SU','Former USSR','Former USSR',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SV','El Salvador','El Salvador',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SY','Syria','Syria',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('SZ','Swaziland','Swaziland',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TC','Turks and Caicos Islands','Turks and Caicos Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TD','Chad','Chad',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TF','French Southern Territories','French Southern Territories',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TG','Togo','Togo',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TH','Thailand','Thailand',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TJ','Tadjikistan','Tadjikistan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TK','Tokelau','Tokelau',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TM','Turkmenistan','Turkmenistan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TN','Tunisia','Tunisia',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TO','Tonga','Tonga',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TP','East Timor','East Timor',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TR','Turkey','Turkey',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TT','Trinidad and Tobago','Trinidad and Tobago',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TV','Tuvalu','Tuvalu',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TW','Taiwan','Taiwan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('TZ','Tanzania','Tanzania',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('UA','Ukraine','Ukraine',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('UG','Uganda','Uganda',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('UK','United Kingdom','United Kingdom',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('UM','USA Minor Outlying Islands','USA Minor Outlying Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('US','United States','United States','USA');
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('UY','Uruguay','Uruguay',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('UZ','Uzbekistan','Uzbekistan',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('VA','Vatican City State','Vatican City State',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('VC','Saint Vincent and Grenadines','Saint Vincent and Grenadines',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('VE','Venezuela','Venezuela',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('VG','Virgin Islands (British)','Virgin Islands (British)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('VI','Virgin Islands (USA)','Virgin Islands (USA)',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('VN','Vietnam','Vietnam',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('VU','Vanuatu','Vanuatu',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('WF','Wallis and Futuna Islands','Wallis and Futuna Islands',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('WS','Samoa','Samoa',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('YE','Yemen','Yemen',null);
Insert into fn_lu_country (COUNTRY_CD,COUNTRY,FULL_NAME,WEBPHONE_COUNTRY_LABEL) values ('YT','Mayotte','Mayotte',null);

-- fn_lu_menu_set
Insert into fn_lu_menu_set (MENU_SET_CD,MENU_SET_NAME) values ('APP','Application Menu');

-- fn_lu_priority
Insert into fn_lu_priority (PRIORITY_ID,PRIORITY,ACTIVE_YN,SORT_ORDER) values (10,'Low','Y',10);
Insert into fn_lu_priority (PRIORITY_ID,PRIORITY,ACTIVE_YN,SORT_ORDER) values (20,'Normal','Y',20);
Insert into fn_lu_priority (PRIORITY_ID,PRIORITY,ACTIVE_YN,SORT_ORDER) values (30,'High','Y',30);
Insert into fn_lu_priority (PRIORITY_ID,PRIORITY,ACTIVE_YN,SORT_ORDER) values (40,'Urgent','Y',40);
Insert into fn_lu_priority (PRIORITY_ID,PRIORITY,ACTIVE_YN,SORT_ORDER) values (50,'Fatal','Y',50);

-- fn_lu_state
Insert into fn_lu_state (STATE_CD,STATE) values ('NJ','NJ - New Jersey');
Insert into fn_lu_state (STATE_CD,STATE) values ('NY','NY - New York');
Insert into fn_lu_state (STATE_CD,STATE) values ('CA','CA - California');
Insert into fn_lu_state (STATE_CD,STATE) values ('CO','CO - Colorado');
Insert into fn_lu_state (STATE_CD,STATE) values ('FL','FL - Florida');
Insert into fn_lu_state (STATE_CD,STATE) values ('GA','GA - Georgia');
Insert into fn_lu_state (STATE_CD,STATE) values ('VA','VA - Virginia');
Insert into fn_lu_state (STATE_CD,STATE) values ('KY','KY - Kentucky');
Insert into fn_lu_state (STATE_CD,STATE) values ('TX','TX - Texas');
Insert into fn_lu_state (STATE_CD,STATE) values ('AK','AK - Alaska');
Insert into fn_lu_state (STATE_CD,STATE) values ('AL','AL - Alabama');
Insert into fn_lu_state (STATE_CD,STATE) values ('AR','AR - Arkansas');
Insert into fn_lu_state (STATE_CD,STATE) values ('AZ','AZ - Arizona');
Insert into fn_lu_state (STATE_CD,STATE) values ('CT','CT - Connecticut');
Insert into fn_lu_state (STATE_CD,STATE) values ('DC','DC - District Of Columbia');
Insert into fn_lu_state (STATE_CD,STATE) values ('DE','DE - Delaware');
Insert into fn_lu_state (STATE_CD,STATE) values ('HI','HI - Hawaii');
Insert into fn_lu_state (STATE_CD,STATE) values ('ID','ID - Idaho');
Insert into fn_lu_state (STATE_CD,STATE) values ('IL','IL - Illinois');
Insert into fn_lu_state (STATE_CD,STATE) values ('IN','IN - Indiana');
Insert into fn_lu_state (STATE_CD,STATE) values ('IA','IA - Iowa');
Insert into fn_lu_state (STATE_CD,STATE) values ('KS','KS - Kansas');
Insert into fn_lu_state (STATE_CD,STATE) values ('LA','LA - Louisiana');
Insert into fn_lu_state (STATE_CD,STATE) values ('MA','MA - Massachusetts');
Insert into fn_lu_state (STATE_CD,STATE) values ('MD','MD - Maryland');
Insert into fn_lu_state (STATE_CD,STATE) values ('ME','ME - Maine');
Insert into fn_lu_state (STATE_CD,STATE) values ('MI','MI - Michigan');
Insert into fn_lu_state (STATE_CD,STATE) values ('MN','MN - Minnesota');
Insert into fn_lu_state (STATE_CD,STATE) values ('MO','MO - Missouri');
Insert into fn_lu_state (STATE_CD,STATE) values ('MS','MS - Mississippi');
Insert into fn_lu_state (STATE_CD,STATE) values ('MT','MT - Montana');
Insert into fn_lu_state (STATE_CD,STATE) values ('NC','NC - North Carolina');
Insert into fn_lu_state (STATE_CD,STATE) values ('ND','ND - North Dakota');
Insert into fn_lu_state (STATE_CD,STATE) values ('NE','NE - Nebraska');
Insert into fn_lu_state (STATE_CD,STATE) values ('NH','NH - New Hampshire');
Insert into fn_lu_state (STATE_CD,STATE) values ('NM','NM - New Mexico');
Insert into fn_lu_state (STATE_CD,STATE) values ('NV','NV - Nevada');
Insert into fn_lu_state (STATE_CD,STATE) values ('OH','OH - Ohio');
Insert into fn_lu_state (STATE_CD,STATE) values ('OK','OK - Oklahoma');
Insert into fn_lu_state (STATE_CD,STATE) values ('OR','OR - Oregon');
Insert into fn_lu_state (STATE_CD,STATE) values ('PA','PA - Pennsylvania');
Insert into fn_lu_state (STATE_CD,STATE) values ('PR','PR - Puerto Rico');
Insert into fn_lu_state (STATE_CD,STATE) values ('RI','RI - Rhode Island');
Insert into fn_lu_state (STATE_CD,STATE) values ('SC','SC - South Carolina');
Insert into fn_lu_state (STATE_CD,STATE) values ('SD','SD - South Dakota');
Insert into fn_lu_state (STATE_CD,STATE) values ('TN','TN - Tennessee');
Insert into fn_lu_state (STATE_CD,STATE) values ('UT','UT - Utah');
Insert into fn_lu_state (STATE_CD,STATE) values ('VT','VT - Vermont');
Insert into fn_lu_state (STATE_CD,STATE) values ('WA','WA - Washington');
Insert into fn_lu_state (STATE_CD,STATE) values ('WV','WV - West Virginia');
Insert into fn_lu_state (STATE_CD,STATE) values ('WI','WI - Wisconsin');
Insert into fn_lu_state (STATE_CD,STATE) values ('WY','WY - Wyoming');
Insert into fn_lu_state (STATE_CD,STATE) values ('VI','VI-Virgin Island');

-- fn_lu_tab_set
Insert into fn_lu_tab_set (TAB_SET_CD,TAB_SET_NAME) values ('APP','Application Tabs');

-- fn_lu_timezone
Insert into fn_lu_timezone (TIMEZONE_ID,TIMEZONE_NAME,TIMEZONE_VALUE) values (10,'US/Eastern','US/Eastern');
Insert into fn_lu_timezone (TIMEZONE_ID,TIMEZONE_NAME,TIMEZONE_VALUE) values (20,'US/Central','US/Central');
Insert into fn_lu_timezone (TIMEZONE_ID,TIMEZONE_NAME,TIMEZONE_VALUE) values (30,'US/Mountain','US/Mountain');
Insert into fn_lu_timezone (TIMEZONE_ID,TIMEZONE_NAME,TIMEZONE_VALUE) values (40,'US/Arizona','America/Phoenix');
Insert into fn_lu_timezone (TIMEZONE_ID,TIMEZONE_NAME,TIMEZONE_VALUE) values (50,'US/Pacific','US/Pacific');
Insert into fn_lu_timezone (TIMEZONE_ID,TIMEZONE_NAME,TIMEZONE_VALUE) values (60,'US/Alaska','US/Alaska');
Insert into fn_lu_timezone (TIMEZONE_ID,TIMEZONE_NAME,TIMEZONE_VALUE) values (70,'US/Hawaii','US/Hawaii');

-- fn_menu
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (1, 'Root', NULL, 10, NULL, 'menu_home', 'N', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu 
	(MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (30001,'Home',                  1,     10,'dbc#',          'menu_dbc',           'Y','N/A','N/A','N/A','N/A','APP','N','icon-building-home');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (30002,'DMaaP Access Profiles', 1,     15,'dbc#/dmaap',    'menu_dbc',           'Y','N/A','N/A','N/A','N/A','APP','N','icon-building-door');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC)
	VALUES (30003,'Data Router',           1,     20,'#',             'menu_data_router',   'Y','N/A','N/A','N/A','N/A','APP','N','icon-datanetwork-softwareasaservice');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (30004,'Feeds',             30003,     10,'dbc#/dr_feed',  'menu_data_router',   'Y','N/A','N/A','N/A','N/A','APP','N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (30005,'Publishers',        30003,     25,'dbc#/dr_pub',   'menu_data_router',   'Y','N/A','N/A','N/A','N/A','APP','N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (30006,'Subscribers',       30003,     50,'dbc#/dr_sub',   'menu_data_router',   'Y','N/A','N/A','N/A','N/A','APP','N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (30007,'Message Router',        1,     25,'#',             'menu_message_router','Y','N/A','N/A','N/A','N/A','APP','N','icon-datanetwork-messaging2');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (30008,'Topics',            30007,     10,'dbc#/mr_topic', 'menu_message_router','Y','N/A','N/A','N/A','N/A','APP','N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (30009,'Clients',           30007,     20,'dbc#/mr_client','menu_message_router','Y','N/A','N/A','N/A','N/A','APP','N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (9,   'Users', 				1,  90, '#', 					'menu_profile', 	'Y', NULL, NULL, NULL, NULL, 'APP', 'N', 'icon-people-oneperson');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (930, 'Search', 				9,  15, 'dbc#/profile_search',  'menu_admin', 		'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
-- No import-profile page
-- INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
--	VALUES (92,  'Import from WEBPHONE', 9,  30, 'dbc#/post_search', 	'menu_profile_import', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (94,  'Self', 				9,  40, 'dbc#/self_profile', 	'menu_profile', 	'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (10,  'Admin', 				1, 110, '#', 					'menu_admin', 		'Y', NULL, NULL, NULL, NULL, 'APP', 'N', 'icon-controls-settingsconnectedactivity');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (101, 'Roles', 			   10,  20, 'dbc#/role_list', 		'menu_admin', 		'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (102, 'Role Functions', 	   10,  30, 'dbc#/role_function_list', 'menu_admin', 	'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (105, 'Cache Admin', 	  	   10,  40, 'dbc#/jcs_admin', 		'menu_admin', 		'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (108, 'Usage', 			   10,  80, 'dbc#/usage_list', 		'menu_admin', 		'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) 
	VALUES (150022, 'Menus', 		   10,  60, 'dbc#/admin_menu_edit', 'menu_admin', 		'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);

-- fn_restricted_url
INSERT INTO fn_restricted_url (restricted_url, function_cd) VALUES ('role.htm','menu_admin');
INSERT INTO fn_restricted_url (restricted_url, function_cd) VALUES ('role_function.htm','menu_admin');
INSERT INTO fn_restricted_url (restricted_url, function_cd) VALUES ('profile.htm','menu_profile_create');

-- fn_role
Insert into fn_role (ROLE_ID,ROLE_NAME,ACTIVE_YN,PRIORITY) values (1,'System Administrator','Y',1);
Insert into fn_role (ROLE_ID,ROLE_NAME,ACTIVE_YN,PRIORITY) values (16,'Standard User','Y',5);

-- fn_role_composite
Insert into fn_role_composite (PARENT_ROLE_ID,CHILD_ROLE_ID) values (1,16);

-- fn_role_function
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'login');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'menu_admin');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'menu_help');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'menu_home');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'menu_logout');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'menu_profile');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'menu_profile_create');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (16,'login');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (16,'menu_help');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (16,'menu_home');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (16,'menu_logout');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (16,'menu_profile');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'menu_dbc');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'menu_data_router');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (1,'menu_message_router');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (16,'menu_dbc');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (16,'menu_data_router');
Insert into fn_role_function (ROLE_ID,FUNCTION_CD) values (16,'menu_message_router');

-- fn_user
-- This row defines a superuser which is accepted by login_extern.htm
-- The superuser entry is enabled in this checked-in version, ACTIVE = Y,
Insert into fn_user 
	(USER_ID,ORG_ID,MANAGER_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,PHONE,FAX,CELLULAR,EMAIL,ADDRESS_ID,ALERT_METHOD_CD,HRID,ORG_USER_ID,ORG_CODE,LOGIN_ID,LOGIN_PWD,LAST_LOGIN_DATE,ACTIVE_YN,CREATED_ID,CREATED_DATE,MODIFIED_ID,MODIFIED_DATE,IS_INTERNAL_YN,ADDRESS_LINE_1,ADDRESS_LINE_2,CITY,STATE_CD,ZIP_CODE,COUNTRY_CD,LOCATION_CLLI,ORG_MANAGER_USERID,COMPANY,DEPARTMENT_NAME,JOB_TITLE,TIMEZONE,DEPARTMENT,BUSINESS_UNIT,BUSINESS_UNIT_NAME,COST_CENTER,FIN_LOC_CODE,SILO_STATUS) 
	values 
	(1,null,null,'Super',null,'User','973-236-0000',null,null,'user@openecomp.org',null,null,null,'su1234',null,'demo','demo123456!',str_to_date('21-AUG-14','%d-%M-%Y'),'Y',null,str_to_date('15-DEC-05','%d-%M-%Y'),1,str_to_date('21-AUG-14','%d-%M-%Y'),'N',null,null,null,'NJ',null,'US',null,null,null,null,null,10,null,null,null,null,null,null)
	;
-- This row defines a demo user to match the demo user in Portal for ONAP.
Insert into fn_user
	(USER_ID,ORG_ID,MANAGER_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,PHONE,FAX,CELLULAR,EMAIL,ADDRESS_ID,ALERT_METHOD_CD,HRID,ORG_USER_ID,ORG_CODE,LOGIN_ID,LOGIN_PWD,LAST_LOGIN_DATE,ACTIVE_YN,CREATED_ID,CREATED_DATE,MODIFIED_ID,MODIFIED_DATE,IS_INTERNAL_YN,ADDRESS_LINE_1,ADDRESS_LINE_2,CITY,STATE_CD,ZIP_CODE,COUNTRY_CD,LOCATION_CLLI,ORG_MANAGER_USERID,COMPANY,DEPARTMENT_NAME,JOB_TITLE,TIMEZONE,DEPARTMENT,BUSINESS_UNIT,BUSINESS_UNIT_NAME,COST_CENTER,FIN_LOC_CODE,SILO_STATUS) 
	values
	(1,null,null,'Demo',null,'User',null,null,null,null,null,null,null,'demo',null,'demo','demo',str_to_date('24-OCT-16','%d-%M-%Y'),'Y',null,str_to_date('17-OCT-16','%d-%M-%Y'),1,str_to_date('24-OCT-16','%d-%M-%Y'),'N',null,null,null,'NJ',null,'US',null,null,null,null,null,10,null,null,null,null,null,null)
	;

-- fn_app
-- Use name "DMAAP-BC-APP" (originally "Default")
Insert into fn_app (APP_ID,APP_NAME,APP_IMAGE_URL,APP_DESCRIPTION,APP_NOTES,APP_URL,APP_ALTERNATE_URL,APP_REST_ENDPOINT,ML_APP_NAME,ML_APP_ADMIN_ID,MOTS_ID,APP_PASSWORD,OPEN,ENABLED,THUMBNAIL,APP_USERNAME,UEB_KEY,UEB_SECRET,UEB_TOPIC_NAME) VALUES (1,'DMAAP-BC-APP','assets/images/tmp/portal1.png','Some Default Description','Some Default Note','http://www.openecomp.org','http://www.openecomp.org',null,'ECPP','?','1','okYTaDrhzibcbGVq5mjkVQ==','N','N',null,'Default',null,null,'ECOMP-PORTAL-INBOX');

-- fn_user_role
Insert into fn_user_role (USER_ID,ROLE_ID,PRIORITY,APP_ID) values (1,1,null,1);

commit;
