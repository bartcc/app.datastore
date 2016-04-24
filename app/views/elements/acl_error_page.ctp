<?php
header("Pragma: no-cache");
header("Cache-Control: no-store, no-cache, max-age=0, must-revalidate");
header('Content-Type: text/x-json');
header("X-JSON: ");
$func = array('method' => 'trigger_ajax_error();');
$value = array_merge($value, $func);
echo $js->object($value);

