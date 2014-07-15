<?php

  // error reporting
  error_reporting(E_ALL | E_STRICT);
  ini_set('display_errors', '1');         //
  ini_set('display_startup_errors', '1'); //
  ini_set('track_errors', '1');           // store last error in $php_errormsg
  ini_set('html_errors', '0');            // don't output html links in error messages
  ini_set('mysql.trace_mode', '0');       // when this is enabled SQL_CALC_FOUND_ROWS and FOUND_ROWS doesn't work: http://bugs.php.net/bug.php?id=33021

  // define constants
  define('START_TIME', microtime(true));      // needs to be first to get accurate script execute-time reading
  define('REQUIRED_PHP_VERSION',   '5.2.4');  // Released Aug 2007
  define('REQUIRED_MYSQL_VERSION', '5.0.0');  // Released Oct 2005 - First Production Release (5.0.15)
  define('MAX_DEMO_TIME', 60*60*1);           // Demo data is removed after this number of seconds
  define('SCRIPT_DIR', _init_getScriptDir()); //
  if (!defined('DATA_DIR')) { define('DATA_DIR', SCRIPT_DIR.'/data'); }

  // Load PHP compatibility functions (for older PHP versions)
  $functions = array('quoted_printable_encode', 'array_replace_recursive');
  foreach ($functions as $_phpcompat_function) {
    if (function_exists($_phpcompat_function)) { continue; }
    require_once SCRIPT_DIR . "/3rdParty/PHP_Compat/$_phpcompat_function.php";
  }

  // ensure that base64_decode is available for use
  base64_decode('Y2hlY2s=');

  // load CMS libraries
  require_once SCRIPT_DIR . '/lib/old_alias_functions.php';
  require_once SCRIPT_DIR . '/lib/database_functions.php';
  require_once SCRIPT_DIR . '/lib/mysql_functions.php';
  require_once SCRIPT_DIR . '/lib/field_class.php';
  require_once SCRIPT_DIR . '/lib/plugin_functions.php';
  require_once SCRIPT_DIR . '/lib/upload_functions.php';
  require_once SCRIPT_DIR . '/lib/image_functions.php';
  require_once SCRIPT_DIR . '/lib/common.php';
  require_once SCRIPT_DIR . '/lib/language_functions.php';
  require_once SCRIPT_DIR . '/lib/validation_functions.php';

  // init & setup
  _init_showServerRequirementsErrors();
  _init_loadSettings();                          // sets $SETTINGS global
  _init_fixPHPSettings();
  _init_fixPreviewDnsDomains();

  // set globals
  global $SETTINGS, $TABLE_PREFIX, $PROGRAM_DIR, $APP;
  $_REQUEST      = _init_createRequestGlobal();  // call AFTER _init_fixPHPSettings(): uses fixed PATH_INFO _and_ undo_magic_quotes
  $TABLE_PREFIX  = getFirstDefinedValue(@$SETTINGS["mysql:{$_SERVER['HTTP_HOST']}"]['tablePrefix'], $SETTINGS['mysql']['tablePrefix']);
  $PROGRAM_DIR   = SCRIPT_DIR;
  $APP           = array(
    'version'           => '2.61',
    'build'             => '1058',
    'id'                => '19',
    'key'               => '35809',
  );
  define('PREFIX_URL', $SETTINGS['webPrefixUrl']);  // v2.53

  // set timezone
  _init_setTimezone();

  // check for disabled sockets
  _init_displaySocketErrors();

  // connect to mysql
  if (isInstalled()) { connectToMySQL(); }

  // load plugins
  loadPlugins();

  // Check for accidentally added whitespace or other output (by end users) - extra linebreaks at the end of library or plugin files
  // ... can cause ajax calls to fail (whitespace is interpreted as error message and returned in 'blank' popups) or gzip output to
  // ... become corrupted. Note that server behaviour will vary based on output_buffering another other settings (search "output" in phpinfo)
  if (defined('IS_CMS_ADMIN')) { // only run this in CMS admin, we don't want errors on viewer pages
    $unexpectedOutputErrors = '';
    if (headers_sent($outputSentFile, $outputSentLine)) {  // headers_sent() gets triggered when php's 'output_buffer' bytes are exceeded
      $unexpectedOutputErrors .= sprintf('Unexpected output was sent by the following file: %1$s (on line %2$s)', htmlencode(@$outputSentFile), htmlencode(@$outputSentLine)). "\n";
      $unexpectedOutputErrors .= "Developers: Check plugins and library files for accidentally added whitespace or other characters.\n";
      die(nl2br($unexpectedOutputErrors)); // start_session will fail if headers_sent so we need to die here to show error.
    }
    elseif (ob_get_length()) { // ... otherwise we check if any 'output' is in the buffer, there shouldn't be.
      $unexpectedOutputErrors .= "Unexpected output was sent by a program library or plugin." . "\n";
      $unexpectedOutputErrors .= sprintf('Output was "%1$s" (%2$s chars)', htmlencode(ob_get_contents()), ob_get_length()) . "\n";
      $unexpectedOutputErrors .= "Developers: Check plugins and library files for accidentally added whitespace or other characters.\n";
      alert(nl2br($unexpectedOutputErrors)); // we can show this as a program alert to minimize interruption while error is being resolved.
    }
  }  

  // start session
  _init_startSession();

  //
  setupDemoIfNeeded();

  //
  doAction('init_complete');


  // all done!
  return;

