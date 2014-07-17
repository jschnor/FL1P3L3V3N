<?php
// load viewer library
$libraryPath = 'cmsAdmin/lib/viewer_functions.php';
$dirsToCheck = array('C:/xampp/htdocs/flipeleven-updates/','','../','../../','../../../');
foreach ($dirsToCheck as $dir) { if (@include_once("$dir$libraryPath")) { break; }}
if (!function_exists('getRecords')) { die("Couldn't load viewer library, check filepath in sourcecode."); }
if (!@$GLOBALS['WEBSITE_MEMBERSHIP_PLUGIN']) { die("You must activate the Website Membership plugin before you can access this page."); }

// error checking
$errorsAndAlerts = "";
if (!$CURRENT_USER) { websiteLogin_redirectToLogin(); }

if ($_SERVER['REQUEST_METHOD'] == 'POST' && @$_POST['save']) {
}

?><!doctype html>
<html class="no-js" lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sell Sheet Generator | F11P | Flipeleven Creative</title>
  <link rel="stylesheet" href="/css/app.css" />
  <script src="/js/modernizr.js"></script>
</head>

<body>
  <form action="" method="post" id="sell_sheet">
    <h1>Generate Sell Sheet</h1>

    <?php if (@$errorsAndAlerts){ ?>
    <div class="errors">
      <?php echo $errorsAndAlerts; ?>
    </div>
    <?php } ?>

    <input type="hidden" name="action" value="login" />

    <p class="form-group">
      <label for="username">Email or Username</label>
      <input type="text" name="username" id="username" value="<?php echo htmlencode(@$_REQUEST['username']); ?>" size="30" />
    </p>

    <p class="form-group submit">
      <button type="submit" class="primary button radius">Generate</button>
    </p>
  </form>
</body>

</html>