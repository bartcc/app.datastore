<?php
$this->Paginator->options(array(
    'update' => '#paginate-content',
    'evalScripts' => true
));
?>
<div class="serials index" id="paginate-content">
    <h2><?php __('Serials'); echo $ajaxVersion ? ' - Ajax Call (Prototype Version: ' . $ajaxVersion . ')' : ' - No Ajax'; ?></h2>
    <table cellpadding="0" cellspacing="0">
	<tr>
	    <th><?php echo $this->Paginator->sort('key'); ?></th>
	    <th><?php echo $this->Paginator->sort('product_id'); ?></th>
	    <th class="actions"><?php __('Actions'); ?></th>
	</tr>
	<?php
	$i = 0;
	foreach ($serials as $key):
	    $class = null;
	    if ($i++ % 2 == 0) {
		$class = ' class="altrow"';
	    }
	?>
    	<tr<?php echo $class; ?>>
    	    <td><?php echo $key['Serial']['key']; ?>&nbsp;</td>
    	    <td>
		<?php echo $this->Html->link($key['Serial']['product_id'], array('controller' => 'systems', 'action' => 'view', $key['Product']['id'])); ?>
	    </td>
	    <td class="actions">
		<?php echo $html->link(__('View', true), array('action' => 'view', $key['Serial']['id'])); ?>
		<?php echo $this->Html->link(__('Edit', true), array('action' => 'edit', $key['Serial']['id'])); ?>
		<?php echo $this->Html->link(__('Delete', true), array('action' => 'delete', $key['Serial']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $key['Serial']['id'])); ?>
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
		<li><?php echo $this->Html->link(__('New Serial', true), array('action' => 'add')); ?></li>
	    </ul>
	</div>
<?php echo $js->writeBuffer(); ?>