//
function _init_getScriptDir() {
  static $programDir;

  if (!$programDir) {
    $programDir = dirname(dirname(__FILE__));

    $isUncPath  = substr($programDir, 0, 2) == '\\\\';
    $programDir = preg_replace('/[\\\\\/]+/', '/', $programDir); // replace and collapse slashes
    if ($isUncPath) { $programDir = substr_replace($programDir, '\\\\', 0, 1); } // replace UNC prefix
  }
  return $programDir;
}

//
function _init_fixPHPSettings() {

  umask(0);                             // use default permission on created files
  ini_set('open_basedir', null);        // PHP 5.3+ disable open_basedir restrictions (we also set this with php.ini for earlier php versions)
  if (!ini_get('suhosin.memory_limit')) { // don't increase memory if suhosin doesn't allow it (or script will die): http://www.hardened-php.net/suhosin/configuration.html#suhosin.memory_limit
    ini_set('memory_limit', '128M');            // raise memory limit (if allowed)
  }
  ini_set('magic_quotes_runtime', 0);   // disable magic_quotes_runtime (backslashes quotes in input)
  ini_set('mysql.connect_timeout', 6);  // PHP default of 60 ties up browser for too long - mysql.connect_timeout may not work on windows
  ini_set('gd.jpeg_ignore_warning', 1); // suppress "Warning: imagecreatefromjpeg(): gd-jpeg, libjpeg: recoverable error: Premature end of JPEG file" and other GD errors.  See: http://bugs.php.net/bug.php?id=39918
  ini_set('default_charset', 'utf-8');  //
  if (function_exists('mb_internal_encoding')) { // just in-case mbstring isn't loaded
    mb_internal_encoding('utf-8');        // required for mb_encode_mimeheader() to work properly
  }

  // disable zlib.output_compression so we can output content from register_shutdown_function - http://php.net/manual/en/function.register-shutdown-function.php#72604
  @ini_set('zlib.output_compression', 0);

  // Set PHP arg_separator.output value to & so PHP http_build_query() function always works as expected
  ini_set('arg_separator.output', '&');

  // set_include_path - so we can load libraries without full path like this: require_once("/lib/library.php");
  // ... Note that init.php is called from files in different directories so we can't use relative paths
  // ... Note: set_include_path won't work here if host set it in httpd config - see: http://bugs.php.net/bug.php?id=45288#c140023

  // There's a bug in some PHP installs where the follow error is reported intermittently if set_include_path() is called:
  // "Fatal error: Allowed memory size of 268435456 bytes exhausted (tried to allocate 268692400 bytes) in Unknown on line 0"
  // The memory amounts vary but they are usually very large.  A workaround is to:
  // - Copy the CMS dir path from: Admin > General Settings > Program Directory
  // - Update php.ini and add the path to the beginning of "include_path" followed by a path separator (either : or ;)
  // - Comment out the lines below:

  $newIncludePath  = SCRIPT_DIR                  . PATH_SEPARATOR;   // include program dir
  $newIncludePath .= SCRIPT_DIR.'/3rdParty'      . PATH_SEPARATOR;   // include /3rdParty/ dir for libraries that expect themselves to be off the current directory (like Zend)
  //$newIncludePath .= SCRIPT_DIR.'/3rdParty/PEAR' . PATH_SEPARATOR;   // v2.xx - not yet added
  $newIncludePath .= rtrim(get_include_path(), PATH_SEPARATOR); // Remove trailing PATH_SEPARATOR (":") - This is good form anyway, but note that a PHP v5.0.4 bug caused trailing PATH_SEPARATOR (":") to check for include()d files in the root ("/") and return errors that it couldn't find it.
  set_include_path($newIncludePath);

  // undo magic_quotes
  // The htscanner extension sets magic_quotes_gpc = 0 but doesn't actually disable magic-quotes so backslashes are still added.  See: http://pecl.php.net/bugs/bug.php?id=10623
  $fixHtscannerBug10623 = extension_loaded('htscanner') && ini_get('htscanner.config_file') == '.htaccess' && get_cfg_var('magic_quotes_gpc'); // if they fix this in future add version check phpversion('htscanner') < n.nn
  $undoMagicQuotes      = @get_magic_quotes_gpc() || $fixHtscannerBug10623;
  if ($undoMagicQuotes) {  // undo deprecated php magic_quotes feature, see: http://php.net/manual/en/security.magicquotes.php
    $in = array(&$_GET, &$_POST, &$_COOKIE);              // from: http://www.php.net/manual/en/security.magicquotes.disabling.php
    while (list($k,$v) = each($in)) {
      foreach ($v as $key => $val) {
        if (!is_array($val)) {
          $in[$k][$key] = stripslashes($val);
          continue;
        }
        $in[] =& $in[$k][$key];
      }
    }
    unset($in);
  }

  // Set common _SERVER values that are undefined when from from cronjobs and command-line (to prevent warnings) - v2.17
  $_SERVER['SCRIPT_NAME'] = @$_SERVER['SCRIPT_NAME'];
  $_SERVER['HTTP_HOST']   = @$_SERVER['HTTP_HOST'];

  // Fix SCRIPT_NAME and PHP_ SELF (often set incorrectly when PHP is in CGI mode)
  $isCgiMode = PHP_SAPI == 'cgi' || PHP_SAPI == 'cgi-fcgi';
  if ($isCgiMode && @$_SERVER['REQUEST_URI']) {
    list($scriptUri) = explode('?', $_SERVER['REQUEST_URI']);             // remove query string
    if (@$_SERVER["PATH_INFO"] && @$_SERVER["PATH_INFO"] != $scriptUri) { // remove PATH_INFO
      $escapedPathInfo = preg_quote($_SERVER['PATH_INFO'], '/');
      $scriptUri = preg_replace("/$escapedPathInfo$/", '', $scriptUri);
    }
    $_SERVER['SCRIPT_NAME'] = $scriptUri;
  }
  $_SERVER['PHP_'.'SELF'] = @$_SERVER['SCRIPT_NAME'];

  // Fix PATH_INFO - CGI PHP sometimes sets pathinfo to PHP_ SELF when it's blank (which causes problems when reading numbers from PATH_INFO in viewer_functions.php
  if (@$_SERVER["PATH_INFO"] == @$_SERVER['PHP_'.'SELF']) { $_SERVER["PATH_INFO"] = ''; }

  // fix DOCUMENT_ROOT - Not set in MS-IIS and often incorrect in Apache virtual hosting configurations
  $validDocRoot = @$_SERVER['DOCUMENT_ROOT'] && @is_dir(@$_SERVER['DOCUMENT_ROOT'].'/'); // Add trailing slash so hosts who mis-configured 'open_basedir' with a trailing slash don't get an "not in basedir" error
  if (!$validDocRoot && @$_SERVER['SCRIPT_NAME']) {                   // Note: If SCRIPT_NAME isn't set (such as in PHP CLI) we don't overwrite DOCUMENT_ROOT, since we need it to calculate the path
    list($lastFrame)  = array_reverse(debug_backtrace());             // end(debug_backtrace()) caused: PHP Strict Standards:  Only variables should be passed by reference
    $pathOfCaller = @$lastFrame['file'];                              // filepath of calling script (since path to this lib file might be different)
    $fullFilepath = fixSlashes( coalesce($pathOfCaller, __FILE__) );  // eg: C:/wamp/www/application/admin.php - path of script that included us, or path of this file if no caller
    $search       = fixSlashes($_SERVER['SCRIPT_NAME']);              // eg:            /application/admin.php
    $webroot      = str_replace($search, '', $fullFilepath);          // eg: C:/wamp/www

    if (@is_dir("$webroot/")) { // add trailing slash so hosts who mis-configured 'open_basedir' with a trailing slash don't get an "not in basedir" error
      $_SERVER['DOCUMENT_ROOT_ORIGINAL'] = @$_SERVER['DOCUMENT_ROOT']; // for debugging - save original value
      $_SERVER['DOCUMENT_ROOT']          = $webroot;
    }
  }

  // define HTTP_REFERER
  if (!array_key_exists('HTTP_REFERER', $_SERVER)) {
    $_SERVER['HTTP_REFERER'] = '';
  }

  // Set SMTP values - v2.52
  if ($GLOBALS['SETTINGS']['advanced']['smtp_hostname']) { ini_set('SMTP',      $GLOBALS['SETTINGS']['advanced']['smtp_hostname']); }
  if ($GLOBALS['SETTINGS']['advanced']['smtp_port'])     { ini_set('smtp_port', $GLOBALS['SETTINGS']['advanced']['smtp_port']); }

}



