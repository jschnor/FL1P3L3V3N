
<?php
$val = file_exists('includes/loadrecords.inc.php');
include('includes/loadrecords.inc.php');

function clean($string) {
   $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
   return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

// load record from 'home_flip'
list($home_flipRecords, $home_flipMetaData) = getRecords(array(
  'tableName'   => 'home_flip',
  'loadUploads' => true,
  'allowSearch' => false,
  'limit'       => '1'
));
$home_flipRecord = @$home_flipRecords[0]; // get first record

if (!$home_flipRecord) { dieWith404("Record not found!"); } // show error message if no record found

// load record from 'about_flip'
list($about_flipRecords, $about_flipMetaData) = getRecords(array(
  'tableName'   => 'about_flip',
  'where'       => '', // load first record
  'loadUploads' => true,
  'allowSearch' => false,
  'limit'       => '1',
));
$about_flipRecord = @$about_flipRecords[0]; // get first record

if (!$about_flipRecord) { dieWith404("Record not found!"); } // show error message if no record found

// load records from 'team_flip'
list($team_flipRecords, $team_flipMetaData) = getRecords(array(
  'tableName'   => 'team_flip',
  'loadUploads' => true,
  'allowSearch' => false,
));

// load records from 'believe'
list($believeRecords, $believeMetaData) = getRecords(array(
  'tableName'   => 'believe',
  'loadUploads' => true,
  'allowSearch' => false
));

// load records from 'work_flip'
list($work_flipRecords, $work_flipMetaData) = getRecords(array(
  'tableName'   => 'work_flip',
  'loadUploads' => true,
  'allowSearch' => false
));

function saveJSON($portfolio, $home, $about, $team, $believe){
  $data = array(
    'portfolio'=>array(),
    'home'=>$home,
    'about'=>$about,
    'team'=>$team,
    'believe'=>$believe
  );

  // print_r($portfolio);

  foreach ($portfolio as $array){
    // look up services category
    $services = array();
    foreach ($array['services:values'] as $svc_id){
      if ($svc_id != ''){
        list($svcRecords, $svcMetaData) = getRecords(array(
          'tableName'   => 'services',
          'where' => 'num='.$svc_id,
          'loadUploads' => true,
          'allowSearch' => false
        ));

        $category = $svcRecords[0]['service_category'];
        $services[$category][] = $svcRecords[0]['title'];
      }
    }
    $array['services_sorted'] = $services; // add the sorted services to the data array

    $data['portfolio'][] = $array;

  }

  $filename = 'js/data.js';
  $js = 'window.__DATA__ = '.json_encode($data);

  $fh = fopen($filename, 'w');
  fwrite($fh, $js);
  fclose($fh);

  // print_r(json_encode($data));
}
// $final_array = 

saveJSON($work_flipRecords, $home_flipRecords, $about_flipRecords, $team_flipRecords, $believeRecords);

/*echo '<pre>';
print_r();
echo '</pre>';*/

?><!doctype html>
<html class="no-js" lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta name="description" content="Flipeleven" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui"/>
        <meta name="keywords" content="high-end, front-end development, php, html5, apps, ios, android, animation, video, promo, Milwaukee, Wisconsin, Flipeleven, Flip11, F11P, design, creative"/>
        <title>F11P || Flipeleven</title>

        <!-- <meta property="og:title" content="2C Media" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://2c.tv" />
        <meta property="og:image" content="http://2c.tv/assets/images/common/logo.png" />
        <meta property="og:description" content="2C Media is a creative promotional video and original content creator in Miami, Florida." />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@2CMediaTV"/>
        <meta name="twitter:url" content="http://2c.tv" />
        <meta name="twitter:title" content="2C Media" />
        <meta name="twitter:description" content="2C Media is a creative promotional video and original content creator in Miami, Florida." />
        <meta name="twitter:image" content="http://2c.tv/assets/images/common/logo.png" />
        <link rel="apple-touch-icon" href="http://2c.tv/assets/images/common/logo.png"/>
        <link rel="icon" type="image/x-icon" href="http://activetheory-v2.s3.amazonaws.com/assets/images/favicon.ico"> -->

        <link href="/css/main.css" rel="stylesheet" type="text/css">
        <script type="text/javascript" src="/js/data.js"></script>
        <?php echo strpos($_SERVER['HTTP_HOST'],'dev') || strpos($_SERVER['HTTP_HOST'],'local') ? '<script type="text/javascript" src="/js/main.js"></script>' : '<script type="text/javascript" src="/js/main.min.js"></script>'; ?>
    </head>
    <body>
    </body>
</html>
