<?php e($utilities->preDialogue('messenger-avatar', false, 400, 'transparent', 'bg verticaltop')); ?>
<div>
	<div class="left">
        <h1><?php __('Icon Preview'); ?></h1>
        <p id="avatar-fill" class="dialogue-spacer"></p>
	</div>
	<fieldset class="window nopad top right">
		<button id="" class="primary_lg window input" type="button" title="<?php __('Use It') ?>" onclick="avatar_make_thumbs('<?php e($id); ?>', [$('avatar-preview-updater-table'), $('product_image_<?php e($id); ?>')]); return false;"><?php __('Use It') ?></button>
		<button id="" class="primary_lg window input" type="button" title="<?php __('Discard') ?>" onclick="clear_temp(); return false;"><?php __('Discard') ?></button>
    </fieldset>
</div>
<div class="dialogue-scroll autoheight left">
    <div class="wrap" id=""><img id="_avatar-preview-updater" class="" src="" style="width: 100%"/></div>
</div>
<?php e($utilities->postDialogue()); ?>