// Some web hosts (godaddy?) use a *.previewdns.com to preview their websites before the DNS propegates.
// This site injects html/css/js into the page to display a popup on how to setup their DNS.
// This injected code redefines $ in js (to use mootools) and can interfere with other code on the page so we remove it.
function _init_fixPreviewDnsDomains($html = null) {

  // skip if not on *.previewdns.com host
  if (@$_SERVER['HTTP_X_FORWARDED_SERVER'] != 'previewdns.com') { return; }

  // call this function to filter output
  if ($html === null) { ob_start('_init_fixPreviewDnsDomains'); }

  // returned filtered output
  // *.previewdns.com injects code right before closing body tag.  Adding trailing space in body tag
  // prevents their system from matching it and injecting their code
  if ($html) { return preg_replace('|</body>|i', '</body >', $html); }
}


// the flash uploader uses ajax to subject a request and only displays errors if they are prefixed
function _init_showFlashUploaderErrors($output = null) {
  //  _init_showFlashUploaderErrors();
  die("Not yet implemented! See development docs.");
  if (!isFlashUploader()) { return; } // skip if not flash uploader

  // NOTE: There's some code in _init_startSession() that fixes a flash uploader session issue

  // call this function to prefix output
  if ($output === null) { ob_start('_init_flashUploader'); }

  // returned prefixed output
  if    (!$output) { return ''; }
  else if (preg_match("/^<script/", $output)) { return $output; } // don't add error prefix to returned js
  else                                        { return "SHOW_FLASH_ERROR: $output"; }
}


