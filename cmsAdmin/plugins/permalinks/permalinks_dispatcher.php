<?php header('Content-type: text/html; charset=utf-8'); ?>
<?php
  // Permalinks Dispatcher - This script loads the appropriate viewer based on the permalink

  // load viewer library
  $libraryPath = 'lib/viewer_functions.php';
  $dirsToCheck = array('../','../../','../../../','../../../../');
  foreach ($dirsToCheck as $dir) { if (@include_once("$dir$libraryPath")) { break; }}
  if (!function_exists('getRecords')) { die("Couldn't load viewer library, check filepath in sourcecode."); }

  // get redirect url
  $REDIRECT_URL = coalesce(@$_SERVER['REDIRECT_URL'], @$_SERVER['SCRIPT_URL'], array_first(explode('?',$_SERVER['REQUEST_URI'])));
  // NOTE: mod_rewrite adds keys to $_SERVER prefixed with: REDIRECT_
  // NOTE: For servers that don't set REDIRECT_URL we can check SCRIPT_URL AND REQUEST_URI (reverse order if needed because of other servers settings vars differently).

  // remove prefix url, these are sometimes used for preview domains or dev server urls eg: /~username or /development/client-name/
  $REDIRECT_URL = str_replace(PREFIX_URL, '', $REDIRECT_URL);

  // error checking
  if (!@$GLOBALS['PERMALINKS_PLUGIN']) { dieAsCaller("Please activate the Permalinks plugin!"); }
  if (!$REDIRECT_URL) {
    print "Dispatcher: No mod_rewrite url detected!<br/>\n";
    // debugging - uncomment the next line
    //print "<xmp>\$_SERVER = ".print_r($_SERVER, true)."\n\$_REQUEST = ".print_r($_REQUEST, true)."\n</xmp>";
    exit;
  }

  // get permalink
  $permalinkText   = preg_replace("!^/|/$!", '', $REDIRECT_URL);
  $permalinkRecord = mysql_get('_permalinks', null, array('permalink' => $permalinkText));

  // if old permalink, redirect to latest one
  if ($permalinkRecord && $permalinkRecord['old']) {
    $whereEtc   = mysql_escapef("`tableName` = ? AND `recordNum` = ? AND `old` = '0'", $permalinkRecord['tableName'], $permalinkRecord['recordNum']);
    $latestLink = mysql_get('_permalinks', null, $whereEtc);
    header("Location: /{$latestLink['permalink']}/", true, 301); // 301 Moved Permanently
    exit;
  }

  // 404 Not Found - show error page if no permalink record found
  if (!$permalinkRecord) {
    if (!is_file($GLOBALS['PERMALINKS']['404_not_found_filepath'])) { die("Couldn't find filepath for 404 page: '" .htmlspecialchars($GLOBALS['PERMALINKS']['404_not_found_filepath']). "'!\n"); }
    include $GLOBALS['PERMALINKS']['404_not_found_filepath'];
    exit;
  }



  // get filepath to custom page or detail page viewer for permalink, eg: /www/e/example_com/htdocs/news_detail.php
  list($viewerAbsPath, $pathErrors) = _permalink_getAbsolutePath($permalinkRecord['tableName'], $permalinkRecord['customSourceUrl']);
  if ($pathErrors) { die( nl2br(htmlencode($pathErrors)) ); }

  // debug
  //showme($_SERVER);
  //_permalink_web_showDebugInfo($permalinkText, $permalinkRecord, $viewerFilepath); exit;

  // Fake QUERY_STRING and $_GET values so viewers can get record number and extra values
  foreach (array($permalinkRecord['tableName'], $permalinkRecord['customSourceUrl']) as $urlAndQuery) {
    @list(,$querystring) = explode('?', $urlAndQuery);
    parse_str($querystring, $namesToValues);
    foreach ($namesToValues as $name => $value) {
      $_GET[$name]              = $value;
      $_REQUEST[$name]          = $value;
      $_SERVER['QUERY_STRING'] .= "&$name=" . urlencode($value);
    }
  }
  if ($permalinkRecord['recordNum']) {  // fake num, so viewers can get the record num
    $_GET['num']              = $permalinkRecord['recordNum'];
    $_REQUEST['num']          = $permalinkRecord['recordNum'];
    $_SERVER['QUERY_STRING'] .= "&num=" . $permalinkRecord['recordNum'];
  }
  $_SERVER['QUERY_STRING'] = trim($_SERVER['QUERY_STRING'], '&'); // remove leading/trailing & (in case there was no query string before we started adding data)
  $_SERVER['SCRIPT_NAME'] = $REDIRECT_URL; // fake SCRIPT_NAME, so thisPageUrl and self-referencing code works

  // chdir to the dir of the included file so relative include paths work, eg: include("includes/header.php");
  chdir(dirname($viewerAbsPath));

  //$_GET['tableName'] = $permalinkRecord['tableName'];
  //$_SERVER['SCRIPT_NAME_ORIGINAL'] = $_SERVER['SCRIPT_NAME'];

  // debug
  //_permalink_web_showDebugInfo($permalinkText, $permalinkRecord, $viewerFilepath); exit;

  // include viewer
  include $viewerAbsPath;
  exit;

//
function _permalink_web_showDebugInfo($permalinkText, $permalinkRecord, $viewerFilepath) {

  header("Content-type: text/plain");
  print "Permalinks Dispatcher: Debug mode\n";
  print "----------------------------------------------------------------------\n";

  print "\n\$permalinkText = " . print_r($permalinkText, true);
  print "\n\$viewerFilepath = " . print_r($viewerFilepath, true);
  print "\n\n\$permalinkRecord = " . print_r($permalinkRecord, true);
  print "\n\$_REQUEST = " . print_r($_REQUEST, true);

  // Show $_SERVER
  print "\n\$_SERVER = ";
  foreach ($_SERVER as $key => $value) {
    if (!preg_match("/REDIRECT|SCRIPT_NAME|QUERY/", $key)) { unset($_SERVER[$key]); }
  }
  print_r($_SERVER);
  exit;
}
?>