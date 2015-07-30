<?php

class User extends AppModel {

    var $name = 'User';
    var $belongsTo = array('Group');
    var $actsAs = array('Acl' => 'requester');
    var $validate = array(
        'username' => array(
            'notempty' => array(
                'rule' => array('notempty'),
                'message' => 'Username must not be empty',
                //'required' => true,
                //'last' => false, // Stop validation after this rule
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            )
        ),
        'password' => array(
            'notempty' => array(
                'rule' => array('notempty'),
                'message' => 'Password must not be empty',
                //'required' => true,
                //'last' => false, // Stop validation after this rule
                //'on' => 'create', // Limit validation to 'create' or 'update' operations
            )
        )
    );

    function _bindNode() {
        if (empty($user['User']['group_id'])) {
            return null;
        } else {
            return array(
                'model' => 'Group',
                'foreign_key' => $user['User']['group_id']
            );
        }
    }

    function parentNode() {

        if (!$this->id && empty($this->data))
            return null;

        if (isset($this->data['User']['group_id']))
            $groupId = $this->data['User']['group_id'];
        else
            $groupId = $this->field('group_id');

        if (!$groupId)
            return null;
        else
            return array('Group' => array('id' => $groupId));
    }

    // Group-only ACL
//    function bindNode($user) {
//        return array('model' => 'Group', 'foreign_key' => $user['User']['group_id']);
//    }

    function afterSave($created) {
        if (!$created) {
            $parent = $this->parentNode();
            $parent = $this->node($parent);
            $node = $this->node();
            $aro = $node[0];
            $aro['Aro']['parent_id'] = $parent[0]['Aro']['id'];
            $this->Aro->save($aro);
        }
    }

}

?>