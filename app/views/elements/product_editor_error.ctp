<div id="<?php echo 'tooltip_' . $id . '_' . $field; ?>" class="field-error-message tooltip" style="height: 100%; display: none;" onclick="effect_cancel($('<?php echo 'tooltip_' . $id . '_' . $field; ?>')); return false;"> <!-- inline style: sit on top of dialog below -->
    <div class="content" style="width: auto;">
        <div class="wrapper">
            <div class="t"></div>
            <div class="hd"></div>
            <div class="bd">
                <p id="tooltip-error-updater"><?php echo $error; ?></p>
                <p>(Click to dismiss)</p>
            </div>
            <div class="ft"></div>
        </div>
    </div>
    <div class="b" style="width: auto;">
        <div></div>
    </div>
    <div class="a" style="width: auto;">
        <div></div>
    </div>
</div>
<?php echo $html->scriptStart(); ?>
    effect_tooltip('tooltip_<?php echo $id ?>_<?php echo $field ?>');
<?php echo $html->scriptEnd(); ?>

