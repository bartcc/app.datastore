#INSTALLATION INSTRUCTIONS FOR DATASTORE APP

##DATABASE

create a new MySQL database 'datastore'

execute datastore_default.sql found under app/config in order to create all tables required by the application
the following users are preinstalled:


||USER|PASSWORD|
|:---------|----------:|:----------:|
|SampleAdmin|manager|manager|
|SampleUser|user|user|
|SampleGuest|guest|guest|


:    admin       admin
SampleManager:  manager     manager
SampleUser:     user        user
SampleGuest:    guest       guest

##DIRECTORY PERMISSIONS

the following directories must have read/write permissions for these users:
IIS_WPG (IIS 6.0) or _www (Apache)

1. /app/tmp (CakePHP's internal tmp directory)
2. /uploads (to enable the upload feature for icon images)

##RUNNING DATASTORE UNDER IIS

1. core.php is configured to be used on Apache web server by default
2. to use with IIS, uncomment the App.baseUrl in core.php under /app/config directory
3. the folder /app/webroot must be set as home directory in IIS Admin

##RUNNING DATASTORE UNDER APACHE

1. core.php is configured to be used on Apache web server by default
2. mod_rewrite must be enabled
