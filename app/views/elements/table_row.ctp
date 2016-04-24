<?php
  $path_to_original = $utilities->getOriginalPaths($product['Product']['id']);
  $src = !empty($path_to_original[0]) && !is_null($product['Product']['image']) ? __p(array('src' => $product['Product']['image'], 'id' => $product['Product']['id'], 'width' => 50, 'height' => 50)) : 'default_avatar.jpg';
  $broken = !is_null($product['Product']['image']) ? $product['Product']['image'] == basename($path_to_original[0]) ? '' : 'broken' : '';
  $options = array(
      'id' => '',
      'class' => 'nopad tmb_'.$product['Product']['id'],
      'alt' => $product['Product']['title'],
      'width' => '50px',
      'height' => '50px',
      'style' => 'border: medium none; position: absolute;',
      'onclick' => 'Event.stop(event); roo.rowClickHandler(\''.$product['Product']['id'].'\', true, loadUploadDialogue.bind(this, event)); return false;'
      );
?>
<td class="rborder bborder" title="<?php echo $product['Product']['title'] ?>"><?php echo $text->truncate($product['Product']['company'], 10, array('ending' => '...')); ?></td>
<td class="rborder bborder thumbnail" style="padding: 0" title="<?php echo $product['Product']['title'] ?>"><?php echo $html->div('', $html->image($src, $options).$html->div($broken, ''), array('style' => 'position: relative;')); ?></td>
<td class="bborder" style="padding-left: 60px;" title="<?php echo $product['Product']['title'] ?>"><?php echo $text->truncate($product['Product']['title'], 29, array('ending' => '...')); ?></td>
<td class="rborder bborder" title="<?php echo $product['Product']['title'] ?>"><div  class="serial-count">(&nbsp;<?php echo count($product['Serial']); ?>&nbsp;)</div></td>
<td class="rborder bborder" title="<?php echo $product['Product']['title'] ?>"><?php echo $product['System']['name']; ?></td>
<td class="rborder bborder icon" title="<?php echo __('Click to open Editor', true); ?>">
    <?php
    echo $html->div('icon-inner',
        $html->link($html->div('edit-container', ''), array(),
            array('escape'=>false, 'onclick' => 'event.stop(); roo.rowClickHandler(\'' . $product['Product']['id'] . '\', true); return false;')
    ));
    ?>
</td>
<td class="rborder bborder icon" title="<?php echo __('Click to Duplicate', true); ?>">
    <?php
    echo $html->div('icon-inner',
        $html->link($html->div('file-container', ''), array(),
            array('escape'=>false, 'onclick' => 'event.stop(); roo.duplicate(\'' . $product['Product']['id'] . '\'); return false;')
    ));
    ?>
</td>
<td class="actions bborder icon" title="<?php echo __('Click to Delete', true); ?>">
    <?php
    echo $html->div('icon-inner',
        $html->link($html->div('trash-container', ''), array('controller' => 'products', 'action' => 'delete', $product['Product']['id']),
            array('escape'=>false, 'onclick' => 'event.stop(); roo.delete_confirm(\'' . $product['Product']['id'] . '\'); return false;')
    ));
    ?>
</td>
<td class="specs" style="display: none"><?php e($utilities->parsePreviewString($product, 300, 300)); ?></td>

