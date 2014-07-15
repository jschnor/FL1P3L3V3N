<?php
  header('Content-type: text/html; charset=utf-8');
  global $APP, $SETTINGS, $CURRENT_USER, $TABLE_PREFIX, $SHOW_EXPANDED_MENU;
  $SHOW_EXPANDED_MENU = @array_key_exists('showExpandedMenu', $CURRENT_USER) ? $CURRENT_USER['showExpandedMenu'] : $SETTINGS['advanced']['showExpandedMenu'];
  require_once "lib/menus/header_functions.php";
?>
<!DOCTYPE html
          PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <title><?php echo htmlencode($SETTINGS['programName']) ?></title>
  <meta name="robots" content="noindex,nofollow" />
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="chrome=1" />
  <meta http-equiv="X-UA-Compatible" content="ie=8" /><?php // See: http://www.quirksmode.org/blog/archives/2009/09/google_chrome_f.html ?>

  <?php include "lib/menus/header_css.php"; ?>

  <!-- javascript -->
  <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
  <script>window.jQuery || document.write('<script src="3rdParty/jquery-1.11.0.min.js"><\/script>')</script>
  
  <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
  <script>jQuery.migrateWarnings || document.write('<script src="3rdParty/jquery-migrate-1.2.1.min.js"><\/script>')</script>
  
  <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script><?php /* for datepicker and jquery sortable */ ?>
  <script>window.jQuery.ui || document.write('<script src="3rdParty/jquery-ui-1.10.4.min.js"><\/script>')</script>
  
  <link   type="text/css"       href="3rdParty/jqueryUI/css/smoothness/jquery-ui-1.8.18.custom.css" rel="stylesheet" />
  <script src="3rdParty/json2.js"></script>
  <script src="lib/admin_functions.js?<?php echo filemtime('lib/admin_functions.js'); // on file change browsers should no longer use cached versions ?>"></script>
  <script src="lib/dragsort.js?<?php echo filemtime('lib/dragsort.js'); // on file change browsers should no longer use cached versions ?>"></script>
  <!--[if lte IE 6]><script src="3rdParty/jqueryPlugins/DD_belatedPNG_0.0.7a.js"></script><![endif]-->
  <!--[if lte IE 6]><script>DD_belatedPNG.fix('#main-content ul li, #sidebar-title img')</script><![endif]-->
  <script><!-- // language strings for javascript prompts
  lang_confirm_erase_record = '<?php echo addslashes(t("Delete this record? Are you sure?")) ?>';
  //--></script>
  <?php if (is_file("{$GLOBALS['PROGRAM_DIR']}/custom.js")): ?>
    <script src="custom.js"></script>
  <?php endif ?>
  <!-- /javascript -->

  <!-- datepicker -->
  <?php $datepickerLangUrl = "3rdParty/jqueryUI/i18n/jquery.ui.datepicker-{$SETTINGS['language']}.js"; ?>
  <?php if (is_file("{$GLOBALS['PROGRAM_DIR']}/$datepickerLangUrl")): ?>
    <script src="<?php echo htmlencode($datepickerLangUrl); ?>"></script>
  <?php endif ?>
  <!-- /datepicker -->

  <?php doAction('admin_head'); ?>
</head>

<body class="simpla">
  <div id="body-wrapper"> <!-- Wrapper for the radial gradient background -->

  <?php include "lib/menus/sidebar.php" ?>

  <div id="main-content"> <!-- Main Content Section with everything -->

  <noscript> <!-- Show a notification if the user has disabled javascript -->
    <div class="notification error png_bg">
      <div><?php et("Javascript is disabled or is not supported by your browser. Please upgrade your browser or enable Javascript to navigate the interface properly."); ?></div>
    </div>
  </noscript>

  <?php displayAlertsAndNotices(); ?>
