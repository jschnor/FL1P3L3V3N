
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

function saveJSON($portfolio){
  $data = array('portfolio'=>array());

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

  $filename = 'js/portfolio.json';

  $fh = fopen($filename, 'w');
  fwrite($fh, json_encode($data));
  fclose($fh);

  // print_r(json_encode($data));
}

saveJSON($work_flipRecords);

/*echo '<pre>';
print_r($_REQUEST);
echo '</pre>';*/

// autoload composer packages
require 'vendor/autoload.php';

// load content based on request
$request = '';
if (isset($_REQUEST['q'])){
  $request = $_REQUEST['q'];
}
switch ($request){
  case 'login':
  include('login.php');
  break;

  case 'sell-sheet':
  include('sell-sheet-form.php');
  break;

  default:
  // home page
  include('home.php');
  break;
}