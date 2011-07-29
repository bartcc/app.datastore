<div id="canvas">
    <?php echo $this->Form->create('Product', array('onsubmit' => 'roo.submit(); return false;'));?>
    <div id="add-view" class="products view" style="width: 100%">
        <table id="dataset-table" class="nobg sortable" cellpadding="0" cellspacing="0">
            <tr class="transparent">
                <th style="width: 18%; padding: 10px 10px 16px;" class="rborder bborder">Name</th>
                <th style="" class="bborder rborder">Value</th>
                <th style="width: 25%" class="actions bborder nobg">Notes</th>
            </tr>
            <tr>
                <td class="rborder bborder"><?php __('Title'); ?></td>
                <td class="actions bborder rborder">
                    <div id="<?php echo 'tooltip-wrapper_new_title';?>" class="tooltip-wrapper">
                        <div class="" title="title"><?php echo $this->Form->input('title', array('label' => false, 'tabindex' => 1, 'onfocus' => 'effect_cancel(\'tooltip_new_title\');')); ?></div>
                    </div>
                </td>
                <td class="bborder" rowspan="4" style="vertical-align: top">
                    <div id="<?php echo 'tooltip-wrapper_new_notes';?>" class="tooltip-wrapper">
                        <div id="" class="" title="notes"><?php echo $this->Form->input('notes', array('div' => 'text input nopad', 'label' => false, 'rows' => 9, 'cols' => 25, 'tabindex' => 4, 'style' => 'height: 190px;')); ?></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="rborder bborder"><?php __('Company'); ?></td>
                <td class="actions bborder rborder">
                    <div id="<?php echo 'tooltip-wrapper_new_company';?>" class="tooltip-wrapper">
                        <div class="" title="company"><?php echo $this->Form->input('company', array('label' => false, 'tabindex' => 2, 'onfocus' => 'effect_cancel(\'tooltip_new_company\');')); ?></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="rborder bborder"><?php __('System'); ?></td>
                <td class="actions bborder rborder">
                    <div class="" title="system_id"><?php echo $this->Form->input('system_id', array('label' => false, 'tabindex' => 3)); ?></div>
                </td>
            </tr>
            <tr>
                <td class="rborder bborder"><?php __('Actions'); ?></td>
                <td class="actions bborder rborder">
                    <div class="" title="actions">
                    <?php echo $form->button('Reset', array('type'=>'reset', 'class' => 'primary_lg', 'tabindex' => 8));?>
                    <?php echo $form->button('Save', array('type'=>'submit', 'class' => 'primary_lg', 'onclick' => 'roo.submit(); return false;', 'tabindex' => 5));?>
                    <?php echo $form->input('Use', array('type' => 'radio', 'options' => array(0 => 'Edit', 1 => 'Close', 2 => 'New'), 'value' => $this->Session->check('Auth.User.productaddoption') ? $this->Session->read('Auth.User.productaddoption') : 0, 'legend' => 'After save:'));?>
                    </div>
                </td>
            </tr>
        </table>
    </div>
<?php echo $form->end(); ?>
</div>
<?php echo $js->writeBuffer(); ?>
