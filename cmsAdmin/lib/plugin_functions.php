<?php

// execute active plugins
function loadPlugins() {
  if (!isInstalled()) { return; }
  $pluginsDir = "{$GLOBALS['PROGRAM_DIR']}/plugins";
  $pluginList = getPluginList();

  //
  foreach ($pluginList as $filename => $pluginData) {
    if ($pluginData['isActive']) {
      $filepath = "$pluginsDir/$filename";
      include $filepath;
    }
  }
}

// return list of plugins
function getPluginList() {
  $pluginsDir = "{$GLOBALS['PROGRAM_DIR']}/plugins";

  // load and cache plugin list
  static $pluginList;
  if (!$pluginList) {
    $pluginList   = array();
    $phpFilepaths = _getPhpFilepathsFromPluginsDir();
    foreach ($phpFilepaths as $filepath) {
      $pathFromPluginsDir = str_replace("$pluginsDir/", '', $filepath); // remove base plugin dir to get path from /plugins/
      $pluginData         = _getPluginData($filepath, $pathFromPluginsDir);
      if ($pluginData) { $pluginList[$pathFromPluginsDir] = $pluginData; }
    }
  }

  // return cached plugin list
  return $pluginList;
}


// returns a list of PHP files from the /plugins/ folder.
// Skips: C-V-S folders, and files that end in .ini.php or .defaultSqlData.php
// Only looks 2 levels deep under the plugins folder, eg: /plugins/dir1/dir2/
// NOTE: This function is highly optimized for speed
function _getPhpFilepathsFromPluginsDir() {
  $pluginsDir       = "{$GLOBALS['PROGRAM_DIR']}/plugins";
  $pluginsDirLength = strlen($pluginsDir);
  $dirStack   = array($pluginsDir);
  $files      = array();

  while ($thisDir = array_pop($dirStack)) {
    $dirHandle = opendir($thisDir);
    while ($filename = readdir($dirHandle)) {
      $path = "$thisDir/$filename";
      if     ( // if file
              pathinfo($filename, PATHINFO_EXTENSION) == 'php' &&
              !preg_match("/\.(ini|defaultSqlData)\.php$/", $filename) &&
              is_file($path)
              ) {
        $files[] = $path;
      }
      elseif ( // if dir
              $filename != '.' &&
              $filename != '..' &&
              $filename != 'C'.'VS' && // this string is concatenated so the build script doesn't stop on the banned keyword
              substr_count(substr($thisDir, $pluginsDirLength), '/') < 2 && // Only scan 2 levels under /plugins/.  Eg: /plugins/dir1/dir2/
              is_dir($path)
              ) {
        $dirStack[] = $path;
      }
    }
    closedir($dirHandle);
  }
  return $files;
}

// return data about about plugin from plugin header comments
function _getPluginData($filepath, $pathFromPluginsDir) {

  // Skip PHP files without a "Plugin Name:" set in the first 2k bytes of the file (speed optimization)
  $fileHandle = @fopen($filepath, 'r');
  $fileHeader = @fread($fileHandle, 2048);
  fclose($fileHandle);
  if (!preg_match("/Plugin Name:/mi", $fileHeader)) { return; }

  // cache data
  static $activePluginFiles = array();
  if (!$activePluginFiles) {
    $activePluginFiles = preg_split('/,\s+/', @$GLOBALS['SETTINGS']['activePlugins']);
  }

  // plugin data to match
  static $textKeyToFieldname = array();
  if (!$textKeyToFieldname) {
    $textKeyToFieldname['Plugin Name']            = 'name';            // shown in plugin menu
    $textKeyToFieldname['Plugin URI']             = 'uri';             // shown in plugin menu
    $textKeyToFieldname['Version']                = 'version';         // shown in plugin menu
    $textKeyToFieldname['Description']            = 'description';     // shown in plugin menu
    $textKeyToFieldname['Author']                 = 'author';          // shown in plugin menu
    $textKeyToFieldname['Author URI']             = 'authorUri';       // shown in plugin menu
    #$textKeyToFieldname['Text Domain']           = 'textDomain';      // not yet used
    #$textKeyToFieldname['Domain Path']           = 'domainPath';      // not yet used
    $textKeyToFieldname['Requires at least']      = 'requiresAtLeast'; // minimum CMS version required.  Plugin can't be activated if CMS version isn't high enough
    $textKeyToFieldname['Required System Plugin'] = 'isSystemPlugin';  // always load this plugin - can't be de-activated
  }

  // load values from plugin header
  $pluginData = array();
  $pluginData['filename'] = $pathFromPluginsDir;
  foreach ($textKeyToFieldname as $textKey => $fieldname) {
    preg_match("/$textKey:(.*?)(\r|\n)/mi", $fileHeader, $matches); // match \r as well for mac users who uploaded file in ascii with wrong line end chars (and windows users who would be \r\n)
    $pluginData[$fieldname] = $matches ? trim(@$matches[1]) : '';
  }


  // set calculated values
  $hasRequiredCmsVersion = ($pluginData['requiresAtLeast'] <= $GLOBALS['APP']['version']);
  $pluginData['isActive'] = $hasRequiredCmsVersion && ($pluginData['isSystemPlugin'] || in_array($pathFromPluginsDir, $activePluginFiles));

  //
  return $pluginData;
}

