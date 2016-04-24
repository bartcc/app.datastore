<?php
$patterns = array('/\{/', '/\}/', '/\:/');
$replacements = Array('[', ']', ',');
?>
<?php echo preg_replace($patterns, $replacements, $js->object($systems)); ?>