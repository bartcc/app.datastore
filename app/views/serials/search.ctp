<table>
    <tr>
	<th>Title</th>
	<th>Action</th>
    </tr>

    <!-- Here's where we loop through our $results array, printing out post info -->
    <?php foreach ($results as $product): ?>
        <tr>
    	<td>
	    <?php echo $html->link($product['Product']['name'], '/products/view/' . $product['Product']['id']); ?>
	</td>
	<td>
	    <?php
	    echo $html->link(
		    'Delete',
		    "/products/delete/{$product['Product']['id']}",
		    null,
		    'Are you sure?'
	    ) ?>
<?php echo $html->link('Edit', '/products/edit/' . $product['Product']['id']); ?>
	</td>
    </tr>
<?php endforeach; ?>
</table>