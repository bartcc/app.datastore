<?php
    echo $form->create("Product");
    echo $form->input("q", array('label' => 'Search for  '));
    //echo $form->end("Search");
    echo $js->submit('Search Me', array('url' => '/products/search', 'update' => '#paginate-content'));
?>
<?php echo $html->link("Add Product", "/products/add"); ?>
    <div id="paginate-content"></div>
<?php echo $js->writeBuffer(); ?>