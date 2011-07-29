<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$subdomainparts = explode('.', env('HTTP_HOST'));
if(!defined('SUBDOMAIN') && count($subdomainparts) == 3) {
    define('SUBDOMAIN', $subdomainparts[0]);
} else {
    define('SUBDOMAIN', 'datastore');
}
if(defined(SUBDOMAIN)) {
    $db = SUBDOMAIN;
}
?>