//
function _init_showServerRequirementsErrors() {
  $errors = '';

  // check php version
  if (version_compare(phpversion(), REQUIRED_PHP_VERSION) < 0) {
    $errors .= "This program requires PHP v" .REQUIRED_PHP_VERSION. " or greater. You have PHP v" .phpversion(). " installed.<br/>\n";
    $errors .= "Please ask your server adminstrator to upgrade PHP to a newer version.<br/><br/>\n";
    die($errors);
  }

  // check php extensions
  $missingExtensions = '';
  if (!extension_loaded('gd'))       { $missingExtensions .= "This program requires the PHP 'gd' extension.<br/>\n"; }
  if (!extension_loaded('mbstring')) { $missingExtensions .= "This program requires the PHP 'mbstring' extension.<br/>\n"; }
  if (!extension_loaded('mysql'))    { $missingExtensions .= "This program requires the PHP 'mysql' extension.<br/>\n"; }
  if ($missingExtensions) {
    $errors .= $missingExtensions;
    $errors .= "Please ask your hosting provider (or server administrator) to install missing PHP extension(s).<br/><br/>\n";
  }

  // check for GD jpeg support
  // note: check gd_info() this function for more details on specific GD features that are enabled/disabled
  if (extension_loaded("gd") && !function_exists('imagecreatefromjpeg')) {
    $errors .= "PHP doesn't support jpegs (or thumbnails). Please ask your server administrator to recompile PHP with jpeg support.<br/>\n";
    $errors .= "<b>Server Administrators:</b> imagecreatefromjpeg() isn't defined.\n";
    $errors .= "Search the comments on <a href='http://www.php.net/imagecreatefromjpeg'>php.net/imagecreatefromjpeg</a> for 'undefined function' for more details.<br/><br/>\n";
  }

  // check php settings
  $inSafeMode = ini_get('safe_mode') && strtolower(ini_get('safe_mode')) != 'off';
  if ($inSafeMode)                     { $errors .= "Please disable the 'safe_mode' setting in php.ini. (safe_mode has been removed from the latest PHP versions and it's use is <b>highly discouraged</b> by the authors of PHP - <a href='http://php.net/manual/en/ini.sect.safe-mode.php'>read more</a>)<br/>\n"; }
  if (ini_get('magic_quotes_runtime')) { $errors .= "Please disable the 'magic_quotes_runtime' setting in php.ini or with .htaccess.<br/>\n"; }
  if (ini_get('magic_quotes_sybase'))  { $errors .= "Please disable the 'magic_quotes_sybase' setting in php.ini or with .htaccess.<br/>\n"; }


  // show errors
  if ($errors) { die($errors); }

}

