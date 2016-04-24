<?php echo $ajax->editor('inplacecoll',
		'ajax_coll_edit/' . $product['Product']['id'],
		array("okButton" => "true",
			"cancelLink" => "true",
			"submitOnBlur" => "false",
			"collection" => $systems
			)
		);
?>