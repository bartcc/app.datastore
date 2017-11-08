<?php

class GitsController extends AppController {

  var $name = 'Gits';
  var $helpers = array();
  var $uses = array();

  function beforeFilter() {
    $this->autoRender = FALSE;
    $this->Auth->allowedActions = array('exec');
    parent::beforeFilter();
  }

  function exec() {
    $allowed_commands = array('checkout', 'status', 'pull', 'show-branch');
    
    $action = array_splice($this->passedArgs, 0, 1);
    
    if(!empty($action[0])) {
        $action = $action[0];
    } else {
      echo 'no command found';
      die(' ');
    }
    
    $args = implode(' ', $this->passedArgs);
    
    if(!in_array($action, $allowed_commands)) {
      echo 'command not in list of allowed commands';
      die(' ');
    }
    
    //$func = $action;
    //if(method_exists($this, $func)) {
      //$git = $this->git($action, $args);
      //$this->log($git, LOG_DEBUG);
    //}
    
    // execute command
    $git = $this->git($action, $args);
    echo $git;
    die(' ');
  }
  
  function git($action, $args = '') {
    $op = `git $action $args 2>&1`;
    return $op;
  }
}
