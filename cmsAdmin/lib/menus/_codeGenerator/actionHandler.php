<?php
// define globals
global $APP; //, $SETTINGS, $CURRENT_USER, $TABLE_PREFIX;
$APP['selectedMenu'] = 'admin'; // show admin menu as selected

// for debugging
$GLOBALS['CG2_DEBUG'] = false; // add "Debug: Run Viewer >>" button on code page that runs PHP code

### check access level
if (!$GLOBALS['CURRENT_USER']['isAdmin']) {
  alert(t("You don't have permissions to access this menu."));
  showInterface('');
}

// load common generator functions
include "generator_functions.php";

// register internal generators
$internalGenerators = array('listPage','detailPage', 'comboPage', 'rssFeed'); // this order is maintained
foreach ($internalGenerators as $file) { require_once($file .".php"); }



// Dispatch generators
if (@$_REQUEST['_generator']) {
  $generator = array_where(getGenerators('all'), array('function' => $_REQUEST['_generator']));
  $generator = array_shift($generator);
  $error     = sprintf("Unknown generator '%s'!", htmlencode($_REQUEST['_generator']) );
  if ($generator) { call_user_func($generator['function'], $generator['function'], $generator['name'], $generator['description'], $generator['type']); }
  else            { cg2_homepage($error); }
  exit;
}

// show menu (if no generator specified)
cg2_homepage();
exit;


// Show menu of code generators
function cg2_homepage($error = '') {
  if ($error) { alert($error); }

  // header
  $title  = t('Admin')." &gt; <a href='?menu=_codeGenerator'>".t('Code Generator')."</a>\n";
  $html   = plugin_header('###TITLE###', '', false);
  $html   = preg_replace('/###TITLE###/', $title, $html);

  // list internal generators
  $html .= _cg2_getGeneratorList(
    t("Create a Viewer"),
    t("'Viewers' are PHP files that display the data from the CMS in all the different 'views' you might have on your site."),
    "private"
  );


  // list other generators (added by plugins)
  $html .= _cg2_getGeneratorList(
    t("Other Generators"),
    t("Plugins can add their own code generators here"),
    "public"
  );

  // footer
  $html .= plugin_footer();

  //
  print $html;
  exit;
}

// show list of generators for generator homepage
function _cg2_getGeneratorList($heading, $description, $type) {
  $html       = '';

  // list header
  $html .= "<h3>" .htmlencode(t($heading)). "</h3>\n";
  $html .= "<div style='margin-left: 25px'>\n";
  $html .= "  " .htmlencode($description). "\n";
  $html .= "<table class='data' style='width: inherit'>\n";
  $html .= "<tr><td colspan='2'></td></tr>"; // adds top line to row set

  // list rows
  $rows = '';
  foreach (getGenerators($type) as $generator) {
    $trClass  = '';//(@$trClass == "listRowOdd") ? 'listRowEven' : 'listRowOdd'; # rotate bgclass
    $link     = "?menu=" .urlencode(@$_REQUEST['menu']). "&amp;_generator=" .urlencode($generator['function']);
    if (@$_REQUEST['tableName']) { $link .= "&amp;tableName=" . urlencode($_REQUEST['tableName']); }
    $rows    .= "<tr class='listRow $trClass'>\n";
    $rows    .= " <td><a href='$link'>" .htmlencode(t($generator['name'])). "</a></td>\n";
    $rows    .= " <td>" .htmlencode(t($generator['description'])). "</td>\n";
    $rows    .= "</tr>\n";
  }
  if (!$rows) {
    $rows    .= "<tr class='listRow'>\n";
    $rows    .= " <td colspan='2' style='color: #999'>".t('There are current no generators in this category.')."</td>\n";
    $rows    .= "</tr>\n";
  }
  $html .= $rows;

  // list footer
  $html .= "</table>\n";
  $html .= "</div><br/><br/>\n";

  //
  return $html;
}





?>
