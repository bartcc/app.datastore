#Datastore

Datastore is a CRUD SPA (Single Page Application) built on Prototype.js and CakePHP

##What can it do

Datastore was optimized to manage software product information like productname, vendor and associated serialnumbers 

##Features

1. ACL (Access Control List)
2. Feedback on CRUD actions
3. Assigning product avatars (GD Support must be enabled)

##Live Demo

Check out the live [demo](http://datastore.anito.de)

using the preconfigured credentials below

||###### username #####|##### password #####|
|:---------|:----------|:----------|
|SampleAdmin|manager|manager|
|SampleUser|user|user|
|SampleGuest|guest|guest|

#Installation

1. Checkout the Repo
2. Setup the database and directory permissions
3. Configure Apache / IIS

##Database

create a new MySQL database 'datastore'

execute datastore_default.sql found under app/config in order to create all tables required by the application
the following users are preinstalled:

##Directory permissions

The following directories must have read/write permissions for these users:
    IIS_WPG (IIS 6.0) or _www (Apache)

1. /app/tmp (CakePHP's internal tmp directory)
2. /uploads (to enable the upload feature for icon images)

##IIS setup

1. core.php is configured to be used on Apache web server by default
2. to use with IIS, uncomment the App.baseUrl in core.php under /app/config directory
3. the folder /app/webroot must be set as home directory in IIS Admin

##Apache setup

1. core.php is configured to be used on Apache web server by default
2. mod_rewrite must be enabled
3. the home folder should be set to the root directory

#Screenshot

![Datastore](https://lh5.googleusercontent.com/-Qcaw9fGaaXs/TjLNnZCNjaI/AAAAAAAAADw/H3v7iszG-sk/s576/datastore.png)