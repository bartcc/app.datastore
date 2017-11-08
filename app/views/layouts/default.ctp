<?php
/**
 *
 * PHP versions 4 and 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright 2005-2010, Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright 2005-2010, Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       cake
 * @subpackage    cake.cake.libs.view.templates.layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <?php echo $this->Html->charset(); ?>
        <title>
            <?php echo $title_for_layout; ?>
        </title>
        <?php
        echo $this->Html->meta('icon');
        //echo $this->Html->css('cake_generic');
        echo $asset->css('main1');
        echo $asset->css('main2');
        echo $asset->css('corner');

        /// Bring in extra sheets if necessary

        $agent = env('HTTP_USER_AGENT');
        if (strpos($agent, 'Firefox') !== false):
            e($html->css('firefox') . "\n");
        else:
            e($html->css('safari') . "\n");
        endif;

        echo $html->scriptStart();
        ?>
        var base_url = '<?php echo $html->url('/'); ?>';
        var LOGIN_ERROR_CODE = <?php echo LOGIN_ERROR_CODE; ?>;
        var LOGIN_OK_CODE = <?php echo LOGIN_OK_CODE; ?>;
        var ACL_ERROR_CODE = <?php echo ACL_ERROR_CODE; ?>;
        var SEARCH_MODE_FULL = '<?php echo SEARCH_MODE_FULL; ?>';
        var NO_ID = '<?php echo NO_ID; ?>';
        var INVALID_ID = '<?php echo INVALID_ID; ?>';
        <?php
        echo $html->scriptEnd();
//	echo $asset->js('s2');

        echo $asset->js('prototype_1-7-0-0');
        echo $asset->js('base');
        echo $asset->js('builder');
        echo $asset->js('effects');
        echo $asset->js('dragdrop');
        echo $asset->js('controls');
        echo $asset->js('slider');
        echo $asset->js('anito');
        echo $asset->js('swfobject');
        echo $asset->js('upload');
        echo $asset->js('q');
        echo $asset->js('q.informer');
        echo $asset->js('picture');


        echo $scripts_for_layout;
        ?>
    </head>
    <body id="body" onload="init()">
        <?php e($this->element('messenger_status')); ?>
        <?php e($this->element('messenger')); ?>
        <?php e($this->element('messenger_alert')); ?>
        <?php e($this->element('messenger_confirm')); ?>
        <div id="dummy" style="display:none;"></div>
        <div id="main">
            <?php e($this->element('top_header')); ?>
            <?php e($this->element('header')); ?>
            <div id="page">
                <?php echo $content_for_layout; ?>
            </div>
        </div>
        <?php e($this->element('footer')); ?>
        <?php echo $this->element('sql_dump'); ?>
    </body>
</html>