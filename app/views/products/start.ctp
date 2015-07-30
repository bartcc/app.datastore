<?php //echo $this->element('ajax_container', array('page_title' => 'Welcome', 'action' => 'index')); ?>
<?php
    $this->Paginator->options(array(
	'update' => '#paginate-content',
	'evalScripts' => true
    ));
?>
<div class="products index" id="paginate-content">
<h2><?php __('Products'); echo $ajaxVersion ? ' - Ajax Call (Prototype Version: ' . $ajaxVersion . ')' : ' - No Ajax'; ?></h2>
<table cellpadding="0" cellspacing="0">
    <tr>
	<th><?php echo $this->Paginator->sort('company'); ?></th>
	<th><?php echo $this->Paginator->sort('product'); ?></th>
	<th><?php echo $this->Paginator->sort('serial_1'); ?></th>
	<th><?php echo $this->Paginator->sort('serial_2'); ?></th>
	<th><?php echo $this->Paginator->sort('serial_3'); ?></th>
	<th><?php echo $this->Paginator->sort('notes'); ?></th>
	<th><?php echo $this->Paginator->sort('system_id'); ?></th>
	<th class="actions"><?php __('Actions'); ?></th>
    </tr>
    <?php
    $i = 0;
    foreach ($products as $product):
	$class = null;
	if ($i++ % 2 == 0) {
	    $class = ' class="altrow"';
	}
    ?>
    <tr<?php echo $class; ?>>
	<td><?php echo $product['Product']['company']; ?>&nbsp;</td>
	<td><?php echo $product['Product']['product']; ?>&nbsp;</td>
	<td><?php echo $product['Product']['serial_1']; ?>&nbsp;</td>
	<td><?php echo $product['Product']['serial_2']; ?>&nbsp;</td>
	<td><?php echo $product['Product']['serial_3']; ?>&nbsp;</td>
	<td><?php echo $product['Product']['notes']; ?>&nbsp;</td>
	<td>
	    <?php echo $this->Html->link($product['System']['name'], array('controller' => 'systems', 'action' => 'view', $product['System']['id'])); ?>
	</td>
	<td class="actions">
	    <?php echo $this->Html->link(__('View', true), array('action' => 'view', $product['Product']['id'])); ?>
	    <?php echo $this->Html->link(__('Edit', true), array('action' => 'edit', $product['Product']['id'])); ?>
	    <?php echo $this->Html->link(__('Delete', true), array('action' => 'delete', $product['Product']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $product['Product']['id'])); ?>
	</td>
    </tr>
    <?php endforeach; ?>
	</table>
	<p>
    <?php
	    echo $this->Paginator->counter(array(
		'format' => __('Page %page% of %pages%, showing %current% records out of %count% total, starting on record %start%, ending on %end%', true)
	    ));
    ?>	</p>

	<div class="paging">
    <?php echo $this->Paginator->prev('<< ' . __('previous', true), array(), null, array('class' => 'disabled')); ?>
	     | 	<?php echo $this->Paginator->numbers(); ?>
	    |
    <?php echo $this->Paginator->next(__('next', true) . ' >>', array(), null, array('class' => 'disabled')); ?>
	</div>
    </div>
<div class="actions">
    <h3><?php __('Actions'); ?></h3>
    <ul>
	<li><?php echo $this->Html->link(__('New Product', true), array('action' => 'add')); ?></li>
	<li><?php echo $this->Html->link(__('List Systems', true), array('controller' => 'systems', 'action' => 'index')); ?> </li>
	<li><?php echo $this->Html->link(__('New System', true), array('controller' => 'systems', 'action' => 'add')); ?> </li>
	<li><?php echo $this->Html->link(__('List Serials', true), array('controller' => 'serials', 'action' => 'index')); ?> </li>
	<li><?php echo $this->Html->link(__('New Serial', true), array('controller' => 'serials', 'action' => 'add')); ?> </li>
    </ul>
</div>
<?php echo $js->writeBuffer(); ?>