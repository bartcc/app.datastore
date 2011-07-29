<?php
    $this->Paginator->options(array(
	'update' => '#paginate-content',
	'evalScripts' => true,
	'before' => "pagination_spin(true, 'page-busy-indicator2');",
	'complete' => "pagination_spin(false, 'page-busy-indicator2');",
	'error' => "pagination_failure(response, jsonHeader);",
	'escape' => true
    ));
?>
<?php
$pre = '<div class="center paging"><div class="hint"><span>';
$post = '</span></div></div>';
$query = $this->Session->read('Auth.User.querykey');
$fKey = '<b>' . $query . '</b>';
$count = $this->Paginator->counter(array('format' => '%count%', true));

if ($count > 0 && $query) {
	$before = $count . (($count>1) ? ' results for ' : ' result for ');
    $middle = $fKey;
	$after =  '';
} else {
	$before = $query ? 'No results for ' : '';
	$middle = $query ? ' ' . $fKey : 'No Filter';
	$after =  '';
}
?>
<?php $hint = $pre . $before . $middle . $after . $post; ?>
<?php echo $this->element('product_results', array('hint' => $hint)); ?>
<?php echo $html->scriptBlock("roo.observe('" . $this->Session->read('Auth.User.activeRecordId') . "', '" . $this->Session->read('url.url') . "', '" . $this->Session->read('url.page') . "', '" . $this->Session->read('url.activeRecordPage') . "', '" . $this->Session->read('Auth.User.querykey') . "')"); ?>
<?php echo $html->scriptBlock("document.fire('dom:pageloaded');"); ?>
<?php echo $html->scriptBlock("linkToActiveRecord('".$this->Session->read('params.named.sort')."','".$this->Session->read('params.named.direction')."');"); ?>
<?php echo $js->writeBuffer(); ?>