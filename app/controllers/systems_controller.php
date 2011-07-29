<?php
class SystemsController extends AppController {

	var $name = 'Systems';

	function  beforeFilter() {
        //$this->Auth->allow(array('*'));
		parent::beforeFilter();
	}

	function  beforeRender() {
		$this->layout = 'cake_default';
		Configure::write('debug', 0);
		parent::beforeRender();
	}

	function index() {
		$this->System->recursive = 0;
		$this->set('systems', $this->paginate());
	}

	function view($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid system', true));
			$this->redirect(array('action' => 'index'));
		}
		$this->set('system', $this->System->read(null, $id));
	}

	function add() {
		if (!empty($this->data)) {
			$this->System->create();
			if ($this->System->save($this->data)) {
				$this->Session->setFlash(__('The system has been saved', true));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The system could not be saved. Please, try again.', true));
			}
		}
	}

	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid system', true));
			$this->redirect(array('action' => 'index'));
		}
		if (!empty($this->data)) {
			if ($this->System->save($this->data)) {
				$this->Session->setFlash(__('The system has been saved', true));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The system could not be saved. Please, try again.', true));
			}
		}
		if (empty($this->data)) {
			$this->data = $this->System->read(null, $id);
		}
	}

	function delete($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid id for system', true));
			$this->redirect(array('action'=>'index'));
		}
		if ($this->System->delete($id)) {
			$this->Session->setFlash(__('System deleted', true));
			$this->redirect(array('action'=>'index'));
		}
		$this->Session->setFlash(__('System was not deleted', true));
		$this->redirect(array('action' => 'index'));
	}
}
?>