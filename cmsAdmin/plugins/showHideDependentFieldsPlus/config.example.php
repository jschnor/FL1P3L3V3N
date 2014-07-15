<?php if(!isset($shdfpIncluded)) die('Restricted Access');

// refer to instructions.txt for detailed instructions and examples

$fields = array(
	
		// enter your rule sets here //
		
		'sectionName' => array(
			'eventFieldName' => array(
				'_none_'       => array(),
				'_any_value_'  => array(),
				'value_1'      => array('field_2'),
				'value_2'      => array('field_3', 'field_4'),
				'etc'          => array('etc'),
			),
		),
		
);

$devmode = false;

?>