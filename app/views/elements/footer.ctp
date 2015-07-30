<div id="footer">
    <div id="navigation">
	<?php
	//echo $html->image('swirl.png');
	?>
    </div>
    <span>
    <strong><?php echo $html->link('DataStore', DIR_HOST, array('target' => '_parent')); ?> Online<?php e(DATA_VERSION); ?></strong>
	&copy; 2005-<?php e(date('Y')); ?> Anito Productions und <?php __('All Rights Reserved'); ?>
    </span>
    <span style="float: right"><?php echo $html->link($html->image('cake.power.gif', array('alt' => 'CakePHP')), 'http://cakephp.com/', array('target' => '_blank', 'escape' => false)) ?></span>
</div>
<?php echo $js->writeBuffer(); ?>