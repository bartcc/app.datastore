<?php

class ProductsController extends AppController {

  var $name = 'Products';
  var $components = array('RequestHandler');
  var $ajax_actions = array('duplicate', 'add', 'ajax_coll_edit', 'ajax_coll_view', 'ajax_edit', 'ajax_serial_count', 'delete', 'edit', 'view', 'avatar_uri', 'clear_avatar');

  function beforeFilter() {
    $this->Auth->allowedActions = array('ajax_coll_view', 'product_editor_error', 'load_upload_dialogue', 'render_table_row', 'exit_uploader');
    // Protect ajax actions
    if (in_array($this->action, $this->ajax_actions)) {
      //$this->verify_ajax();
    }

    $this->Cookie->name = 'DATASTORE';
    $this->Cookie->time = 3600; // 1 hour

    parent::beforeFilter();
  }

  function beforeRender() {
    parent::beforeRender();
  }

  function index() {
    //$this->log($this->params, LOG_DEBUG);
    $page = 1;
    $limit = 5;
    $query = null;
    $cookie = null;
    $newpage = null;
    $invalid_cookie = false;
    $default_sort = 'title';
    $default_direction = 'asc';
    $activeRecordPage = null;
    if (isset($this->params['form']['limit'])) {
      $formlimit = $this->params['form']['limit'];
      $cookie['rows'] = $formlimit;
      $invalid_cookie = true;
    } else if (is_null($this->Cookie->read('Auth.User.rows'))) {
      $cookie['rows'] = $limit;
      $invalid_cookie = true;
    }
    if ($invalid_cookie && $this->Auth->user()) {
      $this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');
    }
    $cookie = $this->Cookie->read('Auth.User.rows');
    $limit = !is_null($cookie) ? (int) $cookie : $limit;
    $page = isset($this->params['named']['page']) ? $this->params['named']['page'] : $page;

    if (isset($this->data['Product']['clearquery'])) {
      if ($this->data['Product']['clearquery'] == 'true') {
        $this->Session->write('Auth.User.clearquery', 'true');
        $this->Session->delete('Auth.User.querykey');
      }
    } else if (!empty($this->data['Product']['query'])) {
      if ($this->data['Product']['query'] != EMPTY_SEARCH_TEXT) {
        $query = $this->data['Product']['query'];
        $this->Session->write('Auth.User.querykey', $query);
      }
    }

    $query = $this->Session->check('Auth.User.querykey') ? $this->Session->read('Auth.User.querykey') : "%";

    $conditions = array('OR' =>
        array(
            'Product.title LIKE' => '%' . $query . '%',
            'Product.company LIKE' => '%' . $query . '%',
            'System.name LIKE' => '%' . $query . '%',
            'System.name LIKE' => '%' . $query . '%',
            
        ), 'AND' =>
        array(
            'Product.user_id =' => $this->Auth->user('id')
        )
    );

    if (!$this->Session->check('Auth.User.activeRecordId')) {
      $this->Session->write('Auth.User.activeRecordId', NO_ID);
    } elseif (!empty($this->data['Product']['neighbors'])) {
      $this->Session->write('Auth.User.activeRecordId', INVALID_ID);
    }
    $activeRecordId = $this->Session->read('Auth.User.activeRecordId');

    $named_sort = isset($this->params['named']['sort']) ? $this->params['named']['sort'] : $default_sort;
    $named_direction = isset($this->params['named']['direction']) ? $this->params['named']['direction'] : $default_direction;

    $this->Session->write('params.named.sort', $named_sort);
    $this->Session->write('params.named.direction', $named_direction);

    $paging_options_default = array('order' => array($default_sort => $default_direction), 'limit' => $limit, 'page' => $page, 'conditions' => $conditions);
    $paging_options_named = array('order' => array($named_sort => $named_direction), 'limit' => $limit, 'page' => $page, 'conditions' => $conditions);
    $paging_options_merged = array_merge($paging_options_default, $paging_options_named);
    $paging_options_merged_short = array_intersect_key($paging_options_merged, array('order' => null, 'conditions' => null));

    if ($activeRecordId != NO_ID && $activeRecordId != INVALID_ID) {
      $prod = $this->Product->find('all', $paging_options_merged_short);
      $id_pos = $this->_my_array_search(array('id' => $activeRecordId), $prod);
      $activeRecordPage = ceil($id_pos / $limit);
      if (!isset($this->params['named']['page'])) {
        $page = $activeRecordPage;
      }
    }

    // Mix in the corrected page
    $this->paginate = array_merge($paging_options_merged, array('page' => $page));

    // Bring in depending models
    $this->Product->recursive = 1;
    $this->set('products', $this->paginate());
    $this->set('title_for_layout', 'Application Listing');
    $this->set(compact('limit', 'query'));

    $this->Session->write('url.url', $this->params['url']['url']);
    $this->Session->write('url.page', $page);
    $this->Session->write('url.activeRecordPage', 'page:' . $activeRecordPage);
    // The action renders it's default index page (/products/index) on it's first request (GET)
    if ($this->params['isAjax']) {
      $this->render('/elements/products_index', 'ajax');
    }
  }

