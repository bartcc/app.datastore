<?php //$systems = preg_replace('/\{("{A-Z0-9-}+")(\{).*(:).*(\}).*(\})/', '[${1}', $js->object($systems)); ?>
<?php
$patterns = array();
$patterns[0] = '/\{/';
$patterns[1] = '/\}/';
$patterns[2] = '/\:/';
$replacements = Array();
$replacements[0] = '[';
$replacements[1] = ']';
$replacements[2] = ',';
?>
<?php //echo $systems ?>
<?php echo preg_replace($patterns, $replacements, $js->object($systems)); ?>
<?php //$systems =  preg_replace('/\}/', ']', $systems); ?>
<?php //echo  preg_replace('/:/', ',', $systems); ?>
<?php //echo '{{"C3269BB7-D8EC-8AAA-485053B594023101":"MAC"},{"C326DBC8-FAB3-91E3-C4DFBA0FE2259571":"PC"},{"DAB53037-044A-18FB-C8CDC5F8EB55E607":"Dual"}}' ?>