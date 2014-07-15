<?php if(!isset($shdfpIncluded)) die('Restricted Access');

// refer to instructions.txt for detailed instructions and examples

$fields = array(
	
	// enter your rule sets here //
	
	'work_flip' => array(

		'type' => array(
			'_none_'       => array(),
			// '_any_value_'  => array(),
			// '<select>'  => array(),
			'Featured'      => array(
				'__separator001__',
				'__separator002__',
				'__separator003__',
				'thumb_image',
				'subhead',
				'excerpt',
				'__separator005__',
				'__separator007__',
				'__separator004__',
				'video_embed',
				'__separator006__',
				'featured_images',
				'description_1',
				'description_2'
			),
			'Video'      => array(
				'__separator001__',
				'__separator002__',
				'__separator003__',
				'thumb_image',
				'subhead',
				'__separator005__',
				'__separator007__',
				'__separator004__',
				'video_embed',
				'__separator006__',
				'services'
			),
			'Web'      => array(
				'__separator001__',
				'__separator002__',
				'__separator003__',
				'thumb_image',
				'subhead',
				'__separator005__',
				'__separator007__',
				'__separator004__',
				'featured_image',
				'services'
			),
		),
	)
);

$devmode = false;

?>