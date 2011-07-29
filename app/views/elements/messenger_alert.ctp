<?php e($utilities->preDialogue('messenger-alert', false, 600, 'dark', 'bg confirm')); ?>
<div>
    <h1></h1>
    <div class="fix" style="border-color: none;">
        <span class="image alert"></span>
		<span class="message" id="error-message-content-updater"><p class="left whitebeauty"></p></span >
	</div>
</div>
<fieldset class="window nopad right bottom" style="">
    <button id="alert_login" class="primary_lg window input" type="button" title="<?php __('Main Login Page') ?>" onclick="mes.dialogue_out('messenger-alert', 'users/logout'); return false;"><?php __('Main Login Page') ?></button>
    <button id="alert_close" class="primary_lg window focus" type="button" title="<?php __('Close') ?>" onclick="mes.dialogue_out('messenger-alert'); return false;"><?php __('x') ?></button>
</fieldset>
<?php e($utilities->postDialogue()); ?>