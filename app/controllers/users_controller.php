<?php
class UsersController extends AppController {

	var $name = 'Users';
	var $ajax_actions = array('refresh_header', 'autherror', 'get_title', 'retrieve_session_status', 'login_ajax');

	function  beforeFilter() {
		$this->disableCache();
        $this->ajax_actions = array('login');
        // IMPORTANT: DON'T use Auth->allow(array(...))
//		$this->Auth->allowedActions = array('refresh_header', 'retrieve_session_status', 'logout', 'login', 'login_ajax', 'autherror', 'login_ajax', 'build_acl', 'init_db');
		$this->Auth->allowedActions = array('refresh_header', 'retrieve_session_status', 'logout', 'login', 'login_ajax', 'autherror', 'login_ajax');

        if(!empty($this->data)) {
            // for the Auth from form
			$user = $this->User->findByUsername($this->data['User']['username']);
		} else if($this->Auth->user()){
            // for the Auth from the cookie
            $user = $this->User->findByUsername($this->Auth->user('name'));
        }
		if(isset($user) && !$this->Session->check('Auth.Group.name')) {
			//$this->set('user', $user);
			$this->Session->write('Auth.Group.name', $user['Group']['name']);
        }
		
		// Protect ajax actions
		if (in_array($this->action, $this->ajax_actions)) {
			//$this->verify_ajax();
		}

        $this->Cookie->name = 'DATASTORE';
        $this->Cookie->time = 3600; // 1 hour

        parent::beforeFilter();
	}
	
	function  beforeRender() {
		$this->layout = 'cake_default';
        Configure::write('debug', 0);
		parent::beforeRender();
	}

	function hash() {
		App::import('Core', 'Security');
		echo Security::hash('kakadax', null, true);
	}

    function login_ajax() {
        $user = $this->Auth->user();
        if(!$user) {
            $this->Session->write('Acl.error.status', $this->Auth->user());
        }
		$this->set('value', $user);

		if ($this->Auth->user()) {
			$this->User->id = $this->Auth->user('id');
            $this->Session->write('Acl.error.status', LOGIN_OK_CODE);
			if($this->User->saveField('lastlogin', date('Y-m-d H:i:s'))) {
                $this->Session->setFlash(sprintf("Welcome %s", $this->Auth->user('name')));
            } else {
                $this->Session->setFlash(sprintf("User's %s logintime could not be saved !", $this->Auth->user('name')), null);
            }
		} else {
            $this->Session->setFlash(__('Login failed. Try again !', true), null);
        }
        $this->render('/elements/login_ajax', 'ajax');
    }

    function login() {
        $this->set('title_for_layout', 'Login');
        if ($this->Auth->user() && !$this->params['isAjax']) {
            // delete old cookie from different user
            $cookie = $this->Cookie->read('Auth.User');
            if(!is_null($cookie)) {
                if ($this->Cookie->read('Auth.User.username' != $this->Auth->user('name'))) {
					$this->Cookie->delete('Auth.User');
				}
            }
            $this->redirect($this->Auth->redirect());
        }
        
        if (empty($this->data)) {
			$cookie = $this->Cookie->read('Auth.User');
			if (!is_null($cookie)) {
				if ($this->Auth->login($cookie)) {
					//  Clear auth message, just in case we use it.
					$this->Session->delete('Message.auth');
					$this->redirect($this->Auth->redirect());
				} else {
                    $this->Cookie->delete('Auth.User');
                }
			}
            $this->render(null, 'simple');
		}
        
        if(!empty($this->data) && $this->params['isAjax']) {
            if($this->Auth->login($this->data)) {
                if (!empty($this->data['User']['reminder'])) {
                    $cookie = array();
                    $cookie['username'] = $this->data['User']['username'];
                    $cookie['password'] = $this->data['User']['password'];
                    $this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');
                    unset($this->data['User']['reminder']);
                }
                $this->set('value', array('success' => true));
            } else {
                $this->set('value', array('success' => false));
            }
            $this->render('/elements/json', 'ajax');
        }
            
	}

    function refresh_header() {
        $this->Session->setFlash($this->Session->read('Acl.error.message'), null);
        $this->login_ajax();
    }

    function logout() {
        $cookie = $this->Cookie->read('Auth.User');
        if (!is_null($cookie)) {
            $this->Cookie->delete('Auth.User');
        }
		$this->Session->destroy();
		if($this->params['isAjax']) {
            $this->Auth->logout();
            $this->Session->setFlash(__('You were logged out successfully', true), null);
        } else {
            $this->Session->setFlash(__('Please log in'));
            $this->redirect($this->Auth->logout());
        }

	}

    function retrieve_session_status() {
		$this->set('value', $this->Session->read('Acl.error'));
        $this->render(SIMPLE_JSON, 'ajax');
	}
    
	function index() {
		$this->User->recursive = 0;
		$this->set('users', $this->paginate());
	}

