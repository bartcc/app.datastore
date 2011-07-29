<div class="serials form">
<?php echo $this->Form->create('Serial');?>
	<fieldset>
 		<legend><?php __('Add Serial'); ?></legend>
	<?php
		echo $this->Form->input('company');
		echo $this->Form->input('productname');
		echo $this->Form->input('serial_1');
		echo $this->Form->input('serial_2');
		echo $this->Form->input('serial_3');
		echo $this->Form->input('notes');
		echo $this->Form->input('os_id');
	?>
	</fieldset>
<?php echo $this->Form->end(__('Submit', true));?>
</div>
<div class="actions">
	<h3><?php __('Actions'); ?></h3>
	<ul>

		<li><?php echo $this->Html->link(__('List Serials', true), array('action' => 'index'));?></li>
		<li><?php echo $this->Html->link(__('List Os Types', true), array('controller' => 'os_types', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Os Type', true), array('controller' => 'os_types', 'action' => 'add')); ?> </li>
	</ul>
</div>