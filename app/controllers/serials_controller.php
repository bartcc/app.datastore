<?php
class SerialsController extends AppController {

	var $name = 'Serials';
	var $ajax_actions = array();
	/*
	var $paginate = array(
		'limit' => 50,
		'page' => 1,
		'order' => array('key' => 'asc')
	);
	*/	
	function beforeFilter() {
        //$this->Auth->allow(array('*'));
		$this->set('ajaxVersion', $this->RequestHandler->getAjaxVersion());
		
		// Protect ajax actions
		if (in_array($this->action, $this->ajax_actions)) {
			$this->verify_ajax();
		}
		parent::beforeFilter();
	}

    function  beforeRender() {
        $this->layout = 'cake_default';
        parent::beforeRender();
    }

	function start() {
		$this->paginate = array(
			'limit' => 10,
			'page' => 1,
			'order' => array('key' => 'asc')
		);
		$this->set('title_for_layout', 'Search Serials');
		$this->set('results',$this->Serial->search($this->data['Serial']['q']));
		//$this->layout = 'start';
	}
	
	function index() {
		$this->paginate = array(
			'limit' => 10,
			'page' => 1,
			'order' => array('key' => 'asc')
		);
		$this->set('title_for_layout', 'Serials List');
		$this->Serial->recursive = 0;
		$this->set('serials', $this->paginate());
	}

	function view($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid serial', true));
			$this->redirect(array('action' => 'index'));
		}
		$this->set('serial', $this->Serial->read(null, $id));
	}

	function add() {
		if (!empty($this->data)) {
			$this->Serial->create();
			if ($this->Serial->save($this->data)) {
				$this->Session->setFlash(__('The serial has been saved', true));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The serial could not be saved. Please, try again.', true));
			}
		}
		$serials = $this->Serial->find('list');
		$this->set('serials', $serials);
	}

	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid serial', true));
			$this->redirect(array('action' => 'index'));
		}
		if (!empty($this->data)) {
			if ($this->Serial->save($this->data)) {
				$this->Session->setFlash(__('The serial has been saved', true));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The serial could not be saved. Please, try again.', true));
			}
		}
		if (empty($this->data)) {
			$this->data = $this->Serial->read(null, $id);
		}
		$os = $this->Serial->Os->find('list');
		$this->set(compact('Os'));
	}

	function delete($id = null) {
		$value = false;
		if (!$id) {
			$this->Session->setFlash(__('Invalid id for serial', true));
			$this->redirect(array('action'=>'index'));
		}
		if ($this->Serial->delete($id)) {
            $this->Session->setFlash(__('Serial successfully deleted', true));
			$this->set('value', 'success');
			$this->render(SIMPLE_JSON, 'ajax');
		}
	}
	
	function search() {
		//$this->layout = 'ajax';
		$this->set('results',$this->Serial->search($this->data['Serial']['q']));
	}
}
?>