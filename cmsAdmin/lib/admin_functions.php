<?php

  // for compatibility with older plugins, include functions that have been factored out of admin_functions.php
  $libDir = pathinfo(__FILE__, PATHINFO_DIRNAME);
  require_once "$libDir/login_functions.php";

  // require HTTPS
  if (@$SETTINGS['advanced']['requireHTTPS'] && !isHTTPS()) {
    $httpsUrl = preg_replace('/^http:/i', 'https:', thisPageUrl());
    die(sprintf(t("Secure HTTP login required: %s"), "<a href='$httpsUrl'>$httpsUrl</a>"));
  }

  // restrict IP access
  if (@$SETTINGS['advanced']['restrictByIP'] && !isIpAllowed()) {
    die(sprintf(t("Access is not permitted from your IP address (%s)"), $_SERVER['REMOTE_ADDR']));
  }

  // install or upgrade if needed
  installIfNeeded();
  upgradeIfNeeded();

  // register if needed
  # NOTE: Disabling or modifying licensing or registration code violates your license agreement and is willful copyright infringement.
  # NOTE: Copyright infringement can be very expensive: http://en.wikipedia.org/wiki/Statutory_damages_for_copyright_infringement
  # NOTE: Please do not steal our software.
  registerIfNeeded();


// set current user or show login menu
function adminLoginMenu() {
  global $CURRENT_USER;

  // login menu actions
  $action = @$_REQUEST['action'];
  if ($action == 'logoff')      { user_logoff(); exit; }
  if ($action == 'loginSubmit') {
    foreach (array('username','password') as $field) { // v2.52 remove leading and trailing whitespace
      $_REQUEST[$field] = preg_replace("/^\s+|\s+$/s", '', @$_REQUEST[$field]);
    }
    loginCookie_set(@$_REQUEST['username'], getPasswordDigest(@$_REQUEST['password']));
  }

  // load current user
  $CURRENT_USER = getCurrentUser($loginExpired);

  // report any errors
  $errors = '';
  if      ($loginExpired)                              { $errors .= t("You've been logged out due to inactivity, please login again to continue."); }
  else if (!$CURRENT_USER && $action == 'loginSubmit') { $errors .= t("Invalid username or password"); }
  else if (@$CURRENT_USER['disabled'])                 { $errors .= t("Your account has been disabled."); }
  else if (@$CURRENT_USER['isExpired'])                { $errors .= t("Your account has expired."); }
  if ($errors) {
    alert($errors);
    loginCookie_remove();   // if data in login cookie is invalid, remove login cookie so we don't keep checking it
    $CURRENT_USER = false;  // if login is invalid, clear user variable
  }

  // if no logged in user
  if (!$CURRENT_USER) {

    // perform login screen maintenance actions - useful place to run common operations
    if (!$action) {
      createMissingSchemaTablesAndFields(); // create/update missing schemas, etc

      // show helpful messages
      if (!mysql_count('accounts')) { alert(t("There are no user accounts in the database.")); }
    }

    // show login screen if user not logged in
    showInterface('login.php', false);
    exit;
  }

  // if user logged in
  if ($CURRENT_USER) {
    // reset login cookie (to update lastAccess time used to track session expiry)
    loginCookie_set(@$CURRENT_USER['username'], getPasswordDigest(@$CURRENT_USER['password']));

    // redirect to last url - on valid login
    if (@$_REQUEST['redirectUrl']) { redirectBrowserToURL($_REQUEST['redirectUrl']); exit; }
  }

}


//
function getRequestedAction($defaultAction = '') {

  # parse action out of key format: name="action=sampleList" value="List"
  # (the submit button value is often used for display purposes and can't be used to specify an action value)
  foreach (array_keys($_REQUEST) as $key) {
    if (strpos($key, 'action=') === 0 || strpos($key, '_action=') === 0) {
      list($stringActionEquals, $actionValue) = explode("=", $key, 2);
      $_REQUEST['_action'] = $actionValue;
    }
  }

  # get actions
  $action = '';
  if     (@$_REQUEST['_advancedActionSubmit'] && @$_REQUEST['_advancedAction']) { // advanced commands can be urls or action values
    if (startsWith('?', $_REQUEST['_advancedAction'])) { redirectBrowserToURL($_REQUEST['_advancedAction']); } // added in v2.15, previously support through javascript on edit/view but not list
    else                                               { $action = $_REQUEST['_advancedAction']; }
  }
  elseif (@$_REQUEST['_action'])                 { $action = $_REQUEST['_action']; }          # explicit action (move towards _action)
  elseif (@$_REQUEST['action'])                  { $action = $_REQUEST['action']; }           # explicit action (deprecate this one)
  elseif (@$_REQUEST['_defaultAction'])          { $action = $_REQUEST['_defaultAction']; }   # default action
  else                                           { $action = $defaultAction; }

  #
  return $action;
}

