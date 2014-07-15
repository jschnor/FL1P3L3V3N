<?php
  // load viewer library
  if (!function_exists('getRecords')) { // skip if already loaded
    $libraryPath = 'lib/viewer_functions.php';
    $dirsToCheck = array('../','../../','../../../','../../../../');
    foreach ($dirsToCheck as $dir) { if (@include_once("$dir$libraryPath")) { break; }}
  }
  if (!function_exists('getRecords')) { die("Couldn't load viewer library, check filepath in sourcecode."); }

  ### If you already have a 404 page you want to use just change the URL below and uncomment it the line
  //$alternate404Url = "http://www.example.com/some-other-404-page.php";
  if (@$alternate404Url) {
    redirectBrowserToURL($alternate404Url);
    exit;
  }

  ### Otherwise feel free to style this page, it's shown whenever a permalink can't be found
  header("HTTP/1.0 404 Not Found");
  $REDIRECT_URL = coalesce(@$_SERVER['REDIRECT_URL'], @$_SERVER['SCRIPT_URL'], array_first(explode('?',$_SERVER['REQUEST_URI'])));

  // debugging - uncomment the next line
  //print "<xmp>\$_SERVER = ".print_r($_SERVER, true)."\n\$_REQUEST = ".print_r($_REQUEST, true)."\n</xmp>";

?>
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>404 Not Found</title>
</head><body>
<h1>Not Found</h1>
<p>The requested URL <?php echo htmlspecialchars($REDIRECT_URL); ?> was not found on this server.</p>
<hr>
<address>Permalinks Dispatcher at <?php echo htmlspecialchars($_SERVER['HTTP_HOST']) ?> Port <?php echo htmlspecialchars($_SERVER['SERVER_PORT']); ?></address>
</body></html>