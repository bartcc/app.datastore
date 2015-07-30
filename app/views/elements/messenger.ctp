<?php e($utilities->preDialogue('messenger-wrap', false, 800, 'transparent', 'bg verticaltop')); ?>
<div class="drag-handle">
    <div>
        <div class="left">
            <h1><?php __('Header Text'); ?></h1>
            <p><?php __('Absatz Text'); ?></p>
        </div>
        <fieldset class="window nopad right">
            <button id="data-view-control" class="toggle primary_lg window input" type="button" title="<?php __('Record View') ?>"><?php __('Record View') ?></button>
            <button id="add-view-control" class="toggle primary_lg window input" type="button" title="<?php __('Add View') ?>"><?php __('Add View') ?></button>
            <button class="primary_lg window" type="button" title="<?php __('Close') ?>" onclick="roo.close(); return false;"><?php __('x') ?></button>
        </fieldset>
    </div>
    <div class="clearfix"></div>
</div>
<div class="dialogue-scroll left">
	<?php echo $utilities->preDialogue('messenger-busy-indicator', false, 230, 'dialogue-wrap-inner', 'nobg') ?>
    <div class="messenger-busy-indicator"></div>
	<?php echo $utilities->postDialogue() ?>
    <div class="wrap" id="messenger-update-content"></div>
</div>
<?php echo $form->create(array('controller' => 'products', 'action' => 'delete', 'id' => 'navigator')); ?>
<div class="right" style="width: 100%">
    <fieldset class="nopad left" style="left: -10px">
		<button id="prev-control" class="primary_lg input" type="button" title="<?php __('<<') ?>" onclick="roo.navigate(null, 'prev'); return false;"><?php __('<<') ?></button>
		<button id="next-control" class="primary_lg input" type="submit" title="<?php __('>>') ?>" onclick="roo.navigate(null, 'next'); return false;"><?php __('>>') ?></button>
	</fieldset>
	<fieldset class="nopad left" style="left: 100px;">
		<?php
			echo $html->div('icon-container', $form->text('id', array('disabled' => 'disabled', 'class' => 'input', 'type' => 'text', 'style' => 'width: 290px; display: none;')), array('id' => 'id-control-wrapper', 'style' => 'opacity: 0.7'));
		?>
	</fieldset>
	<fieldset class="nopad right" >
		<?php
			//echo $html->div('icon-container', $this->Form->button($html->image('icon-tool-trash-white.png'), array('type'=>'button', 'class' => 'primary_lg input disabled', 'disabled' => 'disabled')), array('title' => 'Click to delete', 'id' => 'delete-control-wrapper'));
			echo $html->div('icon-container', $this->Form->button($html->div('trash-small', ''), array('type'=>'button', 'class' => 'primary_lg input')), array('title' => 'Click to Delete', 'id' => 'delete-control-wrapper'));
			echo $html->div('icon-container', $this->Form->button($html->div('copy-small', ''), array('type'=>'button', 'class' => 'primary_lg input')), array('title' => 'Click to Duplicate', 'id' => 'duplicate-control-wrapper'));
		?>
	</fieldset>
</div>
<?php echo $form->end(); ?>
<?php e($utilities->postDialogue()); ?>