	function view($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid user', true));
			$this->redirect(array('action' => 'index'));
		}
		$this->set('user', $this->User->read(null, $id));
	}

	function add() {
		if (!empty($this->data)) {
			$this->User->create();
			if ($this->User->save($this->data)) {
				$this->Session->setFlash(__('The user has been saved', true));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The user could not be saved. Please, try again.', true));
			}
		}
		$groups = $this->User->Group->find('list');
		$this->set(compact('groups'));
	}

	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid user', true));
			$this->redirect(array('action' => 'index'));
		}
		if (!empty($this->data)) {
			if ($this->User->save($this->data)) {
				$this->Session->setFlash(__('The user has been saved', true));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The user could not be saved. Please, try again.', true));
			}
		}
		if (empty($this->data)) {
			$this->data = $this->User->read(null, $id);
		}
		$groups = $this->User->Group->find('list');
		$this->set(compact('groups'));
	}

	function delete($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid id for user', true));
			$this->redirect(array('action'=>'index'));
		}
		if ($this->User->delete($id)) {
			$this->Session->setFlash(__('User deleted', true));
			$this->redirect(array('action'=>'index'));
		}
		$this->Session->setFlash(__('User was not deleted', true));
		$this->redirect(array('action' => 'index'));
	}

	function autherror() {
		$value = array(
			'status' => $this->Session->read('Acl.error.status'),
			'message' => $this->Session->read('Acl.error.message'),
			'user' => $this->Session->read('Acl.error.user'),
			'action' => $this->Session->read('Acl.error.action'),
			);
		$this->set('value', $value);
		$this->render(SIMPLE_JSON, 'ajax');
        $this->Session->delete('Acl.error');
	}

    function build_acl() {
		if (!Configure::read('debug')) {
			return $this->_stop();
		}
		$log = array();

		$aco =& $this->Acl->Aco;
		$root = $aco->node('controllers');
		if (!$root) {
			$aco->create(array('parent_id' => null, 'model' => null, 'alias' => 'controllers'));
			$root = $aco->save();
			$root['Aco']['id'] = $aco->id;
			$log[] = 'Created Aco node for controllers';
		} else {
			$root = $root[0];
		}

		App::import('Core', 'File');
		$Controllers = Configure::listObjects('controller');
		$appIndex = array_search('App', $Controllers);
		if ($appIndex !== false ) {
			unset($Controllers[$appIndex]);
		}
		$baseMethods = get_class_methods('Controller');
		//$baseMethods[] = 'build_acl';
		$Plugins = $this->_getPluginControllerNames();
		$Controllers = array_merge($Controllers, $Plugins);

		// look at each controller in app/controllers
		foreach ($Controllers as $ctrlName) {
			$methods = $this->_getClassMethods($this->_getPluginControllerPath($ctrlName));

			// Do all Plugins First
			if ($this->_isPlugin($ctrlName)){
				$pluginNode = $aco->node('controllers/'.$this->_getPluginName($ctrlName));
				if (!$pluginNode) {
					$aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $this->_getPluginName($ctrlName)));
					$pluginNode = $aco->save();
					$pluginNode['Aco']['id'] = $aco->id;
					$log[] = 'Created Aco node for ' . $this->_getPluginName($ctrlName) . ' Plugin';
				}
			}
			// find / make controller node
			$controllerNode = $aco->node('controllers/'.$ctrlName);
			if (!$controllerNode) {
				if ($this->_isPlugin($ctrlName)){
					$pluginNode = $aco->node('controllers/' . $this->_getPluginName($ctrlName));
					$aco->create(array('parent_id' => $pluginNode['0']['Aco']['id'], 'model' => null, 'alias' => $this->_getPluginControllerName($ctrlName)));
					$controllerNode = $aco->save();
					$controllerNode['Aco']['id'] = $aco->id;
					$log[] = 'Created Aco node for ' . $this->_getPluginControllerName($ctrlName) . ' ' . $this->_getPluginName($ctrlName) . ' Plugin Controller';
				} else {
					$aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $ctrlName));
					$controllerNode = $aco->save();
					$controllerNode['Aco']['id'] = $aco->id;
					$log[] = 'Created Aco node for ' . $ctrlName;
				}
			} else {
				$controllerNode = $controllerNode[0];
			}

			//clean the methods. to remove those in Controller and private actions.
			foreach ($methods as $k => $method) {
				if (strpos($method, '_', 0) === 0) {
					unset($methods[$k]);
					continue;
				}
				if (in_array($method, $baseMethods)) {
					unset($methods[$k]);
					continue;
				}
				$methodNode = $aco->node('controllers/'.$ctrlName.'/'.$method);
				if (!$methodNode) {
					$aco->create(array('parent_id' => $controllerNode['Aco']['id'], 'model' => null, 'alias' => $method));
					$methodNode = $aco->save();
					$log[] = 'Created Aco node for '. $method;
				}
			}
		}
		if(count($log)>0) {
			debug($log);
		}
	}

	function _getClassMethods($ctrlName = null) {
		App::import('Controller', $ctrlName);
		if (strlen(strstr($ctrlName, '.')) > 0) {
			// plugin's controller
			$num = strpos($ctrlName, '.');
			$ctrlName = substr($ctrlName, $num+1);
		}
		$ctrlclass = $ctrlName . 'Controller';
		$methods = get_class_methods($ctrlclass);

		// Add scaffold defaults if scaffolds are being used
		$properties = get_class_vars($ctrlclass);
		if (array_key_exists('scaffold',$properties)) {
			if($properties['scaffold'] == 'admin') {
				$methods = array_merge($methods, array('admin_add', 'admin_edit', 'admin_index', 'admin_view', 'admin_delete'));
			} else {
				$methods = array_merge($methods, array('add', 'edit', 'index', 'view', 'delete'));
			}
		}
		return $methods;
	}

	function _isPlugin($ctrlName = null) {
		$arr = String::tokenize($ctrlName, '/');
		if (count($arr) > 1) {
			return true;
		} else {
			return false;
		}
	}

	function _getPluginControllerPath($ctrlName = null) {
		$arr = String::tokenize($ctrlName, '/');
		if (count($arr) == 2) {
			return $arr[0] . '.' . $arr[1];
		} else {
			return $arr[0];
		}
	}

	function _getPluginName($ctrlName = null) {
		$arr = String::tokenize($ctrlName, '/');
		if (count($arr) == 2) {
			return $arr[0];
		} else {
			return false;
		}
	}

	function _getPluginControllerName($ctrlName = null) {
		$arr = String::tokenize($ctrlName, '/');
		if (count($arr) == 2) {
			return $arr[1];
		} else {
			return false;
		}
	}

