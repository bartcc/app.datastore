<?php
class Os extends AppModel {
	var $name = 'Os';
	var $displayField = 'os_type';
	var $validate = array(
		'os_type' => array(
			'notempty' => array(
				'rule' => array('notempty'),
				'message' => 'OS TYPE must not be empty !!',
				//'allowEmpty' => false,
				//'required' => false,
				//'last' => false, // Stop validation after this rule
				//'on' => 'create', // Limit validation to 'create' or 'update' operations
			),
		),
	);
	//The Associations below have been created with all possible keys, those that are not needed can be removed

	var $hasMany = array(
		'Serial' => array(
			'className' => 'Serial',
			'foreignKey' => 'os_id',
			'dependent' => false,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		)
	);

}
?>