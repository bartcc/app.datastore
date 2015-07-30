<?php
header("Pragma: no-cache");
header("Cache-Control: no-store, no-cache, max-age=0, must-revalidate");
header('Content-Type: text/x-json; charset=utf-8');
header("X-JSON: ");
$flash = $session->flash();
if(!empty($flash)) $value = compact('value', 'flash');
echo $js->object($value);
?>