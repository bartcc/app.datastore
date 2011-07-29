<?php
header("Pragma: no-cache");
header("Cache-Control: no-store, no-cache, max-age=0, must-revalidate");
header('Content-Type: text/x-json');
header("X-JSON: ");
$patterns = array('/\{/', '/\}/', '/\:/');
$replacements = Array('[', ']', ',');
?>
<?php echo preg_replace($patterns, $replacements, $js->object($value)); ?>