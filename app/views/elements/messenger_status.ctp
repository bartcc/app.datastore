<?php e($utilities->preDialogue('messenger-status', false, 400, 'transparent', 'bg verticaltop')); ?>
<div style="margin-bottom: 30px">
    <fieldset class="window nopad top right">
        <button class="primary_lg window" type="button" title="<?php __('Close') ?>" onclick="mes.kill('messenger-status'); return false;"><?php __('x') ?></button>
    </fieldset>	
</div>
<p id="messenger-p">
    <span class="exclamation" id="messenger-icon"></span>
    <span id="messenger-span"></span>
    <span id="_progress_wrap" style="display:none;"><span id="_progress_container"><span id="_progress"></span></span></span>
</p>
<?php e($utilities->postDialogue()); ?>