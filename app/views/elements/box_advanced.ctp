<div class="cbb" style="margin:auto; <?php if (isset($width)) echo 'width:' . $width . 'px; '; ?><?php if (isset($height)) echo 'height:' . $height . 'px;'; ?>">
    <div class="module-head">
	<h3><?php echo $title; ?></h3>
    </div>
    <div class="wrap">
	<?php
	echo $this->element($el, array());
	?>
    </div> <!--close module wrap-->

    <div class="module-footer">
	<div>&nbsp;</div>
    </div>

</div>