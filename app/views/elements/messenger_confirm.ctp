<?php e($utilities->preDialogue('messenger-confirm', false, 600, 'dark', 'bg confirm')); ?>
<div>
    <h1><span>Warning:&nbsp;</span><span class="italic"></span></h1>
	<div class="fix infotext">
        <span class="image confirm"></span>
		<span class="message"><p class="left whitebeauty"></p></span>
	</div>
    <fieldset class="right" style="bottom: -12px;">
        <button id="confirm-cancel" class="primary_lg input" type="button" title="<?php __('Cancel') ?>" onclick="mes.dialogue_out('messenger-confirm', false); return false;"><?php __('Cancel') ?></button>
        <button id="confirm-delete" class="primary_lg input focus" type="button" title="<?php __('Delete') ?>"><?php __('Delete') ?></button>
    </fieldset>
</div>
<?php e($utilities->postDialogue()); ?>
<?php //echo $session->read('Acl.error.message') . ' / ' . $session->read('Acl.error.check'); ?>