//
function _init_createRequestGlobal() {

  $request = $_POST + $_GET;

  //
  if (@$_SERVER['PATH_INFO']) { // add form values from PATH_INFO (example app.php/name-value/city-Vancouver/)
    $pairs = explode("/", $_SERVER['PATH_INFO']);
    foreach ($pairs as $pair) {
      if (!$pair) { continue; } // skip blank
      @list($encodedName, $encodedValue) = explode('-', $pair, 2);
      $name  = urldecode($encodedName);
      $value = urldecode($encodedValue);
      if (array_key_exists($name, $request)) { continue; } // skip if already defined in GET/POST
      $request[$name] = $value;
    }
  }

  //
  return $request;

}

// set timezone, timezone list here: http://www.php.net/manual/en/timezones.php
function _init_setTimezone() {
  global $SETTINGS;
  if (@date_default_timezone_set($SETTINGS['timezone'])) { return; }

  // set this manually in case alert() isn't defined
  @$GLOBALS['APP']['alerts'] .= "Error setting timezone to '{$SETTINGS['timezone']}', Invalid timezone name.<br/>\n";
  date_default_timezone_set('UTC');
}


//
function _init_displaySocketErrors() {

  if (!isInstalled()) {
    $handle = @fsockopen("tcp://www.google.com", 80, $errno, $errstr, 5);
    if (!$handle) {
      $errors  = "Error: PHP fsockopen() and/or network connectivity disabled!<br/>\n";
      $errors .= "Test connection to www.google.com return error #" .@$errno. " - " .@$errstr. "<br/><br/>\n";
      $errors .= "Please ask your server administrator to enable network connectivity for PHP.<br/><br/>\n";
      die($errors);
    }
  }

}

