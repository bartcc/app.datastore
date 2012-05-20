<?php echo $hint; ?>
<p class="whitebeauty hint">
<?php
	echo $this->Paginator->counter(array(
	'format' => __('Page %page% of %pages%, showing %current% records out of %count% total, starting on record %start%, ending on %end%', true)
	));
?>
</p>
<div class="paging left">
<p>
<?php echo $this->Paginator->prev('<< ' . __('previous', true), array('id' => 'prevPg1'), null, array('class' => 'disabled')); ?>
         * 	<?php echo $this->Paginator->numbers(array('separator' => '', 'tag' => 'span')); ?>
	*
<?php echo $this->Paginator->next(__('next', true) . ' >>', array('id' => 'nextPg1'), null, array('class' => 'disabled')); ?>
<?php echo $this->Html->tag('span', $this->Html->link('Active Record', '', array('onclick' => 'return false;')), array('class' => 'active-page', 'title' => 'Active Record Page', 'style' => 'display: none;')) ?>
</p>
</div>
<div class="paging right">
<?php $options = array('2' => '2 Rows', '5' => '5 Rows', '10' => '10 Rows', '25' => '25 Rows', '50' => '50 Rows', '100' => '100 Rows', '500' => '500 Rows'); ?>
<?php echo $form->input('rowcount', array('label' => 'Show me', 'type' => 'select', 'options' => $options, 'default' => $limit)); ?>
</div>
<table class="sortable" id="content-table" cellpadding="0" cellspacing="0" style="opacity: 1;">
	<tr class="transparent">
		<th style="width: 180px" class="rborder bborder"><?php echo $this->Paginator->sort('company'); ?></th>
		<th colspan="2" style="" class="bborder"><?php echo $this->Paginator->sort('title'); ?></th>
  <th style="width: 100px" class="rborder bborder">&nbsp;</th>
		<th style="width: 60px" class="rborder bborder"><?php echo $this->Paginator->sort('system_id'); ?></th>
		<th style="width: 120px" colspan="3" class="actions bborder">actions</th>
		<th style="display: none">&nbsp;</th>
	</tr>
	<?php
	$i = 0;
	foreach ($products as $product):
	$class = null;
	if ($i++ % 2 == 0) $class = ' class="altrow selectable"';
	else $class = ' class="selectable"';
    ?>
    <tr<?php echo $class; ?> id="<?php echo $product['Product']['id'] ?>">
    <?php e($this->element('table_row', array('product' => $product, 'class' => $class))) ?>
    </tr>
	<?php endforeach; ?>
</table>
<div class="paging">
<?php echo $this->Paginator->prev('<< ' . __('previous', true), array('id' => 'prevPg2'), null, array('class' => 'disabled')); ?>
	 * 	<?php echo $this->Paginator->numbers(array('separator' => '', 'tag' =>'span', 'class' => 'number')); ?>
	*
<?php echo $this->Paginator->next(__('next', true) . ' >>', array('id' => 'nextPg2'), null, array('class' => 'disabled')); ?>
<?php echo $html->tag('span', $html->link('Active Record', '', array('onclick' => 'return false;')), array('class' => 'active-page', 'title' => 'Shortcut to Active Record', 'style' => 'display: none;')) ?>
</div>
