<?php

class Serial extends AppModel {

    var $name = 'Serial';
    var $displayField = 'key';
    var $validate = array(
        'key' => array(
            'minlength' => array(
                'rule' => array('minLength', 2),
                'message' => 'Minimum 2 characters required',
                'last' => true // Stop validation after this rule
                //'allowEmpty' => false,
                //'required' => false,
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
            'maxlength' => array(
                'rule' => array('maxLength', 200),
                'message' => 'Max. 200 characters allowed for Serial',
                'last' => true // Stop validation after this rule
            ),
            'notempty' => array(
                'rule' => array('notempty'),
                'message' => 'Serial can not be empty',
                'last' => true // Stop validation after this rule
                //'allowEmpty' => false,
                //'required' => false,
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            )
        ),
        'product_id' => array(
            'notempty' => array(
                'rule' => array('notempty'),
                //'message' => 'Your custom message here',
                //'allowEmpty' => false,
                //'required' => false,
                //'last' => false, // Stop validation after this rule
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
        ),
        'type' => array(
            'notempty' => array(
                'rule' => array('notempty'),
                //'message' => 'Your custom message here',
                //'allowEmpty' => false,
                //'required' => false,
                //'last' => false, // Stop validation after this rule
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            ),
        ),
    );
    //The Associations below have been created with all possible keys, those that are not needed can be removed
    var $belongsTo = array(
        'Product' => array(
            'className' => 'Product',
            'foreignKey' => 'product_id',
            'conditions' => '',
            'fields' => '',
            'order' => ''
        )
    );
}

?>