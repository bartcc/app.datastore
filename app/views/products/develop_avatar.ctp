<?php
$mtime = filemtime($path_to_cache);
$etag = md5($path_to_cache . $mtime);
$specs = getimagesize($path_to_cache);
foreach ($specs as $key => $value) {
	//$this->log($key . ': ' . $value);
}
if(!$noob) {
	if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && ($_SERVER['HTTP_IF_NONE_MATCH'] == $etag)) {
		header("HTTP/1.1 304 Not Modified");
		exit;
	}

	if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && (strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= filemtime($path_to_cache))) {
		header("HTTP/1.1 304 Not Modified");
		exit;
	}
}

header('Content-type: ' . $specs['mime']);
header('Content-length: ' . filesize($path_to_cache));
//header('Cache-Control: public');
//header('Expires: ' . gmdate('D, d M Y H:i:s', strtotime('+1 year')));
header('Cache-Control: no-cache');
header('Expires: ' . gmdate('D, d M Y H:i:s', strtotime('-1 year')));
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($path_to_cache)));
header('ETag: ' . $etag);
readfile($path_to_cache);
die();
?>
