<div id="header">
    <div id="test" class="top">
      <h1><a href="http://gap.webpremiere.de"> Datastore</a></h1>
        <?php if($this->Session->check('Auth.User')) : ?>
        <?php $pin_btn = $form->submit(' ', array('div' => false, 'id' => 'trigger-lock', 'class' => 'primary_lg big window pin br', 'title' => 'Click to Disable Auto-Hide')); ?>
        <?php $login_btn = $form->submit('Login', array('div' => false, 'id' => 'login-trigger', 'class' => 'down primary_lg big window bl', 'after' => $pin_btn)); ?>
        <?php echo $html->div('fieldset login-trigger', $login_btn, array('id' => '')); ?>
        <?php endif; ?>
    </div>
</div>