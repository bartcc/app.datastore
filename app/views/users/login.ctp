<div id="loginform">
<?php echo $session->flash('auth'); ?>
<?php echo $session->flash(); ?>
<?php
    $after = $html->div('checkbox-box sprite', '');
    echo $form->create('User', array('onsubmit' => 'main_lgn.submit(); return false;'));
    echo $form->input('username', array('id' => 'UserUsername', 'label' => 'Username', 'div' => array('style' => '')));
    echo $form->input('password', array('label' => 'Password', 'div' => array('style' => 'margin-left: -40px;')));
    echo $form->submit('Login', array('id' => 'UserLogin', 'class' => 'primary_lg big', 'div' => array('class' => 'input submit'), 'style' => 'margin-left: -40px;'));
    echo $form->input('reminder', array('type' => 'checkbox', 'label' => 'Remind me (14 days)', 'div' => 'reminder', 'after' => $after));
    echo $form->end();
 ?>
</div>
<?php echo $html->div('clearfix', ''); ?>
<?php echo $html->scriptBlock('$("UserUsername").focus();'); ?>
<?php echo $html->scriptBlock('main_lgn.observe()'); ?>