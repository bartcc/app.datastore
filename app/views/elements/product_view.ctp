<div  id="canvas">
    <div id="current_id" style="display: none"><?php echo $product['Product']['id'] ?></div>
    <div id="product-view" class="products view" style="width: 100%">
        <table id="dataset-table" class="nobg sortable" cellpadding="0" cellspacing="0"><?php $i = 0; $class = ' class="inplace"';?>
            <tbody id="dataset-body">
                <tr class="transparent">
                    <th style="width: 18%; padding: 0; vertical-align: top;" class="rborder bborder">
                        <?php
                        $path_to_original = glob(PRODUCTIMAGES . DS . $product['Product']['id'] . DS . 'original.*');
                        $options = array(
                            'id' => '',
                            'class' => 'tmb_'.$product['Product']['id'],
                            'alt' => $product['Product']['title'],
                            'width' => '50px',
                            'height' => '50px',
                            'style' => 'border-top: 1px dashed; border-left: 1px dashed; cursor: pointer',
                            'onclick' => 'loadUploadDialogue(event); return false;'
                        );
                        $src = !empty($path_to_original[0]) && !is_null($product['Product']['image']) ? __p(array('src' => $product['Product']['image'], 'id' => $product['Product']['id'], 'width' => 50, 'height' => 50)) : 'default_avatar.jpg';
                        $broken = !is_null($product['Product']['image']) ? $product['Product']['image'] == basename($path_to_original[0]) ? '' : 'broken' : '';
                        echo $html->div('', $html->image($src, $options).$html->div($broken, '', array('id' => 'broken-image')), array('style' => 'position: relative;'));
                        ?>
                    </th>
                    <th style="" class="rborder bborder"><span id="title-header-content" style="text-transform: none;"><?php echo $this->element('products_title'); ?></span></th>
                    <th style="width: 25%" class="actions nobg bborder">Notes</th>
                </tr>
                <tr>
                    <td class="rborder bborder vaTop">
                        <span><?php __('Serials'); ?></span>
                        <span><button id="" class="primary_lg" type="button" title="" onclick="srl.make(); return false;">+</button></span>
                    </td>
                    <td class="actions rborder bborder vaTop" style="padding: 0">
                        <table class="inner nobg" cellspacing="0" cellpadding="0">
                            <tbody id="key-insertionpoint">
                                <?php foreach ($product['Serial'] as $value):?>
                                <tr id="tr_<?php echo $value['id']; ?>">
                                    <?php echo $this->element('product_serial_view', array('value' => $value)); ?>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </td>
                    <td class="bborder vaTop" rowspan="4" style="padding-bottom: 15px;">
                        <div id="<?php echo 'tooltip-wrapper_' . $product['Product']['id'] . '_notes';?>" class="tooltip-wrapper">
                            <div id="">
                                <textarea class="inplace editor_field" rows="9" cols="25" title="notes" style="height: 190px"><?php echo $product['Product']['notes']; ?></textarea>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="rborder bborder vaTop"><?php __('Title'); ?></td>
                    <td class="actions bborder rborder vaTop">
                        <div id="<?php echo 'tooltip-wrapper_' . $product['Product']['id'] . '_title';?>" class="tooltip-wrapper">
                            <div id="">
                                <div class="inplace left" title="title"><?php echo $product['Product']['title']; ?></div>
                                <div class="right"><button id="editor_<?php echo $product['Product']['id']; ?>_title" class="primary_lg" type="button" title="click to edit" onclick=""><?php echo $html->image('pen_small.png') ?></button></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="rborder bborder vaTop"><?php __('Company'); ?></td>
                    <td class="actions bborder rborder vaTop">
                        <div id="<?php echo 'tooltip-wrapper_' . $product['Product']['id'] . '_company';?>" class="tooltip-wrapper">
                            <div id="">
                                <div class="inplace left" title="company"><?php echo $product['Product']['company']; ?></div>
                                <div class="right"><button id="editor_<?php echo $product['Product']['id']; ?>_company" class="primary_lg" type="button" title="click to edit" onclick=""><?php echo $html->image('pen_small.png') ?></button></div>
                            </div>
                        </div>
                    </td>

                </tr>
                <tr>
                    <td class="rborder bborder vaTop"><?php __('System'); ?></td>
                    <td class="actions bborder rborder vaTop">
                        <div id="<?php echo 'tooltip-wrapper_' . $product['Product']['id'] . '_system';?>" class="tooltip-wrapper">
                            <div id="">
                                <div id="inplacecoll" class="inplacecoll left" title="system_id"><?php echo $product['System']['name']; ?></div>
                                <div class="right"><button id="editor_<?php echo $product['Product']['id']; ?>_system_id" class="primary_lg" type="button" title="click to edit" onclick=""><?php echo $html->image('pen_small.png') ?></button></div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
<?php echo $this->element('messenger_upload_avatar', array('product' => $product)) ?>
<?php echo $html->scriptStart(); ?>
    swf_path = '<?php e($this->webroot . 'swf/upload.swf?v="348723684729' . DATA_VERSION); ?>'
    upload_url = '<?php e($html->url('/uploads/avatar/' . $product['Product']['id'] . '/' . $session->id())); ?>'
    max_size = <?php e(MAX_SIZE); ?>;
    dash_av = false;
    title = '<?php e($title); ?>';
<?php echo $html->scriptEnd(); ?>
<?php echo $html->scriptBlock("axe.observe(['.inplace', '.inplacecoll'], '" . $product['Product']['id'] . "')"); ?>
<?php echo $html->scriptBlock("srl = new_serial();"); ?>
<?php echo $html->scriptBlock("document.fire('dom:viewcreated');"); ?>