// Plugin paths are stored as relative from plugin dir, eg: superwidget/sw_plugin.php
// This function returns true if specified filename or path matches an active plugin exactly (eg: superwidget/sw_plugin.php)
// 2.52 - Now also returns true if relative plugin path "endsWith" string, eg: sw_plugin.php now matches
// ... we do this so: Section Editors > Advanced (tab) > Required Plugins, can use filenames only since users tend to rename plugin dirs.
function isPluginActive($filename) {

  // load active plugin paths
  static $activePluginPaths;
  if (!isset($activePluginPaths)) {
    $activePluginPaths = array();
    foreach (getPluginList() as $relativePluginPath => $pluginDetails) {
      if (!$pluginDetails['isActive']) { continue; } // skip inactive plugins
      $activePluginPaths[] = $relativePluginPath;
    }
  }

  // check if filename or path is active
  $isActive = false;
  foreach (array_values($activePluginPaths) as $relativePluginPath) {
    if (!endsWith($filename, $relativePluginPath)) { continue; }
    $isActive = true;
    break;
  }

  return $isActive;
}

// add generator, or call with no args to return generator list
function addGenerator($functionName = '', $name = '', $description = '') {
  $generators = &$GLOBALS[__FILE__][__FUNCTION__]['generators'];
  if (!isset($generators)) { $generators = array(); }

  // return generator list (if no args specified)
  if (!$functionName && !$name && !$description) { return $generators; }

  // is this a built in generator? (built-in generators show in a list above plugin added generators)
  $callerFilepath = fixSlashes(array_value(array_value(debug_backtrace(),'0'),'file'));
  if     (preg_match('|/plugins/|', $callerFilepath))        { $isBuiltIn = false; }
  elseif (preg_match('|/_codeGenerator/|', $callerFilepath)) { $isBuiltIn = true; }
  else { dieAsCaller("addGenerator() can only be called from plugins in /plugins/ or in /lib/menus/_codeGenerator/, not $callerFilepath!"); }

  // add new generator
  $generators[] = array(
    'function'    => $functionName,
    'name'        => $name,
    'description' => $description,
    'type'        => $isBuiltIn ? 'private' : 'public',
  );
}


//
function getGenerators($type) {

  // get generator list
  $generators = addGenerator();

  // filter list by type
  if     ($type == 'all')     { $generators = $generators; }
  elseif ($type == 'public')  { $generators = array_where($generators, array('type' => 'public')); }
  elseif ($type == 'private') { $generators = array_where($generators, array('type' => 'private')); }
  else { dieAsCaller(__FUNCTION__ . ": Unknown type argument '" .htmlencode($type). "'!"); }

  // sort 'public' generators by 'name'
  if ($type == 'public') {
    array_multisort(
      array_pluck($generators, 'name'), SORT_ASC,
      $generators
    );
  }

  //
  return $generators;
}

//
// $priority is sorted numerically with lower numbers running first: -1, 0, 1, 10, 100, etc
function addAction($hookName, $functionName, $priority = 10, $acceptedArgs = 1) {
  if (!$hookName)     { die(__FUNCTION__ . ": No hookname specified!"); }
  if (!$functionName) { die(__FUNCTION__ . ": No functioname specified!"); }

  // add actions
  $actionList = &_getActionList();
  $actionList[$hookName][$priority][$functionName] = $acceptedArgs;
}

// alias for add_action
// $priority is sorted numerically with lower numbers running first: -1, 0, 1, 10, 100, etc
function addFilter($hookName, $functionName, $priority = 10, $acceptedArgs = 1) {
  return addAction($hookName, $functionName, $priority, $acceptedArgs);
}

