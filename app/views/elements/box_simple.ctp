<?php
$options = array(
    'update' => 'search',
	'htmlAttributes' => array('onclick' => 'fcs.clear_search()'),
    'evalScripts' => true,
    'escape' => false
)
?>
<?php echo $js->link('<b></b><p class="footer-text">' . $title . '</p>', $url, $options); ?>
<?php //echo $js->writeBuffer(); ?>