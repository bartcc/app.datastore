INSTALLATION INSTRUCTIONS FOR DATASTORE APP

DATABASE
========
create a new MySQL database 'datastore'

execute datastore_default.sql found under app/config in order to create all tables required by the application
the following users are preinstalled:

                USER        PASSWORD
SampleAdmin:    admin       admin
SampleManager:  manager     manager
SampleUser:     user        user
SampleGuest:    guest       guest

DIRECTORY PERMISSIONS
=====================
the following directories must have write permissions for these users:
IIS_WPG (IIS 6.0) or _www (Apache)

root/uploads (to enable DATASTORE's upload feature for icon images)
root/app/tmp (CakePHP's internal tmp directory)

RUNNING DATASTORE UNDER IIS
===========================
core.php is configured to be used on IIS by default
the folder root/app/webroot must be set as home directory in IIS Admin

RUNNING DATASTORE UNDER APACHE
==============================
to use DATASTORE under Apache and benefit from pretty url's comment out the following line in root/app/config/core.php:
Configure::write('App.baseUrl', env('SCRIPT_NAME') . '?');
to look like so:
// Configure::write('App.baseUrl', env('SCRIPT_NAME') . '?');
mod_rewrite must be enabled