// note, the same args are passed to every plugins
function doAction($hookName, $arg = '') {
  #print "doAction: $hookName<br/>\n"; # debug
  $actionList = &_getActionList();

  // skip if no actions registered
  if (!@$actionList[$hookName]) { return; }
  #showme($actionList[$hookName]); // debug

  // execute all registered actions for named hook
  ksort($actionList[$hookName], SORT_NUMERIC); // order by priority
  foreach ($actionList[$hookName] as $functionAndArgsArray) {
    foreach ($functionAndArgsArray as $functionName => $acceptedArgs) {
      if (!function_exists($functionName)) {
        print "Plugin hook $hookName called undefined function $functionName()<br/>\n";
        continue;
      }
      $functionArgs = array_slice(func_get_args(), 1, $acceptedArgs); // Note: This won't maintain reference, to pass by reference pass as array that contains a reference
      call_user_func_array($functionName, $functionArgs);
    }
  }

  //
  return true;
}

// note, the first arg is the value to be filtered and the modified value is passed forward to each plugin
function applyFilters($hookName, $filteredValue = '') {
  # print "applyFilters: $hookName<br/>\n"; # debug

  // skip if no filters registered
  $actionList = &_getActionList();
  if (!@$actionList[$hookName]) { return $filteredValue; }

  // execute all registered filters for named hook
  ksort($actionList[$hookName], SORT_NUMERIC); // order by priority
  foreach ($actionList[$hookName] as $functionAndArgsArray) {
    foreach ($functionAndArgsArray as $functionName => $acceptedArgs) {
      $functionArgs = array_slice(func_get_args(), 1, $acceptedArgs);
      if ($acceptedArgs) { $functionArgs[0] = $filteredValue; } // set first arg to already filtered value
      $filteredValue = call_user_func_array($functionName, $functionArgs);
    }
  }

  //
  return $filteredValue;
}


// $actionList = &_getActionList();
function &_getActionList() {
  static $actionList = array();
  return $actionList;
}

// add a scheduled cronjob to be dispatched by cron.php and logged in CMS
// Cron Expression Format: minute(0-59), hour(0-23), dayOfMonth(1-31), month(1-12), dayOfWeek(0-7, 0=Sunday)
// Supports: *(any/all), 6(numbers), 1-3(ranges), 15,30,45(number lists)
// Note: Cronjob functions should return any content they want added to the log as the "Summary" and print/echo any content they wanted displayed as "output" textbox
// Example: addCronJob('my_function1', 'Activity Name', '5 * * * *');  // Run at 5 minutes after every hour
// Example: addCronJob('my_function2', 'Activity Name', '0 1 * * 0');  // Run at 1am every Sunday Night
function addCronJob($functionName, $activityName, $cronExpression) {
  if (!$functionName)                  { dieAsCaller(__FUNCTION__ . ": No functioname specified!"); }
  if (!function_exists($functionName)) { dieAsCaller(__FUNCTION__ . ": Specified function '" .htmlencode($functionName). "' doesn't exist!"); }

  // add actions
  $cronList = &getCronList();
  if (array_key_exists($functionName, $cronList)) { dieAsCaller(__FUNCTION__ . ": Specified function '" .htmlencode($functionName). "' already exists in cron list!"); }
  $cronList[$functionName] = array(
    'function' => $functionName,
    'activity' => $activityName,
    'expression' => $cronExpression,
  );
}

// $cronList = &_getCronList();
function &getCronList() {
  static $cronList = array();
  return $cronList;
}

//
function activatePlugin($file) {
  global $SETTINGS;

  // test for errors - if this dies it won't activate the plugin
  $pluginsDir = "{$GLOBALS['PROGRAM_DIR']}/plugins";
  include "$pluginsDir/$file";

  // add plugin to list
  $activePluginFiles = array();
  $activePluginFiles[$file] = 1;
  foreach (preg_split('/,\s+/', $SETTINGS['activePlugins']) as $activeFile) {
    $activePluginFiles[$activeFile] = 1;
  }

  // save settings
  $GLOBALS['SETTINGS']['activePlugins'] = join(', ', array_keys($activePluginFiles));
  saveSettings();

  //
  doAction( 'plugin_activate', $file );
}

function deactivatePlugin($file) {
  global $SETTINGS;

  // remove plugin from list
  $activePluginFiles = array();
  foreach (preg_split('/,\s+/', $SETTINGS['activePlugins']) as $activeFile) {
    $activePluginFiles[$activeFile] = 1;
  }
  unset($activePluginFiles[$file]);

  // save settings
  $GLOBALS['SETTINGS']['activePlugins'] = join(', ', array_keys($activePluginFiles));
  saveSettings();

  doAction( 'plugin_deactivate', $file );
}