// load settings from var_export file, as saved by settingsSave() (or, for backwards compatibility, INI file)
function _init_loadSettings() {

  // get settings filenames and paths (either)
  list($hostnameWithoutPort) = explode(':', strtolower(@$_SERVER['HTTP_HOST']));
  $hostnameWithoutPort       = preg_replace('/[^\w\-\.]/', '', $hostnameWithoutPort); // security: HTTP_HOST is user defined - remove non-filename chars to prevent ../ attacks
  $hostnameWithoutPort       = preg_replace('/^www\./i', '', $hostnameWithoutPort);   // v2.50 - usability: don't require www. prefix so www.example.com and example.com both check for settings.example.com.php
  $settings_fileName         = 'settings.' .preg_replace('/[^\w\-\.]/', '', $hostnameWithoutPort). '.php';
  $settings_filePath         = DATA_DIR .'/'. $settings_fileName; // supports host based settings files such as: /data/settings.localhost.php
  define('SETTINGS_DEV_FILENAME', $settings_fileName);
  define('SETTINGS_DEV_FILEPATH', DATA_DIR.'/'.SETTINGS_DEV_FILENAME);

  // set settings name and path for this server
  $useDev = is_file(SETTINGS_DEV_FILEPATH);
  define('SETTINGS_FILENAME', ($useDev ? SETTINGS_DEV_FILENAME : 'settings.dat.php'));
  define('SETTINGS_FILEPATH', ($useDev ? SETTINGS_DEV_FILEPATH : DATA_DIR.'/settings.dat.php'));

  // Require hostname-based settings files on development server domains (this section to be expanded)
  if (isInstalled() && isDevServer() && !is_file(SETTINGS_DEV_FILEPATH)) {
    header("Content-type: text/plain");
    die("Development server requires custom settings files.  Delete /data/isInstalled.php and re-install to create one.");
  }

  // load settings
  global $SETTINGS;
  if (!is_file(SETTINGS_FILEPATH)) { renameOrRemoveDefaultFiles(); } // rename settings.dat.php.default to settings.dat.php
  $SETTINGS = loadStructOrINI(SETTINGS_FILEPATH);

  ### set defaults (if not already defined in settings file - this happens when a user upgrades)
  // NOTE: Do this here for future instead of _upgradeSettings()
  $defaults = array(
    'language'               => '',
    'adminEmail'             => '',
    'cookiePrefix'           => substr(md5(mt_rand()), 0, 5) . '_',
    'activePlugins'          => '',                          // added in 1.28
    'headerImageUrl'         => '',                          // added in 1.28
    'footerHTML'             => '',                          // added in 1.28
    'dateFormat'             => '',                          // added in 1.29
    'cssTheme'               => 'blue.css',                  // added in 1.37
    'webRootDir'             => @$_SERVER['DOCUMENT_ROOT'],  // added in 2.01
    'wysiwyg'                => array(),
    'advanced'               => array(),
    'bgtasks_lastRun'        => '0',  // added in v2.51
    'bgtasks_lastEmail'      => '0',  // added in v2.51
    'webPrefixUrl'           => '',   // added in v2.53
  );
  $wysiwygDefaults = array(
    'wysiwygLang'          => 'en',
    'includeDomainInLinks' => '0',
  );
  $advancedDefaults = array(
    'imageResizeQuality'             => 80,
    'showExpandedMenu'               => 0,
    'disableFlashUploader'           => 0,          // added in 2.02
    'codeGeneratorExpertMode'        => 0,          // added in 2.04
    'hideLanguageSettings'           => 0,          // added in 2.04
    'session_cookie_domain'          => '',         // added in 2.07
    'session_save_path'              => '',         // added in 2.07
    'useDatePicker'                  => 0,          // added in 2.07
    'requireHTTPS'                   => 0,          // added in 2.08
    'encryptPasswords'               => 0,          // added in 2.08
    'httpProxyServer'                => '',         // added in 2.08
    'allowRelatedRecordsDragSorting' => 0,          // added in 2.15
    'outgoingMail'                   => 'sendOnly', // added in 2.16
    'languageDeveloperMode'          => 0,          // added in 2.18
    'login_expiry_limit'             => '30',       // added in 2.51
    'login_expiry_unit'              => 'days',     // added in 2.51
    'restrictByIP'                   => 0,          // added in 2.51
    'restrictByIP_allowed'           => '',         // added in 2.51
    'smtp_method'                    => 'php',      // added in 2.52
    'smtp_hostname'                  => '',         // added in 2.52
    'smtp_port'                      => '',         // added in 2.52
    'smtp_username'                  => '',         // added in 2.52
    'smtp_password'                  => '',         // added in 2.52
  );
  foreach ($defaults         as $key => $value) { if (!array_key_exists($key, $SETTINGS))             { $SETTINGS[$key] = $value; } }
  foreach ($wysiwygDefaults  as $key => $value) { if (!array_key_exists($key, $SETTINGS['wysiwyg']))  { $SETTINGS['wysiwyg'][$key] = $value; } }
  foreach ($advancedDefaults as $key => $value) { if (!array_key_exists($key, $SETTINGS['advanced'])) { $SETTINGS['advanced'][$key] = $value; } }

  // custom defaults
  if (!@$SETTINGS['adminUrl'] && defined('IS_CMS_ADMIN')) {
    $SETTINGS['adminUrl'] = @array_shift(explode('?', thisPageUrl()));  // added in 2.12 - this must be set when admin.php is being access directly so we get the right URL
    saveSettings();
  }
  
  // set default uploadDir and uploadUrl (do this here as above defaults code only runs when keys are undefined, not when they are blank)
  if (!$SETTINGS['uploadDir']) {
    $SETTINGS['uploadDir'] = 'uploads/';
    $SETTINGS['uploadUrl'] = pathinfo($_SERVER['SCRIPT_NAME'], PATHINFO_DIRNAME) . "/uploads/";
  }

  // remove old settings
  $removeKeys  = array('vendorPoweredBy', 'timezoneOffsetAddMinus', 'timezoneOffsetHours', 'timezoneOffsetMinutes');
  $removeCount = 0;
  foreach ($removeKeys as $key) {
    if (array_key_exists($key, $SETTINGS)) { unset($SETTINGS[$key]); $removeCount++; }
  }
  if ($removeCount) { saveSettings(); }

  // remove/convert old 'isInstalled' setting (from v2.09)
  if (array_key_exists('isInstalled', $SETTINGS)) {
    isInstalled( true ); // set new installed status (semaphore file)
    unset( $SETTINGS['isInstalled'] );
    saveSettings();
  }

  // Note: We don't need to return $SETTINGS because we're modifying the global.
}

