<td class="bborder" style="">
    <div id="<?php echo 'tooltip-wrapper_' . $value['id'] . '_key';?>" class="tooltip-wrapper">
        <div id="<?php echo $value['id']; ?>">
            <div id="<?php echo 'inplaceserial_' . $value['id']; ?>" class="left notexttransform" title="key"><?php echo $value['key']; ?></div>
            <div class="trashcan right">
                <?php
                echo $form->button($html->image('icon-tool-trash-white.png'), array(
                    'type'=>'button',
                    'class' => 'primary_lg',
                    'onclick' => 'event.stop(); srl.delete_confirm(\'' . $value['id'] . '\',\'' . $value['key'] . '\'); return false;',
                    'title' => 'Click to delete'));
                ?>
            </div>
            <div class="right">
                <?php
                echo $form->button($html->image('pen_small.png'), array(
                    'id' => 'editor_' . $value['id'],
                    'type'=>'button',
                    'class' => 'primary_lg',
                    'title' => 'Click to edit'));
                ?>
            </div>
        </div>
    </div>
</td>
<?php echo $html->scriptBlock("axe.observe(['inplaceserial_" . $value['id'] . "'], '" . $this->Session->read('url.pagingurl') . "', '" . $product['Product']['id'] . "')"); ?>