  private function _my_array_search($needle, $haystack) {
    if (empty($needle) || empty($haystack)) {
      return false;
    }

    foreach ($haystack as $key => $value) {
      $exists = 0;
      foreach ($needle as $nkey => $nvalue) {
        if (!empty($value['Product'][$nkey]) && $value['Product'][$nkey] == $nvalue)
          return $key + 1;
      }
    }
    return false;
  }

  function render_table_row($id) {
    $this->layout = 'ajax';
    $product = $this->Product->read(null, $id);
    $this->set('product', $product);
  }

  function ajax_serial_count($id) {
    $this->autoRender = false;
    $this->Product->id = $id;
    $id_pos = $this->Product->Serial->find('count', array(
        'conditions' => array('product_id =' => $id)
            ));
    $this->set('value', String::insert('( :count Items )', array('count' => $id_pos)));
    $this->render('/elements/simple_ajax', 'ajax');
  }

  function get_title($id = null) {
    if (!$id) {
      $this->Session->setFlash(__('Invalid product', true));
    }
    $this->set('product', $this->Product->read(null, $id));
    if ($this->params['isAjax']) {
      Configure::write('debug', 0);
      $this->render('/elements/products_title', 'ajax');
    }
  }

  function view($id = null) {
    if (!$id) {
      $this->Session->setFlash(__('Invalid product', true));
      $this->redirect(array('action' => 'index'));
    } else {
      $this->Session->write('Auth.User.activeRecordId', $id);
    }
    // for inplacecollectioneditor
    $systems = $this->Product->System->find('list');
    $this->Product->recursive = 1;
    $this->set('product', $this->Product->read(null, $id));
    if ($this->params['isAjax']) {
      Configure::write('debug', 0);
      $this->render();
    } else {
      $this->render('/elements/welcome', 'ajax');
    }
  }

  function add() {
    $this->autoRender = false;
    if (!empty($this->data)) {
      $this->Session->write('Auth.User.productaddoption', $this->data['Product']['Use']);
      $this->data['Product']['user_id'] = $this->Auth->user('id');
      $this->Product->create();
      if ($this->Product->save($this->data)) {
        $this->Session->setFlash(__('Product successfully added', true), 'flash_message');
        $this->set('value', array('product' => array('id' => $this->Product->id, 'message' => 'Product successfully saved.', 'option' => $this->data['Product']['Use'])));
        $this->Session->write('Auth.User.activeRecordId', $this->Product->id);
        $this->render(SIMPLE_JSON);
      } else {
        $value = $this->Product->invalidFields();
        $id = 'new';
        foreach ($value as $field => $error) {
          $html = $this->requestAction('products/product_editor_error/' . $id . '/' . $field . '/' . $error, array('return'));
          $value = array_merge($value, array($field => array('error' => $error, 'html' => $html, 'id' => $id)));
        }
        $this->Session->setFlash(__('Validation for new product failed', true), 'flash_message');
        $this->set(compact('value'));
        $this->header("HTTP/1.1 500 Internal Server Error");
        $this->render(SIMPLE_JSON);
      }
    } else {
      $systems = $this->Product->System->find('list');
      $this->set(compact('systems'));
      $this->render();
    }
  }

  function delete($id = null) {
    $this->autoRender = false;
    if (!$id) {
      exit;
    }
    if ($this->Product->delete($id)) {
      $this->reset_avatar($id);
      if ($this->Session->read('Auth.User.activeRecordId') == $id) {
        $this->Session->write('Auth.User.activeRecordId', NO_ID);
      }
      $this->set('value', 'success');
      $this->Session->setFlash(__('Product successfully deleted', true), 'flash_message');
    } else {
      $this->set('value', 'failed');
      $this->Session->setFlash(__('Could not delete Product', true));
    }
    $this->render(SIMPLE_JSON);
  }