//
function _init_startSession() {
  global $SETTINGS;

  // Remove 0-byte session files on shutdown - added in v2.52
  // PHP _always_ creates session files, even when the sessions are empty.  This means 10 hits from a search engine spider creates
	// ... ten 0-byte session files that won't be removed until after session.gc_maxlifetime is reached.  This can create tens of thousands
	// ... of unneeded files.  This function removes zero-byte session files on shutdown by calling session destroy. For session in active
	// ... use, unsetting all $_SESSION values will cause the session file to be removed, but the same file will be recreated on next page-view.
	// PHP Docs Reference: "A file for each session (regardless of if any data is associated with that session) will be created. This is due to
	// ... the fact that a session is opened (a file is created) but no data is even written to that file. Note that this behavior is a
	// ... side-effect of the limitations of working with the file system... from: http://php.net/manual/en/session.installation.php
  function _remove_empty_session_file() { if (isset($_SESSION) && empty($_SESSION) && session_id()) { @session_destroy(); }} // removes session file
  register_shutdown_function('_remove_empty_session_file'); // remove session file on shutdown
  // note: run this here so even if we're not creating a session, session's created by other PHP code won't leave 0 byte files either.

  // check if we need to start a session
  $startSession = false;
  if     (inCLI())                  { $startSession = false; } // skip for command-line scripts
  elseif (inDemoMode())             { $startSession = true; }  // demos need to create a session to remember what table to load (even for demo viewer pages)
  elseif (defined('IS_CMS_ADMIN'))  { $startSession = true; }  // cms admin uses sessions to save temporary settings
  elseif (defined('START_SESSION')) { $startSession = true; }  // if starting a session is explicitly requested
  if (!$startSession) { return; }

  // error-checking for custom session settings
  $customSessionErrors = getCustomSessionErrors(@$SETTINGS['advanced']['session_cookie_domain'], @$SETTINGS['advanced']['session_save_path']);
  if ($customSessionErrors) {
    $customSessionErrors .= sprintf(t('To change %1$s settings edit %2$s'), 'session', '/data/'.SETTINGS_FILENAME);
    die($customSessionErrors);
  }

  // Initialize session
  $session_name = cookiePrefix() . 'PHPSESSID'; // use a unique session cookie for each CMS installation
  ini_set('session.name',             $session_name);  // sets session.name
  ini_set('session.use_cookies',      true );
  ini_set('session.use_only_cookies', true );
  ini_set('session.cookie_domain',    @$SETTINGS['advanced']['session_cookie_domain']);  // use this to allow shared login access between subdomains such as host1.example.com, host2.example.com, example.com
  ini_set('session.cookie_path',      '/' );
  ini_set('session.cookie_httponly',  true );
  ini_set('session.cookie_lifetime',  60*60*24*365*25 ); // save session cookies forever (or 25 years) so they'll work even if users who have turned their system clocks back a few years
  ini_set('session.gc_maxlifetime',   60*60*24 );       // session garbage-collection code starts getting randomly called after this many seconds of inactiity
  ini_set('session.use_trans_sid',    false );
  if (@$SETTINGS['advanced']['session_save_path']) {
    ini_set('session.save_path',   @$SETTINGS['advanced']['session_save_path']); // use this if your host imposes restrictive session removal timeouts
    ini_set('session.gc_probability',   1 );        // after gc_maxlifetime is met old session are cleaned up randomly every (gc_probability / gc_divisor) requests
    ini_set('session.gc_divisor',       100 );      // after gc_maxlifetime is met old session are cleaned up randomly every (gc_probability / gc_divisor) requests
    // we don't set gc_ values by default because they cause errors on some server configs: http://bugs.php.net/bug.php?id=20720
  }
  unset($php_errormsg);
  @session_start(); // session_start doesn't output correct return value until PHP 5.3.0+ so we test on the next line
  if (isset($php_errormsg)) { die("Couldn't start session! '$php_errormsg'!"); }

}

