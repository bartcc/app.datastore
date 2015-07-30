#Datastore

Datastore is a CRUD SPA (Single Page Application) built on Prototype.js and CakePHP

##What can it do

Datastore was optimized to manage software product information like product name, vendor and associated serial numbers 

##Features

1. ACL (Access Control List)
2. Feedback on CRUD actions
3. Assigning product avatars (GD Support must be enabled)

##Live Demo

Check out the live [demo](http://datastore.anito.de/index.php?/) using the preconfigured credentials below:

||**username**|**password**|
|:---------|:----------|:----------|
|**SampleAdmin** *(all permissions)*|manager|manager|
|**SampleUser** *(read details)*|user|user|
|**SampleGuest** *(read overview)*|guest|guest|

#Installation

1. Checkout the Repo (this is a fairly large stack to download ~7MB in size whereof the biggest part is due to a waste of image files under webroot waiting to get cleaned up)
2. Setup the database and directory permissions
3. Configure Apache / IIS

##Database

1. Create a new MySQL database *datastore*
2. Execute datastore_default.sql on your MySQL Server
3. Under /app/config save database.php.default as database.php, set your MySQL host, login and password as necessary

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