//
function installIfNeeded() {
  global $SETTINGS, $APP, $TABLE_PREFIX;
  if (isInstalled()) { return; }   // skip if already installed

  // rename default files
  renameOrRemoveDefaultFiles();

  // error checking
  if ($SETTINGS['uploadDir'] && !is_dir($SETTINGS['uploadDir'])) {
    print "Upload directory doesn't exist, please update 'uploadDir' in /data/" .SETTINGS_FILENAME. "<br/>\n";
    print "Current uploadDir value: "   .htmlencode($SETTINGS['uploadDir']). "<br/>\n";
    print "Suggested uploadDir value: uploads/ or ../uploads/<br/>\n";
    exit;
  }

  // error checking
  checkFilePermissions();

  // display license
  if (@$_REQUEST['menu'] == 'license') { showInterface('license.php'); }

  // save
  if (@$_REQUEST['save']) {

    // error checking
    if (!$_REQUEST['licenseCompanyName'])                            { alert("Please enter your 'Company Name'<br/>\n"); }
    if (!$_REQUEST['licenseDomainName'])                             { alert("Please enter your 'Domain Name'<br/>\n"); }
    if (!$_REQUEST['licenseProductId'])                              { alert("Please enter your 'Product Id'<br/>\n"); }
    else if (!isValidProductId($_REQUEST['licenseProductId']))       { alert("Invalid Product Id!<br/>\n"); }
    if (!$_REQUEST['agreeToOneInstall'])                             { alert("Please check 'I agree not to use this 'Product Id' for multiple installs'<br/>\n"); }
    if (!$_REQUEST['understandTermination'])                         { alert("Please check 'I understand doing so may cause be to lose my right to use this software'<br/>\n"); }
    if (!$_REQUEST['agreeToLicense'])                                { alert("Please check 'I accept the terms of the License Agreement'<br/>\n"); }
    if (!$_REQUEST['mysqlHostname'])                                 { alert("Please enter your 'MySQL Hostname'<br/>\n"); }
    if (!$_REQUEST['mysqlDatabase'])                                 { alert("Please enter your 'MySQL Database'<br/>\n"); }
    if (!$_REQUEST['mysqlUsername'])                                 { alert("Please enter your 'MySQL Username'<br/>\n"); }
    if     (!$_REQUEST['mysqlTablePrefix'])                          { alert("Please enter your 'MySQL Table Prefix'<br/>\n"); }
    elseif (preg_match("/[A-Z]/", $_REQUEST['mysqlTablePrefix']))    { alert("Value for 'MySQL Table Prefix' must be lowercase.<br/>\n"); }
    elseif (!preg_match("/^[a-z]/i", $_REQUEST['mysqlTablePrefix'])) { alert("Value for 'MySQL Table Prefix' must start with a letter.<br/>\n"); }
    elseif (!preg_match("/_$/", $_REQUEST['mysqlTablePrefix']))      { alert("Value for 'MySQL Table Prefix' must end in underscore.<br/>\n"); }

    // New Installation
    if (!@$_REQUEST['restoreFromBackup']) {
      if (!$_REQUEST['adminFullname'])                                 { alert("Please enter 'Admin Full Name'<br/>\n"); }
      if     (!$_REQUEST['adminEmail'])                                { alert("Please enter 'Admin Email'<br/>\n"); }
      elseif (!isValidEmail($_REQUEST['adminEmail']))                  { alert("Please enter a valid email for 'Admin Email' (Example: user@example.com)<br/>\n"); }
      if (!$_REQUEST['adminUsername'])                                 { alert("Please enter 'Admin Username'<br/>\n"); }

      $passwordErrors = getNewPasswordErrors($_REQUEST['adminPassword1'], $_REQUEST['adminPassword2'], $_REQUEST['adminUsername']); // v2.52
      if ($passwordErrors)  { alert( nl2br(htmlencode($passwordErrors)) ); }
    }

    // Restore from Backup
    if (@$_REQUEST['restoreFromBackup']) {
      if (!$_REQUEST['restore'])                                       { alert("Please select a backup file to restore<br/>\n"); }
    }

    // Advanced - v2.53
    if (!@$_REQUEST['useCustomSettingsFile']) {
      if     (is_file(SETTINGS_DEV_FILEPATH)) { alert(t("You must select 'Use Custom Settings File' since a custom settings file for this domain already exists!"). "<br/>\n"); }
      elseif (isDevServer())                  { alert("This is a development server, you must select 'Use Custom Settings File'.". "<br/>\n"); }
    }
    if (@$_REQUEST['webPrefixUrl'] != '') {
      if  (!preg_match("|^(\w+:/)?/|", $_REQUEST['webPrefixUrl'])) { alert(t("Website Prefix URL must start with /") ."<br/>\n"); }
      if  (preg_match("|/$|", $_REQUEST['webPrefixUrl']))          { alert(t("Website Prefix URL cannot end with /") ."<br/>\n"); }
    }


    // update settings (not saved unless there are no errors)
    $SETTINGS['cookiePrefix']         = substr(md5(mt_rand()), 0, 5) . '_'; //v2.51 shortened prefix so it's easy to see full cookie names in browser cookie list
    $SETTINGS['adminEmail']           = @$SETTINGS['adminEmail'] ? $SETTINGS['adminEmail'] : $_REQUEST['adminEmail'];
    $SETTINGS['licenseCompanyName']   = $_REQUEST['licenseCompanyName'];
    $SETTINGS['licenseDomainName']    = $_REQUEST['licenseDomainName'];
    $SETTINGS['licenseProductId']     = $_REQUEST['licenseProductId'];
    $SETTINGS['webRootDir']           = @$SETTINGS['webRootDir'] ? $SETTINGS['webRootDir'] : @$_SERVER['DOCUMENT_ROOT'];
    $SETTINGS['mysql']['hostname']    = $_REQUEST['mysqlHostname'];
    $SETTINGS['mysql']['database']    = $_REQUEST['mysqlDatabase'];
    $SETTINGS['mysql']['username']    = $_REQUEST['mysqlUsername'];
    $SETTINGS['mysql']['password']    = $_REQUEST['mysqlPassword'];
    $SETTINGS['mysql']['tablePrefix'] = $_REQUEST['mysqlTablePrefix'];
    $TABLE_PREFIX                     = $_REQUEST['mysqlTablePrefix']; // update TABLE_PREFIX global as well.
    $SETTINGS['webPrefixUrl']         = $_REQUEST['webPrefixUrl'];

    // display errors
    if (alert()) {
      require "lib/menus/install.php";
      exit;
    }

    // connect to mysql
    $errors = connectToMySQL('returnErrors');
    if ($errors) {
      alert($errors);
      require "lib/menus/install.php";
      exit;
    }
    else { connectToMySQL(); }

    // create schema tables
    createMissingSchemaTablesAndFields();
    clearAlertsAndNotices(); // don't show "created table/field" alerts

    // New Installation: check if admin user already exists
    if (!@$_REQUEST['restoreFromBackup']) {
      $passwordTextOrHash  = @$SETTINGS['advanced']['encryptPasswords'] ? getPasswordDigest($_REQUEST['adminPassword1']) : $_REQUEST['adminPassword1'];
      $identicalUserExists = mysql_count('accounts', array('username' => $_REQUEST['adminUsername'], 'password' => $passwordTextOrHash, 'isAdmin' => '1'));
      if (!$identicalUserExists) { // if the don't exist, check if a user with the same username exists and show an error if they do
        $count = mysql_count('accounts', array('username' => $_REQUEST['adminUsername']));
        if (!$identicalUserExists && $count > 0) { alert("Admin username already exists, please choose another.<br/>\n"); }
      }

      // create admin user
      if (!$identicalUserExists && !alert()) {
        mysqlStrictMode(false); // disable Mysql strict errors for when a field isn't defined below (can be caused when fields are added later)
        mysql_query("INSERT INTO `{$TABLE_PREFIX}accounts` SET
                          createdDate      = NOW(),
                          createdByUserNum = '0',
                          updatedDate      = NOW(),
                          updatedByUserNum = '0',
                          fullname         = '".mysql_escape( $_REQUEST['adminFullname'] )."', email    = '".mysql_escape( $_REQUEST['adminEmail'] )."',
                          username         = '".mysql_escape( $_REQUEST['adminUsername'] )."', password = '".mysql_escape($passwordTextOrHash)."',
                          disabled         = '0',
                          isAdmin          = '1',
                          expiresDate      = '0000-00-00 00:00:00',
                          neverExpires     = '1'") or alert("MySQL Error Creating Admin User:<br/>\n". htmlencode(mysql_error()) . "\n");

        // create accesslist entry
        mysql_query("INSERT INTO `{$TABLE_PREFIX}_accesslist` (userNum, tableName, accessLevel, maxRecords, randomSaveId)
                          VALUES (LAST_INSERT_ID(), 'all', '9', NULL, '1234567890')") or alert("MySQL Error Creating Admin Access List:<br/>\n". htmlencode(mysql_error()) . "\n");
      }
    }

    // Restore from Backup: Restore backup file
    if (@$_REQUEST['restoreFromBackup']) {
      $userCount = mysql_count('accounts');
      if ($userCount) {
        $userTable = $TABLE_PREFIX . 'accounts';
        $errorMessage  = sprintf("Can't restore from backup because it would overwrite the %s existing user accounts in the specified database location.<br/>\n", $userCount);
        $errorMessage .= sprintf("Try changing the MySQL Database or Table Prefix to restore to a different location, or remove existing users from '%s'.<br/>\n", $userTable);
        alert($errorMessage);
      }

      else {  // restore database
        $filename = @$_REQUEST['restore'];
        mysqlStrictMode(false); // disable Mysql strict errors
        restoreDatabase(DATA_DIR .'/backups/'. $filename);
        notice("Restored backup file /data/backups/$filename");
        makeAllUploadRecordsRelative();
      }
    }

    // save settings
    if (!alert()) {
      saveSettings( @$_REQUEST['useCustomSettingsFile'] );
      isInstalled(true);                  // save installed status
      redirectBrowserToURL('?menu=home'); // refresh page
      exitl;
    }
  }

  // set defaults
  if (!array_key_exists('licenseDomainName', $_REQUEST)) { $_REQUEST['licenseDomainName'] = $_SERVER['HTTP_HOST']; }
  if (!array_key_exists('mysqlHostname',     $_REQUEST)) { $_REQUEST['mysqlHostname']     = $SETTINGS['mysql']['hostname']; }
  if (!array_key_exists('mysqlDatabase',     $_REQUEST)) { $_REQUEST['mysqlDatabase']     = $SETTINGS['mysql']['database']; }
  if (!array_key_exists('mysqlUsername',     $_REQUEST)) { $_REQUEST['mysqlUsername']     = $SETTINGS['mysql']['username']; }
  if (!array_key_exists('mysqlTablePrefix',  $_REQUEST)) { $_REQUEST['mysqlTablePrefix']  = $SETTINGS['mysql']['tablePrefix']; }

  // show form
  require "lib/menus/install.php";
  exit;
}


//
function upgradeIfNeeded() {
  global $SETTINGS, $APP;
  if ($SETTINGS['programVersion'] >= $APP['version']) { return; }

  // rename default files
  renameOrRemoveDefaultFiles();

  // run upgrades
  require "lib/upgrade_functions.php";

  // update version in settings
  $SETTINGS['programVersion'] = $APP['version'];
  saveSettings();
}



// verify product id and register product if needed
function registerIfNeeded($forceRegister = false) {
  global $SETTINGS;

  # NOTE: Disabling or modifying licensing or registration code violates your license agreement and is willful copyright infringement.
  # NOTE: Copyright infringement can be very expensive: http://en.wikipedia.org/wiki/Statutory_damages_for_copyright_infringement
  # NOTE: Please do not steal our software.

  # invalid license
  if (!isValidProductId($SETTINGS['licenseProductId'])) {
    alert("Invalid Product ID!\n");
    showInterface('changeLicense.php');
    exit;
  }

  # call register on install, relocation, request, and periodically during usage
  $programJustInstalled  = !$SETTINGS['installPath'];
  $programHasBeenMoved   = $SETTINGS['installPath'] != _getInstallPath();
  $registrationRequested = (@$_REQUEST['action'] == 'register') || $forceRegister;
  $_daysSinceRegistered  = (int) abs((time() - $SETTINGS['dateRegistered']) / (60*60*24));
  $periodicLicenseCheck  = ($_daysSinceRegistered >= 7);

  if ($programJustInstalled || $programHasBeenMoved || $registrationRequested || $periodicLicenseCheck) {
    register();
  }

  ### expired license
  if ($SETTINGS['isDisabled']) {

    ### update product ID
    if (@$_REQUEST['productId']) {
       $isValidProductId = isValidProductId($_REQUEST['productId']);

      # valid id - continue with execution
      if ($isValidProductId) {
        $SETTINGS['licenseProductId'] = $_REQUEST['productId'];
        register();
        if ($SETTINGS['isDisabled']) {
          alert("That Product ID has expired or is no longer valid!");
          showInterface('changeLicense.php');
          exit;
        }
        return; // if no longer disabled, return
      }

      # invalid id - error message
      else {
        alert("Invalid Product ID entered!");
        showInterface('changeLicense.php');
        exit;
      }
    }

    # show license expired message
    alert("Your software license has expired. Please contact your vendor for assistance or enter a new Product ID below.");
    showInterface('changeLicense.php');
    exit;
  }

}

// register product
function register() {
  global $SETTINGS, $APP;

  # NOTE: Disabling or modifying licensing or registration code violates your license agreement and is willful copyright infringement.
  # NOTE: Copyright infringement can be very expensive: http://en.wikipedia.org/wiki/Statutory_damages_for_copyright_infringement
  # NOTE: Please do not steal our software.

  // get filepath
  $caller   = array_pop(@debug_backtrace());
  $filepath = realpath($caller['file']);

  ### Build registration query
  $hostname = getFirstDefinedValue($_SERVER["HTTP_HOST"], $_SERVER["SERVER_NAME"], @$_SERVER["SERVER_ADDR"] );
  $url      = $_SERVER["SCRIPT_NAME"];
  $reginfo  = 'reg1='      . urlencode($SETTINGS['licenseCompanyName']);       # Company Name
  $reginfo .= '&reg2='     . urlencode($SETTINGS['licenseDomainName']);        # Domain Name
  $reginfo .= '&lnum='     . isValidProductId($SETTINGS['licenseProductId']);  # License Number
  $reginfo .= '&prog='     . $APP['id'];                                       # Program Id
  $reginfo .= '&ver='      . $APP['version'];                                  # Program Version
  $reginfo .= '&url='      . urlencode("$hostname$url");                       # script url
  $reginfo .= '&filepath=' . urlencode( $filepath );                           # script filepath

  # get license status
  list($response, $statusCode) = getPage("http://www.registerSoftware.to/register/register.cgi?$reginfo");
  if      (preg_match('/license.invalid/', $response)) { $isDisabled = 1; }
  else if (preg_match('/license.valid/', $response))   { $isDisabled = 0; }
  else                                                 { $isDisabled = $SETTINGS['isDisabled']; } # on unrecognized response do nothing

  # save settings
  $SETTINGS['installPath']    = _getInstallPath();
  $SETTINGS['isDisabled']     = $isDisabled;
  $SETTINGS['dateRegistered'] = time();
  saveSettings();

  //
  return !$isDisabled;
}

// Returns program directory
// _getInstallPath();        // returns /var/htdocs/cms/
// _getInstallPath('test');  // returns /var/htdocs/cms/test
function _getInstallPath( $addSuffix = '' ) {
  // install path should be one up from this library file
  $moduleFilepath = __FILE__;
  $moduleDir      = dirname($moduleFilepath);
  $installPath    = dirname($moduleDir);

  // add suffix if needed
  if ($addSuffix) {
    $installPath .= "/$addSuffix";
  }

  //
  $installPath = preg_replace('/[\\\\\/]+/', '/', $installPath); // replace and collapse slashes
  return $installPath;
}

function checkFilePermissions() {
  global $PROGRAM_DIR, $APP, $SETTINGS;

  $dirs = array();
  $dirs[] = DATA_DIR;
  $dirs[] = DATA_DIR.'/schema';
  $dirs[] = DATA_DIR.'/schemaPresets';

  // get list of files
  $filepaths = array();
  foreach ($dirs as $dir) {
    foreach (scandir($dir) as $filename) {
      $filepath = "$dir/$filename";
      if (!is_file($filepath)) { continue; }
      if (!preg_match("/\.php$/", $filepath)) { continue; }
      $filepaths[] = $filepath;
    }
  }
  $filepaths[] = DATA_DIR.'/';
  $filepaths[] = SETTINGS_FILEPATH;
  $filepaths[] = DATA_DIR.'/backups/';
  $filepaths[] = DATA_DIR.'/schema/';
  $filepaths[] = DATA_DIR.'/schemaPresets/';
  $filepaths[] = $SETTINGS['uploadDir'].'/';
  $filepaths[] = $SETTINGS['uploadDir'].'/thumb/';
  $filepaths[] = $SETTINGS['uploadDir'].'/thumb2/';
  $filepaths[] = $SETTINGS['uploadDir'].'/thumb3/';
  $filepaths[] = $SETTINGS['uploadDir'].'/thumb4/';
  sort($filepaths);

  // check permissions
  $notFoundErrors    = '';
  $notWritableErrors = '';
  foreach ($filepaths as $filepath) {
    $filepath = preg_replace("/\/+/", "/", $filepath); // collapse multiple slashes
    if      (!file_exists($filepath) && !@mkdir($filepath)) { $notFoundErrors    .= "<li>$filepath</li>\n"; }
    else if (!isPathWritable($filepath))                    { $notWritableErrors .= "<li>$filepath</li>\n"; }
  }
  if ($notFoundErrors) {
    print t("<b>Configuration Error</b> - Please make sure the following files and directories have been uploaded:") . "<br/>\n";
    print "<ul>$notFoundErrors</ul>";
    exit;
  }
  if ($notWritableErrors) {
    print t("<b>Configuration Error</b> - Please make the following files and directories writable:") . "<br/>\n";
    print "<ul>$notWritableErrors</ul>";
    if (isWindows()) { print t("Windows: Ask your 'server administrator' to give PHP write permissions to these files"); }
    else             { print t("Linux/Unix: To find the highest security supported by your server try these chmod permissions and use the first one that works: 755, 775, 777"); }
    exit;
  }

}



//
function allowSublicensing() {
  global $SETTINGS;
  $allowSublicencing = md5($SETTINGS['vendorName']) == 'b1e8e6f4faf2741fd0ca553c46c3fee3';

  return $allowSublicencing;
}

//
function showInterfaceError($alert) {
  $errors = alert($alert);
  if (isAjaxRequest()) { die($errors); }
  else                 { showInterface('', true); }
}

//
function showInterface($body = '', $showHeaderAndFooter = true) {
  global $APP, $SETTINGS, $CURRENT_USER, $TABLE_PREFIX;

  if ($showHeaderAndFooter) { showHeader(); }
  if ($body)                { include "lib/menus/$body"; }
  if ($showHeaderAndFooter) { showFooter(); }
  exit;
}


function showHeader() {
  if (applyFilters('ui_header', TRUE)) {
    include "lib/menus/header.php";
  }
}


function showFooter() {
  global $APP, $SETTINGS, $CURRENT_USER, $TABLE_PREFIX;
  if (applyFilters('ui_footer', TRUE)) {

    //
    include "lib/menus/footer.php";

  }

  // display license and build info
  # NOTE: Disabling or modifying licensing or registration code violates your license agreement and is willful copyright infringement.
  # NOTE: Copyright infringement can be very expensive: http://en.wikipedia.org/wiki/Statutory_damages_for_copyright_infringement
  # NOTE: Please do not steal our software.
  showBuildInfo();

}

//
function clearAlertsAndNotices() {
  global $APP;
  $APP['alerts'] = '';
  $APP['notices'] = '';
}

?>
