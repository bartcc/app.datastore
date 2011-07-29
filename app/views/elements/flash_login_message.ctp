<?php
$flash = $session->flash();
echo $form->button($flash, array('id' => 'flash-message-content', 'class' => 'primary_lg blue input disabled', 'escape' => false, 'disabled' => 'true', 'type' => 'button', 'label' => false));
if (!$session->check('Auth.User')) {
    echo $html->scriptBlock("Animate.button('flash-message-content', '" . $flash . "', 2, 'Enter Username and Password', true, true)");
}
?>
