<?php

class UtilitiesHelper extends Helper {
	var $helpers = array('Html');
	////
	// Dialogue wrappers
	////
	function preDialogue($id, $show = false, $w = null, $classes = '', $backgroundclass = 'bg') {
		if (!empty($classes)) {
			$classes = ' ' . $classes;
		}
		if (!empty($backgroundstyle)) {
			$backgroundstyle = ' ' . $backgroundstyle;
		}
		return '<div id="' . $id . '" class="dialogue-wrap' . $classes . '"' . ($show ? '' : 'style="display:none;"') . '><div class="dialogue"><div id="morph_'.$id.'" class="morph dialogue-content"' . (!is_null($w) ? ' style="width:' . $w . 'px; min-width:' . $w . 'px;"' : '') . '><div id=\'draggable-'.$id.'\' class="' . $backgroundclass . '"><div class="dialogue-inner-wrap">';
	}

	function postDialogue() {
		return '</div></div></div></div></div>';
	}

    function parsePreviewString($product, $width=300, $height=300) {
        $path_to_original = $this->getOriginalPaths($product['Product']['id']);
        $s = null;
        $p_options = array(
            'src' => $product['Product']['image'],
            'id' => $product['Product']['id'],
            'width' => $width,
            'height' => $height,
            'square' => 3);
        $s['id'] = $product['Product']['id'];
        $s['title'] = $product['Product']['title'];
        $s['company'] = $product['Product']['company'];
        $s['src'] = !empty($path_to_original[0]) && !is_null($product['Product']['image']) ? __p($p_options) : '/img/default_avatar.jpg.big.jpg';
        $s['keys'] = '';
        foreach($product['Serial'] as $tmpserial):
            $s['keys'].=$tmpserial['key'].',';
        endforeach;
        $out = rtrim($s['id'].DR.$s['src'].DR.$s['title'].DR.$s['company'].DR.rtrim($s['keys'], ','), DR);
        return $out;
    }

    function getOriginalPaths($id) {
        return glob(PRODUCTIMAGES.DS.$id.DS.'original.*');
    }
}
?>