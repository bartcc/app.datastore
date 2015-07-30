<?php echo $this->element('table_row', array('product' => $product)); ?>
<?php echo $html->scriptBlock('Preview.observe(\'tr#'. $product['Product']['id']  .' td.thumbnail\');'); ?>