<?php /*><h2>NOTE: If you are seeing this in your web browser it means PHP isn't setup correctly!<br/>Ask your web host to enable PHP or to give you instructions on how to run PHP scripts. <!-- */

  define('START_SESSION', true);
  define('IS_CMS_ADMIN', true);
  global $APP, $SETTINGS, $TABLE_PREFIX, $CURRENT_USER;
  require_once "lib/init.php";
  require_once "lib/login_functions.php";
  require_once "lib/user_functions.php";
  require_once "lib/admin_functions.php";

  ### pre-login actions
  $menu = @$_REQUEST['menu'];
  if ($menu == "forgotPassword") { forgotPassword(); }
  if ($menu == "resetPassword")  { resetPassword(); }
  if ($menu == 'license')        { showInterface('license.php'); }

  ### Login
  doAction('admin_prelogin');
  adminLoginMenu();
  doAction('admin_postlogin');

  ### Dispatch actions
  if ($menu == 'home' || !$menu) { showInterface('home.php'); }
  else                           { include "lib/menus/default/actionHandler.php"; }

?>
