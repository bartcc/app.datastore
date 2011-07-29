<?php echo $html->scriptStart(); ?>
	aid = 0;
	here = '<?php e(DIR_HOST . $this->here); ?>';
<?php echo $html->scriptEnd(); ?>
<?php
$image = $product['Product']['image'];
$id = $product['Product']['id'];
$title = $product['Product']['title'];
$options = array('src' => $image, 'id' => $id, 'width' => 400, 'height' => 600, 'square' => 3);
$src = !is_null($image) ? __p($options) : '/img/default_avatar.jpg.big.jpg';
?>
<?php e($utilities->preDialogue('messenger-upload-avatar', false, 395, 'transparent', 'bg verticaltop')); ?>
<div class="drag-handle">
	<div class="left">
		<h1><?php __('Modify Icon'); ?></h1>
        <p id="avatar-feedback" class="" style="min-height: 40px;"></p>
	</div>
	<fieldset class="window nopad right">
		<button class="primary_lg window" type="button" title="<?php __('Close') ?>" onclick="exit_uploader(); return false;"><?php __('x') ?></button>
	</fieldset>
    <div class="clearfix"></div>
</div>
<div id="imagebox-container" class="dialogue-scroll autoheight" style="overflow: hidden;">
    <div id="imagebox" class="imagebox"></div>
</div>
<div style="display: block;">
    <p id="messenger-p" style="padding: 2px 0pt; height: 10px;">
        <span id="progress_wrap" style=""><span id="progress_container"><span id="progress"></span></span></span>
    </p>
</div>
<form id="navigator" action="#">
	<div class="right" style="width: 100%">
	<fieldset class="nopad left">
		<div id="browse-wrapper" style="float: left; position: relative;">
			<button id="browse-button" class="primary_lg input" style="margin-left: 0" type="button" title="<?php __('Filebrowser') ?>" onclick="return false;"><?php __('Filebrowser') ?></button>
			<div id="flash-target" style="position:absolute;top:0;left:0;z-index:1000;"></div>
		</div>
        <button id="default-icon-button" class="primary_lg input <?php echo !is_null($image) ? '' : 'disabled'; ?>" <?php echo !is_null($image) ? '' : 'disabled'; ?> type="button" title="<?php __('Default Icon') ?>" onclick="reset_avatar('<?php e($id); ?>'); return false;"><?php __('Default Icon') ?></button>
        <button id="preview-submit-button" class="primary_lg input" type="button" title="<?php __('Activate') ?>" onclick="avatar_make_thumbs('<?php e($id); ?>', [$('avatar-preview-updater-table'), $('product_image_<?php e($id); ?>')]); return false;"><?php __('Activate') ?></button>
	</fieldset>
</div>
</form>
    <div id="preview-src" style="display: none"></div>
<?php e($utilities->postDialogue()); ?>
<?php echo $html->scriptBlock('initObserver(\'div.previews img\');'); ?>
<?php echo $html->scriptStart(); ?>
    p = PICTURE;
    p.init('imagebox', {duration: 0.5});
    $('preview-src').update('<?php e($src); ?>');
<?php echo $html->scriptEnd(); ?>