  function duplicate($id) {
    $this->autoRender = false;
    if (!$id)
      return;
    $this->Product->recursive = 1;
    $data = $this->Product->read(array('title', 'company', 'system_id', 'notes'), $id);
    unset($data['Product']['id']);
    $data['Product']['title'] .= ' [duplicated]';
    $data['Product']['user_id'] = $this->Auth->user('id');
    $this->Product->create();
    if ($this->Product->save($data)) {
      $this->Session->write('Auth.User.activeRecordId', $this->Product->id);
      $this->set('value', 'success');
      $this->Session->setFlash(__('Product successfully duplicated', true), 'flash_message');
    } else {
      $this->set('value', 'failed');
      $this->Session->setFlash(__('Product could not be duplicated.', true), 'flash_message');
    }
    $this->render(SIMPLE_JSON);
  }

  function edit($id = null, $field = null) {
    $this->autoRender = false;
    $value = 'START';
    if (!empty($this->data)) {
      $value .= ' / HAVE DATA';
    }
    if (!$id) {
      $value .= ' / NO ID';
    }
    $this->set('value', $value);
    $this->layout = 'ajax';
    $this->render();
  }

  function ajax_edit($id = null, $field = null) {
    $this->autoRender = false;
    $renderView = SIMPLE_JSON;
    if (!$id && empty($this->data)) {
      $value .= ' INVALID PRODUCT';
      exit;
    }
    $product = $this->Product->read(null, $id);
    if (!empty($this->data)) {
      if ($this->Product->saveAll($this->data, array('validate' => 'first'))) {
        if ($field && $this->Product->hasField($field)) {
          $array = $this->Product->read($field);
          $value = $array['Product'][$field];
          $this->Session->setFlash(__('<b>' . $field . '</b> successfully saved', true), 'flash_message');
        } elseif ($field == 'key') {
          if (!isset($this->data['newserial'])) {
            $value = $this->Product->Serial->field('key', array('id' => $id));
            $this->Session->setFlash(__('Serial successfully changed', true), 'flash_message');
          } else {
            $this->Product->Serial->order = 'Serial.created DESC';
            $value = $this->Product->Serial->find();
            $value = $value['Serial'];
            $renderView = '/elements/product_serial_view';
          }
        }
      } else {
        //Validation not passed
        if ($field == 'key') {
          if (isset($this->data['newserial'])) {
            //new serial not passed validation
            $uuid = String::uuid();

            $error = $this->Product->Serial->invalidFields();
            $error = $error[$field];
            $id = $this->data['newserial'];
            $html = $this->requestAction('products/product_editor_error/' . $id . '/' . $field . '/' . $error, array('return'));
          } elseif (!empty($this->data['Serial'][0]['id'])) {
            //existing serial has not passed validation
            $error = $this->Product->Serial->invalidFields();
            $error = $error[$field];
            $id = $this->data['Serial'][0]['id'];
            $html = $this->requestAction('products/product_editor_error/' . $id . '/' . $field . '/' . $error, array('return'));
          }
        } else {
          //values of edited other fields not passed validation
          $error = $this->Product->invalidFields();
          $error = $error[$field];
          $id = $product['Product']['id'];
          $html = $this->requestAction('products/product_editor_error/' . $id . '/' . $field . '/' . $error, array('return'));
        }
        $value = compact('field', 'id', 'error', 'html');
        $this->header("HTTP/1.1 500 Internal Server Error");
      }
      $this->set(compact('value', 'product'));
      $this->render($renderView, 'ajax');
    }
  }

  function product_editor_error($id, $field, $error) {
    $this->set(compact('id', 'field', 'error'));
    $this->render('/elements/product_editor_error', 'ajax');
  }

  function ajax_coll_edit($id = null, $field = null) {
    $this->autoRender = false;
    if (!$id && empty($this->data)) {
      $this->Session->setFlash(__('Invalid product', true), null);
      $this->redirect(array('action' => 'index'));
    }
    $this->Product->id = $id;
    $this->Product->recursive = -1;
    if (!empty($this->data)) {

      if ($this->Product->save($this->data)) {
        $sys = $this->Product->read('system_id');
        $sys_id = $sys['Product']['system_id'];
        $this->Product->System->recursive = -1;
        $val = $this->Product->System->read('name', $sys_id);
        $value = $val['System']['name'];
        $this->Session->setFlash(__('<b>system</b> successfully saved', true), 'flash_message');
      } else {
        $this->Session->setFlash(__('An error occurred. Could not save data', true), 'flash_message');
        $value = null;
      }
    } else {
      $value = 'NO DATA!';
    }
    $this->set('value', $value);
    $this->render(SIMPLE_JSON, 'ajax');
  }

