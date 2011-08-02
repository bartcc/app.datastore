<?php

/**
 * Short description for file.
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
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
 * @subpackage    cake.app
 * @since         CakePHP(tm) v 0.2.9
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/**
 * Short description for class.
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package       cake
 * @subpackage    cake.app
 */
class AppController extends Controller {

  var $helpers = array('Text', 'Utilities', 'Session', 'Asset', 'Form', 'Js' => array('prototype'), 'Paginator', 'Ajax');
  var $components = array('RequestHandler', 'Session', 'Auth', 'Acl', 'File', 'Cookie');

  //var $beforeFilter = array('checkSession');

  function beforeFilter() {
    $this->Auth->autoRedirect = false;
    $this->Auth->actionPath = 'controllers/';
    $this->Auth->authorize = 'actions';

    if ($this->RequestHandler->isAjax()) {
      $this->Auth->loginAction = array('plugin' => null, 'controller' => 'users', 'action' => 'login_ajax');
      $this->Auth->loginRedirect = array('plugin' => null, 'controller' => 'users', 'action' => 'login_ajax');
      $this->Auth->logoutRedirect = array('plugin' => null, 'controller' => 'users', 'action' => 'logout');
    } else {
      $this->Auth->loginAction = array('plugin' => null, 'controller' => 'users', 'action' => 'login');
      $this->Auth->loginRedirect = array('plugin' => null, 'controller' => 'products', 'action' => 'index');
      $this->Auth->logoutRedirect = array('plugin' => null, 'controller' => 'users', 'action' => 'login');
    }

    if ($this->action == 'retrieve_session_status') {
      //$this->redirect(array('controller' => 'users', 'action' => 'logout'));
    }

    $check = $this->Acl->check($this->Auth->user(), $this->Auth->action());
    if (!$check && !in_array($this->action, $this->Auth->allowedActions)) {

      $array1 = (!$this->Auth->user()) ?
              array(
          'id' => LOGIN_ERROR_CODE,
          'message' => 'You must login for this request !'
              ) :
              array(
          'id' => ACL_ERROR_CODE,
          'message' => 'Authorization has been refused for credentials of group<b> ' . $this->Session->read('Auth.Group.name') . '</b><br>(method: ' . $this->action . ')'
              );
      $array2 = array('user' => $this->Auth->user('name'), 'action' => $this->action, 'group' => $this->Session->read('Auth.User.group.id'));
      $status = array_merge($array1, $array2);
      //$this->log($status, 5);
      //debug($this->Session->read('Auth.Group.name'));
      $this->Session->write('Acl.error.status', $status['id']);
      $this->Session->write('Acl.error.message', $status['message']);
      $this->Session->write('Acl.error.user', $status['user']);
      $this->Session->write('Acl.error.action', $status['action']);
      $this->Session->write('Acl.error.group', $status['group']);
      if ($this->RequestHandler->isAjax()) {
        $this->redirect('/users/autherror/', $status['id']);
      }
    } else {
      $code = $this->Session->check('Auth.User') ? LOGIN_OK_CODE : LOGIN_ERROR_CODE;
      $this->Session->write('Acl.error.status', $code);
      $this->Session->write('Acl.error.group', $this->Session->read('Auth.User.group_id'));
    }

    if (!defined('MAX_SIZE')) {
      define('MAX_SIZE', $this->File->returnBytes(ini_get('upload_max_filesize')));
    }
  }

  function beforeRender() {
    if ($this->RequestHandler->isAjax())
      $this->layout = 'ajax';
    if ($this->action != 'autherror') {
      $check = $this->Acl->check($this->Auth->user(), $this->Auth->action());
      $this->Session->write('Acl.error.check', $check);
    }
  }

  ////
  // Make sure ajax calls are actual ajax calls
  ////
  function verify_ajax() {
    $this->layout = false;

    if (AJAX_CHECK) {
      if (!$this->RequestHandler->isAjax()) {
        $this->redirect("/");
        exit;
      }
    }
  }

}