// list($pluginPath, $pluginUrl) = getPluginPathAndUrl();
// return path/url of the current plugin, or the last plugin called in the call stack.  You can
// ... also specify an alernate filename to get the path and url of files or folders in or under the plugin folder
function getPluginPathAndUrl($alernateFilename = '', $callerDepth_NO_LONGER_USED_AS_OF_212 = 0) {
  if ($callerDepth_NO_LONGER_USED_AS_OF_212) { dieAsCaller(__FUNCTION__ . "() no longer supports 2nd argument, please update your code!"); }

  $pluginPath = '';
  $pluginUrl  = '';

  foreach (debug_backtrace() as $caller) {
    $callerFilepath = fixSlashes(@$caller['file']);
    if (!preg_match('|/plugins/|', $callerFilepath)) { continue; }

    // get path and url
    $pluginPath   = $callerFilepath;
    $pluginPath   = preg_replace("|^.*plugins/(.*?)$|", '\1', $pluginPath);       // eg: myPlugin/myPlugin.php
    $pluginUrl    = str_replace(' ', '%20', @$_SERVER['SCRIPT_NAME']);            // url encoded spaces
    $pluginUrl    = preg_replace("|[^/]+$|", "plugins/$pluginPath", $pluginUrl);  // eg: /myCMS/plugins/myPlugin/myPlugin.php

    // use alternate filename
    if ($alernateFilename) {
      $pluginPath = preg_replace("|[^/]+$|", $alernateFilename, $pluginPath);
      $pluginUrl  = preg_replace("|[^/]+$|", $alernateFilename, $pluginUrl);
    }

    break;
  }

  // error checking
  if (!$pluginPath) {
    $error  = __FUNCTION__ . ": Couldn't find any plugins in caller stack.  This function can only be called by source files under the /plugins/ folder!<br/>\n";
    die($error);
  }

  //
  return array($pluginPath, $pluginUrl);
}

// return header for plugin UI pages
// echo plugin_header('Page Title Here');
function plugin_header($title, $buttonsHTML = '', $showDefaultButton = true) {

  // if no buttons specified show "Back to Plugins >>" by default
  if ($showDefaultButton) {
    $buttonsHTML .= '<input class="button" type="button" name="null" value="Back to Plugins &gt;&gt;" onclick="window.location=\'?menu=admin&amp;action=plugins\'"/>';
  }

  //
  ob_start();
  showHeader();
  ?>
    <div class="clear"></div>

    <div class="content-box">
      <form method="post" action="?">

      <div class="content-box-header">
        <h3><?php echo htmlencode($title); ?></h3>

        <div style="float:right;">
          <?php echo $buttonsHTML; ?>
        </div>

        <div class="clear"></div>
      </div> <!-- End .content-box-header -->

      <div class="content-box-content">
  <?php
  $html = ob_get_clean();
  return $html;
}


// return footer for plugin UI pages
// echo plugin_footer();
function plugin_footer() {
  ob_start();
  ?>

      </div><!-- End .content-box-content -->
      </form>
    </div><!-- End .content-box -->
  <?php
  showFooter();

  $html = ob_get_clean();
  return $html;
}



// create schemas from /plugins/pluginDir/pluginSchemas/ if they don't already exist
// Usage: plugin_createSchemas(array('plgn_data', 'plgn_news', 'plgn_clicks'));
function plugin_createSchemas($tableNames = array()) {
  $sourceDir = SCRIPT_DIR .'/plugins/'. array_value( getPluginPathAndUrl("pluginSchemas/"), 0);
  $targetDir = realpath(DATA_DIR . '/schema');
  if (!file_exists($sourceDir)) { die(__FUNCTION__ . ": Schema source dir doesn't exist: '$sourceDir'!"); }

  // if no tablenames specified load all schemas in /pluginSchemas/ - call from your plugin like this:
  // Usage: plugin_createSchemas(); // create all schemas in /plugins/yourPlugin/pluginSchemas/
  if (!$tableNames) {
    foreach (scandir($sourceDir) as $filename) {
      if (!endsWith('.ini.php', $filename)) { continue; }
      $tableNames[] = basename($filename, '.ini.php');
    }
  }

  //
  foreach ($tableNames as $basename) {
    // get paths
    $targetSchema = "$targetDir/$basename.ini.php";
    $targetData   = "$targetDir/$basename.defaultSqlData.php";
    $sourceSchema = "$sourceDir/$basename.ini.php";
    $sourceData   = "$sourceDir/$basename.defaultSqlData.php";

    // skip if schema already exists
    if (file_exists($targetSchema)) { continue; }

    // copy default data (if supplied)
    if (file_exists($sourceData)) {
      copy($sourceData, $targetData);
      if (!file_exists($targetData)) { die(__FUNCTION__ .": Error writing to '$targetData'! $php_errormsg"); }
    }

    // copy/create schema
    createSchemaFromFile( $sourceSchema );
  }
}