  function ajax_coll_view($id = null) {
    $this->autoRender = false;
    $systems = $this->Product->System->find('list');
    foreach ($systems as $key => $value) {
      $systemslist[] = array($key => $value);
    }
    $this->set('systems', $systemslist);
    $this->render();
  }

  function load_upload_dialogue($id = null) {
    $this->autoRender = false;
    if (is_null($id))
      return;
    $product = $this->Product->read('image', $id);
    $image = $product['Product']['image'];
    $this->set(compact('image', 'id'));
    $this->render('/elements/messenger_upload_avatar', 'ajax');
  }

  function reset_avatar($id) {
    $this->autoRender = false;

    App::import('Component', 'File');
    $file = new FileComponent();

    $oldies = glob(PRODUCTIMAGES . DS . $id . DS . 'original.*');
    foreach ($oldies as $o) {
      unlink($o);
    }
    $oldies = glob(PRODUCTIMAGES . DS . $id . DS . 'cache' . DS . '*');
    foreach ($oldies as $o) {
      unlink($o);
    }
    if ($this->Product->read(null, $id)) {
      $this->Product->saveField('image', null);
    }
  }

  function exit_uploader() {
    $this->autoRender = false;
    $oldies = glob(PRODUCTIMAGES . DS . 'tmp' . DS . '*');
    foreach ($oldies as $o) {
      unlink($o);
    }
    exit('   ');
  }

  function avatar_uri($id, $width = 50, $height = 50, $square = 1) {
    $path = PRODUCTIMAGES . DS . $id . DS . 'original.*';
    $options = array('width' => $width, 'height' => $height, 'square' => $square);
    if ($id != 'tmp') {
      $this->_use_preview($id, true);
    } else {
      sleep(1);
    }

    $files = glob($path);
    if (!empty($files[0])) {
      //&$this->log($files[0], LOG_DEBUG);
      $src = basename($files[0]);
      extract($options);
      $tmp_options = compact(array('src', 'id', 'width', 'height', 'square'));
      $src_tmp = __p($tmp_options);

      extract($this->_previewOptions(300, 300));
      $prv_options = compact(array('src', 'id', 'width', 'height', 'square'));
      $src_prv = __p($prv_options);

      $value = array('src_tmp' => $src_tmp, 'src_prv' => $src_prv);
    } else {
      $value = array('src_tmp' => 'nofile');
    }
    $this->set(compact('value'));
    $this->render(SIMPLE_JSON, 'ajax');
  }

  private function _previewOptions($w = 300, $h = 300) {
    return array('width' => $w, 'height' => $h, 'square' => 3);
  }

  private function _use_preview($id, $use = false) {
    App::import('Component', 'File');
    $file = new FileComponent();

    define('TEMP_PATH', PRODUCTIMAGES . DS . 'tmp');
    define('DEST_PATH', PRODUCTIMAGES . DS . $id);
    $temp_files = glob(TEMP_PATH . DS . '*');
    if (count($temp_files) < 1)
      return;

    $fn = basename($temp_files[0]);
    $path_to_temp = TEMP_PATH . DS . $fn;
    $ext = $file->returnExt($fn);
    if ($use) {
      if (!is_dir(PRODUCTIMAGES)) {
        $file->makeDir(PRODUCTIMAGES);
      }
      if (!is_dir(DEST_PATH)) {
        $file->makeDir(DEST_PATH);
      } else {
        $oldies = glob(DEST_PATH . DS . 'original.*');
        foreach ($oldies as $o) {
          unlink($o);
        }
        $oldies = glob(DEST_PATH . DS . 'cache' . DS . '*');
        foreach ($oldies as $o) {
          unlink($o);
        }
      }

      $source = TEMP_PATH . DS . $fn;
      $dest = DEST_PATH . DS . $fn;
      copy($source, $dest);

      $this->Product->id = $id;
      $this->Product->saveField('image', $fn);
    }

    foreach ($temp_files as $o) {
      unlink($o);
    }
  }

}