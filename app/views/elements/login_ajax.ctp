<div id="top-header" style="padding-bottom: 23px;">
    <div class="wrap">
        <div id="session-status" style="display:none;"><?php echo $session->check('Auth.User') ? LOGIN_OK_CODE : LOGIN_ERROR_CODE; ?></div>
        <div id="group-status" style="display:none;"><?php echo $session->read('Auth.User.group_id') ?></div>
        <div id="login" style="">
            <?php if($session->check('Auth.User')) :?>
            <div class="" id="login-message-updater">
                <div>
                    <?php
                    echo $form->create('User', array('action' => 'logout', 'onsubmit' => 'lgn.logout(); return false;'));
                    echo $form->submit('Logout', array('class' => 'primary_lg input', 'div' => array('class' => 'right')));
                    echo $this->element('flash_login_message');
                    echo $form->end();
                    ?>
                </div>
                <div>
                    <p style="margin: -15px 5px 0 0;"><?php echo $session->check('Auth.Group.name') ? 'You\'re a member of ' . $session->read('Auth.Group.name') : ''; ?></p>
                </div>
                </div>
            <?php else : ?>
            <?php
            echo $form->create('User', array('action' => 'login_ajax', 'onsubmit' => 'lgn.login(); return false;'));
            echo $form->submit('Login', array('class' => 'input primary_lg', 'label' => false, 'div' => 'login', 'tabindex' => '3'));
            echo $form->input('password', array('label' => false, 'div' => 'login', 'tabindex' => '2', 'style' => 'border-color: #818181; border-width: 1px'));
            echo $form->input('username', array('label' => false, 'div' => 'login', 'tabindex' => '1', 'style' => 'border-color: #818181; border-width: 1px'));
            echo $this->element('flash_login_message');
            ?>
            <div class="right error" id="login-message-updater"><?php //echo $session->flash(); ?></div>
            <?php
            echo $form->end();
            ?>
            <?php endif; ?>
        </div>
    </div>
</div>
<?php echo $html->scriptBlock('lgn.observe();'); ?>
<?php if($session->check('Auth.User')) : ?>
<?php echo $html->scriptStart() ?>
    $('ProductQuery').disabled = false;
    fcs.start();
<?php echo $html->scriptEnd() ?>
<?php endif; ?>