// adds a link to the plugin menu that calls a function in your plugin when clicked
// Add this code to the top of your plugin:
// pluginAction_addHandlerAndLink('test command', 'plgn_function', 'admins');
// $requiredAccess can be 'admins', 'users', 'all'
function pluginAction_addHandlerAndLink($linkName, $functionName, $requiredAccess = 'admins') {

  // add handler
  pluginAction_addHandler($functionName, $requiredAccess);

  // save links
  $linkHTML = "<a href='" .pluginAction_getLink($functionName). "'>" .htmlencode($linkName). "</a><br/>\n";
  list($pluginPath, $pluginUrl) = getPluginPathAndUrl(null);
  @$GLOBALS['PLUGIN_ACTION_MENU_LINKS'][$pluginPath] .= $linkHTML;

  // this function is called to add links
  if (function_exists('_pluginAction_addHandlerAndLink')) { return; }
  function _pluginAction_addHandlerAndLink($pluginPath) {
    echo @$GLOBALS['PLUGIN_ACTION_MENU_LINKS'][$pluginPath];
  }
  addAction('plugin_actions', '_pluginAction_addHandlerAndLink');
}


// call a function specified by pluginAction_getLink().  Use this for executing functions called by custom links in your plugin
// Add this code to the top of your plugin:
// pluginAction_addHandler('plgn_function', 'admins');
function pluginAction_addHandler($functionName, $requiredAccess = 'admins') {
  if (!function_exists($functionName)) { die(__FUNCTION__. ": Can't add plugin action handler, function '" .htmlencode($functionName). "' doesn't exist!"); }
  if (strtolower(@$_REQUEST['_pluginAction']) != strtolower($functionName)) { return; } // only run when plugin action is being called

  // error checking
  $validAccessTypes = array('admins', 'users', 'all');
  if (!in_array($requiredAccess, $validAccessTypes)) {
    $typesAsCSV = join(', ', $validAccessTypes);
    dieAsCaller(__FUNCTION__ . ": invalid 2nd argument for 'required access' must be one of ($typesAsCSV).  Please update your code!");
  }

  // default to showing plugin menu as highlighted - developers can change this in their function call
  $_REQUEST['menu']   = 'admin';
  $_REQUEST['action'] = 'plugins';

  // call function (we use a wrapper function so we can do this after user login when $CURRENT_USER is defined, otherwise we'd just add a handler for $functionName directly)
  $GLOBALS['PLUGIN_ACTION_FUNCTION_NAME']   = $functionName;
  $GLOBALS['PLUGIN_ACTION_REQUIRED_ACCESS'] = $requiredAccess;
  function _pluginAction_runHandler() {
    if ($GLOBALS['PLUGIN_ACTION_REQUIRED_ACCESS'] == 'admins' && !$GLOBALS['CURRENT_USER']['isAdmin']) { die("This action requires administrator access."); }
    if ($GLOBALS['PLUGIN_ACTION_REQUIRED_ACCESS'] == 'users'  && !$GLOBALS['CURRENT_USER'])            { die("This action you to be logged in."); }
    call_user_func($GLOBALS['PLUGIN_ACTION_FUNCTION_NAME'] );
  }

  //
  if (defined('IS_CMS_ADMIN')) { $hookName = 'admin_postlogin'; } // called after user logs in, so $CURRENT_USER is defined and we can check access
  else                         { $hookName = 'viewer_postinit'; } // called after website membership runs, so $CURRENT_USER is defined and we can check access
  addAction($hookName, '_pluginAction_runHandler', 999, 0); // Set priority to 999 so this runs after all other plugins (such as website membership which defines $CURRENT_USER)
}

// create a plugin action link then will call a function when clicked
// Add this code where you want your link:  <a href='" .pluginAction_getLink('plgn_function'). "'>Do action</a>
// Add this code to the top of your plugin: pluginAction_addHandler('plgn_function', true);
function pluginAction_getLink($functionName) {
  if (!function_exists($functionName)) { die(__FUNCTION__. ": Can't create plugin action link, function '" .htmlencode($functionName). "' doesn't exist!"); }
  $link = "?_pluginAction=$functionName";
  return $link;
}

?>