/**
 * Get the names of the plugin controllers ...
 *
 * This function will get an array of the plugin controller names, and
 * also makes sure the controllers are available for us to get the
 * method names by doing an App::import for each plugin controller.
 *
 * @return array of plugin names.
 *
 */
	function _getPluginControllerNames() {
		App::import('Core', 'File', 'Folder');
		$paths = Configure::getInstance();
		$folder =& new Folder();
		$folder->cd(APP . 'plugins');

		// Get the list of plugins
		$Plugins = $folder->read();
		$Plugins = $Plugins[0];
		$arr = array();

		// Loop through the plugins
		foreach($Plugins as $pluginName) {
			// Change directory to the plugin
			$didCD = $folder->cd(APP . 'plugins'. DS . $pluginName . DS . 'controllers');
			// Get a list of the files that have a file name that ends
			// with controller.php
			$files = $folder->findRecursive('.*_controller\.php');

			// Loop through the controllers we found in the plugins directory
			foreach($files as $fileName) {
				// Get the base file name
				$file = basename($fileName);

				// Get the controller name
				$file = Inflector::camelize(substr($file, 0, strlen($file)-strlen('_controller.php')));
				if (!preg_match('/^'. Inflector::humanize($pluginName). 'App/', $file)) {
					if (!App::import('Controller', $pluginName.'.'.$file)) {
						debug('Error importing '.$file.' for plugin '.$pluginName);
					} else {
						/// Now prepend the Plugin name ...
						// This is required to allow us to fetch the method names.
						$arr[] = Inflector::humanize($pluginName) . "/" . $file;
					}
				}
			}
		}
		return $arr;
	}

	function init_db() {
        Configure::write('debug', 2);
        $this->autoRender = false;
		$group =& $this->User->Group;
        
		//Allow Admins to everything
		$group->id = 1;
		$this->Acl->allow($group, 'controllers');

		// Managers
		$group->id = 2;
		$this->Acl->deny($group, 'controllers');
		$this->Acl->allow($group, 'controllers/Products/add');
		$this->Acl->allow($group, 'controllers/Products/view');
		$this->Acl->allow($group, 'controllers/Products/index');
		$this->Acl->allow($group, 'controllers/Products/get_title');
		$this->Acl->allow($group, 'controllers/Products/duplicate');
		$this->Acl->allow($group, 'controllers/Products/ajax_edit');
		$this->Acl->allow($group, 'controllers/Products/ajax_coll_view');
		$this->Acl->allow($group, 'controllers/Products/ajax_coll_edit');
		$this->Acl->allow($group, 'controllers/Products/ajax_serial_count');
		$this->Acl->allow($group, 'controllers/Products/avatar_uri');
		$this->Acl->allow($group, 'controllers/Products/reset_avatar');
		$this->Acl->allow($group, 'controllers/Products/delete');
		$this->Acl->allow($group, 'controllers/Serials/delete');
		$this->Acl->allow($group, 'controllers/Uploads/avatar');

		// Users
		$group->id = 3;
		$this->Acl->deny($group, 'controllers');
		$this->Acl->allow($group, 'controllers/Products/index');
		$this->Acl->allow($group, 'controllers/Products/view');
		$this->Acl->allow($group, 'controllers/Products/ajax_coll_view');

		//Guests
		$group->id = 4;
		$this->Acl->deny($group, 'controllers');
		$this->Acl->allow($group, 'controllers/Products/index');
        //we add an exit to avoid an ugly "missing views" error message
        echo "all done";
        exit;
    }
}

?>