<?php

class Product extends AppModel {

    var $name = 'Product';
    var $displayField = 'title';
    var $validate = array(
        'company' => array(
            'minlength' => array(
                'rule' => array('minLength', 2),
                'message' => 'Company name must have at least 2 characters',
                'last' => true // Stop validation after this rule
                //'allowEmpty' => false,
                //'required' => false,
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
            'maxlength' => array(
                'rule' => array('maxLength', 50),
                'message' => 'Max. 50 characters allowed for Company',
                'last' => true // Stop validation after this rule
                //'allowEmpty' => false,
                //'required' => false,
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
            'notempty' => array(
                'rule' => array('notempty'),
                'message' => 'Company name can not be empty',
                'last' => true // Stop validation after this rule
                //'allowEmpty' => false,
                //'required' => false,
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            )
        ),
        'title' => array(
            'minlength' => array(
                'rule' => array('minLength', 5),
                'message' => 'Title must have at least 5 characters',
                'last' => true // Stop validation after this rule
                //'allowEmpty' => false,
                //'required' => false,
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
            'maxlength' => array(
                'rule' => array('maxLength', 50),
                'message' => 'Max. 50 characters allowed for Title',
                'last' => true // Stop validation after this rule
                //'allowEmpty' => false,
                //'required' => false,
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
            'notempty' => array(
                'rule' => array('notempty'),
                'message' => 'Title can not be empty',
                'last' => true, // Stop validation after this rule
                //'allowEmpty' => false,
                //'required' => false,
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            )
        ),
        'system_id' => array(
            'notempty' => array(
                'rule' => array('notempty'),
                //'message' => 'Your custom message here',
                //'allowEmpty' => false,
                //'required' => false,
                //'last' => false, // Stop validation after this rule
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            )
        )
    );
    //The Associations below have been created with all possible keys, those that are not needed can be removed
    var $hasMany = array(
        'Serial' => array(
            'className' => 'Serial',
            'foreignKey' => 'product_id',
            'dependent' => true,
            'conditions' => '',
            'fields' => '',
            'order' => 'Serial.created DESC',
            'limit' => '',
            'offset' => '',
            'exclusive' => 'true',
            'finderQuery' => '',
            'counterQuery' => ''
        )
    );
    var $belongsTo = array(
        'System' => array(
            'className' => 'System',
            'foreignKey' => 'system_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );
}

?>