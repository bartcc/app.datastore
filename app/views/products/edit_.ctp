<div class="products form">
<?php echo $this->Form->create('Product');?>
	<fieldset>
 		<legend><?php __('Edit Product'); ?></legend>
	<?php
		echo $this->Form->input('id');
		echo $this->Form->input('company');
		echo $this->Form->input('name');
		echo $this->Form->input('serial_1');
		echo $this->Form->input('serial_2');
		echo $this->Form->input('serial_3');
		echo $this->Form->input('notes');
		echo $this->Form->input('system_id');
	?>
	</fieldset>
<?php echo $this->Form->end(__('Submit', true));?>
</div>
<div class="actions">
	<h3><?php __('Actions'); ?></h3>
	<ul>

		<li><?php echo $this->Html->link(__('Delete', true), array('action' => 'delete', $this->Form->value('Product.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $this->Form->value('Product.id'))); ?></li>
		<li><?php echo $this->Html->link(__('List Products', true), array('action' => 'index'));?></li>
		<li><?php echo $this->Html->link(__('List Systems', true), array('controller' => 'systems', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New System', true), array('controller' => 'systems', 'action' => 'add')); ?> </li>
		<li><?php echo $this->Html->link(__('List Serials', true), array('controller' => 'serials', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Serial', true), array('controller' => 'serials', 'action' => 'add')); ?> </li>
	</ul>
</div>