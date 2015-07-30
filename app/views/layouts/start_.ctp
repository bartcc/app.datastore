<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<?php echo $this->Html->charset(); ?>
	<title>
		StartLayout <?php echo $title_for_layout; ?>
	</title>
	<?php
		echo $this->Html->meta('icon');
		echo $asset->css('main2');
		echo $asset->js('prototype');
		echo $asset->js('builder');
		echo $asset->js('effects');
		echo $asset->js('dragdrop');
		echo $asset->js('controls');
		echo $asset->js('slider');
		echo $asset->js('main');
		
		/// Bring in extra sheets if necessary
		
		$agent = env('HTTP_USER_AGENT');
		if (strpos($agent, 'Firefox') !== false):
			e($html->css('firefox') . "\n");
		endif;

		echo $scripts_for_layout;
	?>
</head>
<body>
	<div id="container">
		<div id="header">
			<h1>
				<?php echo $this->Html->link(__('Show Serials', true), array('controller' => 'serials', 'action' => 'index')); ?>
				<?php echo $this->Html->link(__('Search Serials', true), array('controller' => 'serials', 'action' => 'search')); ?>
			</h1>
		</div>
		<div id="content">

			<?php echo $this->Session->flash(); ?>

		<div id="header">
			<div class="top"><h1>Start Layout</h1></div>
		</div>

			<?php echo $content_for_layout; ?>

		</div>
		<div id="footer">
			<?php echo $this->Html->link(
					$this->Html->image('cake.power.gif', array('alt'=> __('CakePHP: the rapid development php framework', true), 'border' => '0')),
					'http://www.cakephp.org/',
					array('target' => '_blank', 'escape' => false)
				);
			?>
		</div>
	</div>
	<?php echo $this->element('sql_dump'); ?>
</body>
</html>