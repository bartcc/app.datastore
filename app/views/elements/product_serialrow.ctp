<?php $error = isset($value['errormessage']) ? $value['errormessage'] : null; ?>
<td class="bborder">
	<div id="<?php echo 'inplaceserial_' . $value['id']; ?>" class="left small notexttransform" title="key"><?php echo isset($error) ? $error : $value['key']; ?></div>
	<div class="trashcan right">
		<?php
			echo
			$html->link(
				$html->div('trash-container',
					$html->image('icon-tool-trash.png', array('style' => 'padding-top: 7px; padding-left: 8px'))),
				array('controller' => 'serials', 'action' => 'delete', isset($error) ? null : $value['id']),
				array('escape'=>false, 'title' => 'click to delete', 'onclick' => 'event.stop(); srl.' . (isset($error) ? 'cancel' : 'del') . '(\'' . $value['id'] . '\'); return false;')
			);
		?>
	</div>
	<?php if(!isset($error)): ?>
	<div class="right"><button id="<?php echo 'serialedit_control_' . $value['id']; ?>" class="primary_lg" type="button" title="click to edit" onclick=""><?php echo $html->image('pen_small.png') ?></button></div>
	<?php endif; ?>
</td>
<?php if(!isset($error)): ?>
<?php echo $html->scriptBlock("axe.observe(['inplaceserial_" . $value['id'] . "'], '" . $this->Session->read('url.pagingurl') . "', '" . $product['Product']['id'] . "')"); ?>
<?php else : ?>
<?php echo $html->scriptBlock("srl.cancel.delay(1, '" . $value['id'] . "');"); ?>
<?php endif; ?>