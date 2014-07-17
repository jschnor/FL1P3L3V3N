<?php

// load viewer library
$libraryPath = 'cmsAdmin/lib/viewer_functions.php';
$dirsToCheck = array('C:/xampp/htdocs/flipeleven-updates/','','../','../../','../../../');
foreach ($dirsToCheck as $dir) { if (@include_once("$dir$libraryPath")) { break; }}
if (!function_exists('getRecords')) { die("Couldn't load viewer library, check filepath in sourcecode."); }
if (!@$GLOBALS['WEBSITE_MEMBERSHIP_PLUGIN']) { die("You must activate the Website Membership plugin before you can access this page."); }

// error checking
$errorsAndAlerts = alert();
if (@$CURRENT_USER)                                { $errorsAndAlerts .= "You are already logged in! <a href='/'>Click here to continue</a> or <a href='?action=logoff'>Logoff</a>.<br/>\n"; }
if (!$CURRENT_USER && @$_REQUEST['loginRequired']) { $errorsAndAlerts .= "Please login to continue.<br/>\n"; }

// save url of referring page so we can redirect user there after login
if (!getPrefixedCookie('lastUrl')) { setPrefixedCookie('lastUrl', @$_SERVER['HTTP_REFERER'] ); }

?><!doctype html>
<html class="no-js" lang="en">

<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Login | F11P | Flipeleven Creative</title>
	<link rel="stylesheet" href="/css/app.css" />
	<script src="/js/modernizr.js"></script>
</head>

<body>
	<form action="" method="post" id="flip_login">
		<h1>Login</h1>

		<?php if (@$errorsAndAlerts){ ?>
		<div class="errors">
			<?php echo $errorsAndAlerts; ?>
		</div>
		<?php } ?>

		<?php if (!@$CURRENT_USER){ ?>
		<input type="hidden" name="action" value="login" />

		<p class="form-group">
			<label for="username">Email or Username</label>
			<input type="text" name="username" id="username" value="<?php echo htmlencode(@$_REQUEST['username']); ?>" size="30" />
		</p>

		<p class="form-group">
			<label for="password">Password</label>
			<input type="password" name="password" id="password" value="<?php echo htmlencode(@$_REQUEST['password']); ?>" size="30" />
		</p>

		<p class="form-group submit">
			<button type="submit" class="primary button radius">Login</button>
		</p>
		<?php } ?>
	</form>
</body>

</html>