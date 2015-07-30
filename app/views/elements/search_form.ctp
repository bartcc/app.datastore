<?php
    echo $html->tag('div', null, array('class' => 'search-wrap'));
    echo $html->tag('div', null, array('class' => 'view search-left'));
    echo $html->tag('/div');
    echo $html->tag('div', null, array('class' => 'view search-right'));
    echo $html->tag('/div');
    echo $form->create(array('action' => 'index', 'onsubmit' => 'return false;'));
    echo $form->input("query", array(
		'label' => array(
			'text' => EMPTY_SEARCH_TEXT,
			'id' => 'default-value',
			'style' => 'display:none;'
			),
                'div' => array('style' => 'padding-right: 47px;', 'class' => false),
		'class' => 'search', 'value' => EMPTY_SEARCH_TEXT, 'type' => 'text'
		));
    echo $html->tag('div', null, array('id' => 'no-filter', 'class' => 'view pointer', 'style' => 'display: none; top: 14px; right: 14px;'));
    echo $html->image('cancel.png', array('class' => 'right', 'onclick' => 'fcs.clear_search(); return false;'));
    echo $html->tag('/div');
//	echo $js->submit('Search All', array(
//		'url' => '/products/index/all',
//		'update' => '#paginate-content',
//		'evalScripts' => true,
//      'before' => "clear_content('ProductQuery')",
//      'error' => "pagination_failure(response, jsonHeader);",
//		'div' => array('class' => 'lower submit'),
//      'class' => 'primary_lg big',
//      'id' => 'input-nofilter'
//		));
	echo $form->end();
    echo $html->tag('/div');
?>
<?php echo $js->writeBuffer(); ?>