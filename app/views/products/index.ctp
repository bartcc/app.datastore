<div id="pop-preview" style="display:none;">
    <ul id="preview-list">
		<li><?php printf(__('Title: %s', true), '<span id="preview-title">T</span>'); ?></li>
		<li><?php printf(__('Company: %s', true), '<span id="preview-company">C</span>'); ?></li>
		<li><?php printf(__('Serials: %s', true), '<span id="preview-serials">C</span>'); ?></li>
	</ul>
</div>
<div id="container">
	<?php echo $this->element('products_nav');?>
	<div id="head" style="height: 70px">
		<div class="top">
			<h1 class=""><?php e($title_for_layout); ?></h1>
			<div id="search" class="form"><?php echo $this->element('search_form'); ?></div>
		</div>
	</div>
	<div id="content" class="">
        <div id="page-busy-indicator2" class="page-busy-indicator2 page" style="position: absolute; display: none;">
            <div>&nbsp;</div>
        </div>
        <div class="products index" id="paginate-content" style="display: none;"></div>
	</div>
	<div id="foot">
		<div class="top test">
			<h1>&nbsp;</h1>
		</div>
	</div>
</div>
