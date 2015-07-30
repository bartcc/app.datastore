<h1>Serials</h1>
<?php 
	echo $form->create("Serial",array('action' => 'search'));
	echo $form->input("q", array('label' => 'Search for'));
	echo $form->end("Search");
?>
<p><?php echo $html->link("Add Serial", "/serials/add"); ?>
<table>
	<tr>
		<th>Id</th>
		<th>Title</th>
                <th>Action</th>
		<th>Created</th>
	</tr>

<!-- Here's where we loop through our $results array, printing out post info -->

<?php foreach ($results as $key): ?>
	<tr>
		<td><?php echo $key['Serial']['id']; ?></td>
		<td>
			<?php echo $html->link($key['Serial']['productname'],'/serials/view/'.$key['Serial']['id']);?>
                </td>
                <td>
			<?php echo $html->link(
				'Delete', 
				"/serials/delete/{$key['Serial']['id']}", 
				null, 
				'Are you sure?'
			)?>
			<?php echo $html->link('Edit', '/serials/edit/'.$key['Serial']['id']);?>
		</td>
		<td><?php echo $key['Serial']['created']; ?></td>
	</tr>
<?php endforeach; ?>
</table>