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

// Process form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST' && @$_POST['generate']) {


	// check for uploaded client logo
	if ($_FILES["logo_upload"]["error"] === 0) {
		// save client logo to logos folder
		$filename = $_FILES["logo_upload"]["name"];
		$temp_loc = $_FILES["logo_upload"]["tmp_name"];

		// get file extension and rename for uniqueness
		$split = explode('.', $filename);
		$ext = array_pop($split);
		$now = time();
		$filename = implode('.', $split).$now.'.'.$ext;

		$client_logo_path = $_SERVER['DOCUMENT_ROOT'].'sellsheets/client-logos/'.$filename;
		move_uploaded_file($temp_loc, $client_logo_path);
	}

	// load PDF generator
	require_once('sell-sheet-generate.php');
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
	<form action="" method="post" id="sell_sheet" enctype="multipart/form-data">
		<h1>Generate Sell Sheet</h1>

		<?php if (@$errorsAndAlerts){ ?>
		<div class="errors">
			<?php echo $errorsAndAlerts; ?>
		</div>
		<?php } ?>

		<input type="hidden" name="generate" value="true" />

		<p class="form-group">
			<label for="logo_upload">Client Logo</label>
			<input type="file" name="logo_upload" id="logo_upload" />
		</p>

		<p class="form-group">
			<label for="personal_info">Personal Contact Info</label>
			<textarea name="personal_info" id="personal_info"></textarea>
			<span class="note">Newlines will be converted to line breaks.</span>
		</p>

		<p class="form-group submit">
			<button type="submit" class="primary button radius">Generate</button>
		</p>
	</form>
</body>

</html>