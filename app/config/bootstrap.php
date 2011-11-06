<?php

/**
 * This file is loaded automatically by the app/webroot/index.php file after the core bootstrap.php
 *
 * This is an application wide file to load any function that is not used within a class
 * define. You can also use this to include or require any files in your application.
 *
 * PHP versions 4 and 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright 2005-2010, Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright 2005-2010, Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       cake
 * @subpackage    cake.app.config
 * @since         CakePHP(tm) v 0.10.8.2117
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
/**
 * The settings below can be used to set additional paths to models, views and controllers.
 * This is related to Ticket #470 (https://trac.cakephp.org/ticket/470)
 *
 * App::build(array(
 *     'plugins' => array('/full/path/to/plugins/', '/next/full/path/to/plugins/'),
 *     'models' =>  array('/full/path/to/models/', '/next/full/path/to/models/'),
 *     'views' => array('/full/path/to/views/', '/next/full/path/to/views/'),
 *     'controllers' => array('/full/path/to/controllers/', '/next/full/path/to/controllers/'),
 *     'datasources' => array('/full/path/to/datasources/', '/next/full/path/to/datasources/'),
 *     'behaviors' => array('/full/path/to/behaviors/', '/next/full/path/to/behaviors/'),
 *     'components' => array('/full/path/to/components/', '/next/full/path/to/components/'),
 *     'helpers' => array('/full/path/to/helpers/', '/next/full/path/to/helpers/'),
 *     'vendors' => array('/full/path/to/vendors/', '/next/full/path/to/vendors/'),
 *     'shells' => array('/full/path/to/shells/', '/next/full/path/to/shells/'),
 *     'locales' => array('/full/path/to/locale/', '/next/full/path/to/locale/')
 * ));
 *
 */
/**
 * As of 1.3, additional rules for the inflector are added below
 *
 * Inflector::rules('singular', array('rules' => array(), 'irregular' => array(), 'uninflected' => array()));
 * Inflector::rules('plural', array('rules' => array(), 'irregular' => array(), 'uninflected' => array()));
 *
 */
define('WEB_URL', '/' . APP_DIR . '/' . WEBROOT_DIR);

if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
  $protocol = 'https://';
} else {
  $protocol = 'http://';
}
define('BASE_URL', Configure::read('App.baseUrl'));
define('DIR_REL_HOST', str_replace('/index.php?', '', BASE_URL));
define('DIR_HOST', $protocol . preg_replace('/:80$/', '', env('HTTP_HOST')) . DIR_REL_HOST);
$subdomainparts = explode('.', env('HTTP_HOST'));
if (!defined('SUBDOMAIN')) {
  define('SUBDOMAIN', $subdomainparts[0]);
}
define('DATA_VERSION_FULL', '1.0.0.1000');
$parts = explode('.', DATA_VERSION_FULL);
define('DATA_VERSION', $parts[0] . '.' . $parts[1] . '.' . $parts[2] . ' (Build ' . $parts[3] . ')');
define('EMPTY_SEARCH_TEXT', 'Filter');
define('SEARCH_MODE_FULL', 'all');
if (!defined('UPLOADS_DIR')) {
  define('UPLOADS_DIR', 'uploads');
}

define('UPLOADS', ROOT . DS . UPLOADS_DIR);
define('PRODUCTIMAGES', UPLOADS . DS . 'product_images' . DS . SUBDOMAIN);

if (!defined('AJAX_CHECK')) {
  define('AJAX_CHECK', true);
}
if (!defined('ACL_ERROR_PAGE')) {
  define('ACL_ERROR_PAGE', '/elements/acl_error_page');
}
if (!defined('SIMPLE_JSON')) {
  define('SIMPLE_JSON', '/elements/simple_json');
}
if (!defined('LOGIN_ERROR_CODE')) {
  define('LOGIN_ERROR_CODE', 403);
}
if (!defined('LOGIN_OK_CODE')) {
  define('LOGIN_OK_CODE', 200);
}
if (!defined('ACL_ERROR_CODE')) {
  define('ACL_ERROR_CODE', 401);
}
if (!defined('NO_ID')) {
  define('NO_ID', '__noid__');
}
if (!defined('INVALID_ID')) {
  define('INVALID_ID', '__invalidid__');
}
if (!defined('DR')) {
  define('DR', '||');
}
if (!defined('SALT')) {
  define('SALT', 'urrasjksdjkbsdakbjvgikjbgfiabrg');
}

function pre() {
  $args = func_get_args();
  foreach ($args as $arg) {
    pr($arg);
  }
}

function __p($options) {
  $defaults = array(
      'src' => '',
      'id' => null,
      'width' => 180,
      'height' => 150,
      'quality' => 70,
      'square' => 1, // 1 => new Size ; 2 => old Size, 3 => aspect ratio
      'sharpening' => 1,
      'anchor_x' => 50,
      'anchor_y' => 50,
      'force' => false
  );
  $o = array_merge($defaults, $options);
  $args = join(',', array($o['src'], $o['id'], $o['width'], $o['height'], $o['quality'], $o['square'], $o['sharpening'], $o['anchor_x'], $o['anchor_y'], (int) $o['force']));
  include_once(ROOT . DS . 'app' . DS . 'controllers' . DS . 'components' . DS . 'salt.php');
  $salt = new SaltComponent();
  $crypt = $salt->convert($args);
  $path = PRODUCTIMAGES . DS . $o['id'] . DS . $o['src'];
  $m = filemtime($path);
  return BASE_URL . '/q/a:' . $crypt . '/m:' . $m;
}

function computeSize($file, $new_w, $new_h, $scale) {
  $dims = getimagesize($file);
  $old_x = $dims[0];
  $old_y = $dims[1];
  $original_aspect = $old_x / $old_y;
  $new_aspect = $new_w / $new_h;
  if ($scale == 2) {
    $x = $old_x;
    $y = $old_y;
  } else if ($scale == 1) {
    $x = $new_w;
    $y = $new_h;
  } else {
    if ($original_aspect >= $new_aspect) {
      if ($new_w > $old_x) {
        $x = $old_x;
        $y = $old_y;
      }
      $x = $new_w;
      $y = ($new_w * $old_y) / $old_x;
    } else {
      if ($new_h > $old_y) {
        $x = $old_x;
        $y = $old_y;
      }
      $x = ($new_h * $old_x) / $old_y;
      $y = $new_h;
    }
  }
  return array($x, $y);
}

// Bring in customized configuration
//if(require_once(ROOT . DS . 'config' . DS . 'config.php')) {
    //define('DIR_DB', $db);
//}