// $sessionErrors = getCustomSessionErrors(@$SETTINGS['advanced']['session_cookie_domain'], @$SETTINGS['advanced']['session_save_path']);
// $sessionErrors = getCustomSessionErrors(@$_REQUEST['session_cookie_domain'], @$_REQUEST['session_save_path']);
function getCustomSessionErrors($cookieDomain, $savePath) {
  $errors = '';

  // session.save_path
  $settingName = 'session.save_path';
  if ($savePath != '') {
    if     (!file_exists($savePath)) { $errors .= sprintf('%1$s doesn\'t exist! (%2$s)',                     $settingName, htmlencode($savePath)) . "<br/>\n"; }
    elseif (!is_dir($savePath))      { $errors .= sprintf('%1$s isn\'t a directory! (%2$s)',                 $settingName, htmlencode($savePath)) . "<br/>\n"; }
    elseif (!is_writable($savePath)) { $errors .= sprintf('%1$s isn\'t writable, check permissions! (%2$s)', $settingName, htmlencode($savePath)) . "<br/>\n"; }
  }

  // session.cookie_domain
  $settingName = 'session.cookie_domain';
  if ($cookieDomain != '') {
    $regexp   = "/\b" .preg_quote($cookieDomain, '/'). "$/i"; // \b so foo.com matches www.foo.com but not xfoo.com
    $hostname = @$_SERVER['HTTP_HOST'];
    if (!preg_match($regexp, $hostname)) {
      $errors  .= sprintf('%1$s doesn\'t match current domain: %2$s', $settingName, htmlencode($cookieDomain)) . "<br/>\n";
    }
  }

  //
  return $errors;
}


// check if program has been installed... Or change the isInstalled status
function isInstalled($markAsInstalled = false) {
  $semaphoreFile = DATA_DIR . '/isInstalled.php';
  $isInstalled   = file_exists($semaphoreFile);

  // set installed status
  if ($markAsInstalled && !$isInstalled) {
    $fileContents = "<?php die('Delete this file to re-install the software.'); ?>\n";
    file_put_contents($semaphoreFile, $fileContents) || die("Error writing to '$semaphoreFile'! $php_errormsg");
  }

  //
  return $isInstalled;
}


// check if this is a dev server - this is an experimental feature to be expanded on...
function isDevServer() {
  if (!array_key_exists('HTTP_HOST', $_SERVER)) { return; } // skip if no HTTP_HOST defined

  //
  $lcHostnameWithoutPort = array_first(explode(':', strtolower(@$_SERVER['HTTP_HOST'])));
  $isDevOnlyDomain       = endsWith('.cms'.'b.me', $lcHostnameWithoutPort);
  return $isDevOnlyDomain;
}

//eof