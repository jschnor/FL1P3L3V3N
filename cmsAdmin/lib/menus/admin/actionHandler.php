<?php
  global $SETTINGS, $CURRENT_USER;

  ### check access level
  if (!$CURRENT_USER['isAdmin']) {
    alert(t("You don't have permissions to access this menu."));
    showInterface('');
  }

  # error checking
  if (!@$SETTINGS['adminEmail'] && !@$_REQUEST['adminEmail']) {
    alert("Please set 'Admin Email' under: Admin > General Settings");
  }
  $isInvalidWebRoot = !@$SETTINGS['webRootDir'] || (!is_dir(@$SETTINGS['webRootDir']) && PHP_OS != 'WINNT'); // Windows returns false for is_dir if we don't have read access to that dir
  if ($isInvalidWebRoot) {
    alert("Please set 'Website Root Directory' under: Admin > General Settings");
  }
  if (!@$SETTINGS['adminUrl']) {
    alert("Please set 'Program Url' under: Admin > General Settings");
  }


  # Dispatch actions
  $action = getRequestedAction();
  admin_dispatchAction($action);

//
function admin_dispatchAction($action) {

  if     ($action == 'general')     { showInterface('admin/general.php'); }
  elseif ($action == 'adminSave')   { admin_saveSettings('admin/general.php'); }

  elseif ($action == 'vendor')      { showInterface('admin/vendor.php'); }
  elseif ($action == 'vendorSave')  { admin_saveSettings('admin/vendor.php'); }

  elseif ($action == 'phpinfo')     { disableInDemoMode('', 'admin/general.php'); phpinfo(); exit; }
  elseif ($action == 'ulimit')      {
    disableInDemoMode('', 'admin/general.php');

    print "<h2>Soft Resource Limits (ulimit -a -S)</h2>\n";
    list($maxCpuSeconds, $memoryLimitKbytes, $maxProcessLimit, $ulimitOutput) = getUlimitValues('soft');
    showme($ulimitOutput);

    print "<h2>Hard Resource Limits (ulimit -a -H)</h2>\n";
    list($maxCpuSeconds, $memoryLimitKbytes, $maxProcessLimit, $ulimitOutput) = getUlimitValues('soft');
    showme($ulimitOutput);
    exit;
  }

  elseif ($action == 'updateDate')        { getAjaxDate(); }
  elseif ($action == 'getUploadPreviews') { getUploadPreviews(); }
  elseif ($action == 'plugins')          {
    
    showInterface('admin/plugins.php');
}
  elseif ($action == 'pluginHooks')      { showInterface('admin/pluginHooks.php'); }
  elseif ($action == 'deactivatePlugin') {
    disableInDemoMode('plugins', 'admin/plugins.php');
    deactivatePlugin(@$_REQUEST['file']);
    redirectBrowserToURL('?menu=admin&action=plugins');
    exit;
  }
  elseif ($action == 'activatePlugin') {
    disableInDemoMode('plugins', 'admin/plugins.php');
    activatePlugin(@$_REQUEST['file']);
    redirectBrowserToURL('?menu=admin&action=plugins');
    exit;
  }

  // backup/restore
  elseif ($action == 'backup')  {
    disableInDemoMode('','admin/general.php');
    $filename = backupDatabase(null, @$_REQUEST['backupTable']);
    notice(sprintf(t('Created backup file %1$s (%2$s seconds)'), $filename, showExecuteSeconds(true)));
    showInterface('admin/general.php');
    exit;
  }
  elseif ($action == 'restore') {
    disableInDemoMode('','admin/general.php');
    $filename = @$_REQUEST['file'];
    restoreDatabase(DATA_DIR .'/backups/'. $filename);
    notice("Restored backup file /data/backups/$filename");
    makeAllUploadRecordsRelative();
    showInterface('admin/general.php');
    exit;
  }

  //
  elseif ($action == 'bgtasksLogsClear') {
    disableInDemoMode('','admin/general.php');
    mysql_delete('_cron_log', null, 'true');
    notice(t("Background Task logs have been cleared."));
    showInterface('admin/general.php');
    exit;
  }

  // default
  else                              { showInterface('admin/general.php');  }
}

//
function getAjaxDate() {
  global $SETTINGS;

  // error checking
  if (!@$_REQUEST['timezone']) { die("no timezone value specified!"); }

  // error checking
  $timeZoneOffsetSeconds = abs(date("Z"));
  if ($timeZoneOffsetSeconds > 12*60*60) {
    $error     = "Offset cannot be more than +/- 12 hours from GMT!";
    echo json_encode(array('', '', $error));
    exit;
  }

  // set timezones
  date_default_timezone_set($_REQUEST['timezone']) || die(__FUNCTION__ + ": error setting timezone to '{$_REQUEST['timezone']}' with date_default_timezone_set.  Invalid timezone name.");
  $error = setMySqlTimezone('returnError');

  // get local date
  $offsetSeconds = date("Z");
  $offsetString  = convertSecondsToTimezoneOffset($offsetSeconds);
  $localDate = date("D, M j, Y - g:i:s A") . " ($offsetString)";

  // get mysql date
  $result = mysql_query("SELECT NOW(), @@session.time_zone");
  list($mySqlDate, $mySqlOffset) = mysql_fetch_row($result);
  $mysqlDate = date("D, M j, Y - g:i:s A", strtotime($mySqlDate)) . " ($mySqlOffset)";
  if (is_resource($result)) { mysql_free_result($result); }

  // return dates
  echo json_encode(array($localDate, $mysqlDate, $error));
  exit;
}

// ajax function
// usage: ?menu=admin&action=uploadPreviews&uploadDir=xxx&uploadUrl=yyy
// returns JSON: [ "previewDir": "/full/path/to/uploads", "previewUrl": "/path/from/webroot/to/uploads/" ]
function getUploadPreviews() {
  // get current paths (may or may not be relative)
  $relativeDir = @$_REQUEST['uploadDir'];
  $relativeUrl = @$_REQUEST['uploadUrl'];

  // get absolute paths
  $SETTINGS_COPY = $GLOBALS['SETTINGS'];
  $SETTINGS['uploadDir'] = $relativeDir;
  $SETTINGS['uploadUrl'] = $relativeUrl;
  $fakeFieldSchema = array(
    'useCustomUploadDir' => '0',
    'customUploadDir'    => '',
    'customUploadUrl'    => '',
  );
  list($absoluteDir, $absoluteUrl) = getUploadDirAndUrl($fakeFieldSchema, true);
  if (!$absoluteDir) { $absoluteDir = t("Invalid value, check dir exists!"); }
  if (!$absoluteUrl) { $absoluteUrl = t("Invalid value"); }
  $GLOBALS['SETTINGS'] = $SETTINGS_COPY;

  // return previews json encoded
  $json = json_encode(array(
    'previewDir' => $absoluteDir,
    'previewUrl' => $absoluteUrl,
  ));
  print $json;
  exit; // ajax functions should exit after sending data
}


//
function admin_saveSettings($savePagePath) {
  global $SETTINGS, $APP;

  // error checking
  clearAlertsAndNotices(); // so previous alerts won't prevent saving of admin options

  //
  disableInDemoMode('settings', $savePagePath);

  # license error checking
  if (array_key_exists('licenseProductId', $_REQUEST)) {
    if      (!isValidProductId($_REQUEST['licenseProductId'])) { alert("Invalid Product License ID!"); }
    else if ($SETTINGS['licenseProductId'] != $_REQUEST['licenseProductId']) {
      $SETTINGS['licenseCompanyName'] = $_REQUEST['licenseCompanyName']; // update settings
      $SETTINGS['licenseDomainName']  = $_REQUEST['licenseDomainName'];  // ...
      $SETTINGS['licenseProductId']   = $_REQUEST['licenseProductId'];   // ...
      $isValid = register();                                             // validate productId (and save new settings)
      if (!$isValid) {
        redirectBrowserToURL('?menu=admin');
        exit;
      }
    }
  }

  # program url / adminUrl
  if (array_key_exists('adminUrl', $_REQUEST)) {
    if  (!preg_match('/^http/i', $_REQUEST['adminUrl'])) { alert("Program URL must start with http:// or https://<br/>\n"); }
    if  (preg_match('/\?/i',     $_REQUEST['adminUrl'])) { alert("Program URL can not contain a ?<br/>\n"); }
  }

  # webPrefixUrl - v2.53
  if (@$_REQUEST['webPrefixUrl'] != '') {
    if  (!preg_match("|^(\w+:/)?/|", $_REQUEST['webPrefixUrl'])) { alert(t("Website Prefix URL must start with /") ."<br/>\n"); }
    if  (preg_match("|/$|", $_REQUEST['webPrefixUrl']))          { alert(t("Website Prefix URL cannot end with /") ."<br/>\n"); }
  }

  # upload url/dir
  if (array_key_exists('uploadDir', $_REQUEST)) {
    if      (!preg_match('/\/$/',      $_REQUEST['uploadDir'])) { alert("Upload Directory must end with a slash! (eg: /www/htdocs/uploads/)<br/>\n"); }
  }
  if (array_key_exists('uploadUrl', $_REQUEST)) {
    if      (preg_match('/^\w+:\/\//', $_REQUEST['uploadUrl'])) { alert("Upload Folder Url must be the web path only without a domain (eg: /uploads/)<br/>\n"); }
    else if (!preg_match('/^\//',      $_REQUEST['uploadUrl'])) { alert("Upload Folder Url must start with a slash! (eg: /uploads/)<br/>\n"); }
    if      (!preg_match('/\/$/',      $_REQUEST['uploadUrl'])) { alert("Upload Folder Url must end with a slash! (eg: /uploads/)<br/>\n"); }
  }

  # admin email
  if (array_key_exists('adminEmail', $_REQUEST) && !isValidEmail($_REQUEST['adminEmail'])) {
    alert("Admin Email must be a valid email (example: user@example.com)<br/>\n");
  }

  // error checking - require HTTPS
  if (@$_REQUEST['requireHTTPS'] && !isHTTPS()) {
    alert("Require HTTPS: You must be logged in with a secure HTTPS url to set this option!<br/>\n");
  }

  // error checking - require HTTPS
  if (@$_REQUEST['restrictByIP'] && !isIpAllowed(true, @$_REQUEST['restrictByIP_allowed'])) {
    alert(t("Restrict IP Access: You current IP address must be in the allowed IP list!") . "<br/>\n");
  }

  // error checking - encrypt passwords
  if ($SETTINGS['advanced']['encryptPasswords'] && array_key_exists('encryptPasswords', $_REQUEST) && !$_REQUEST['encryptPasswords']) {
    alert("Encrypt Passwords: You may not disable this option!<br/>\n");
  }

  // error checking - session values
  $sessionErrors = getCustomSessionErrors(@$_REQUEST['session_cookie_domain'], @$_REQUEST['session_save_path']);
  if ($sessionErrors) { alert($sessionErrors); }



  # show errors
  if (alert()) {
    showInterface('admin/general.php');
    exit;
  }


  ### update global settings
  $globalSettings =& $SETTINGS;
  foreach (array_keys($globalSettings) as $key) {
    if (array_key_exists($key, $_REQUEST)) { $globalSettings[$key] = $_REQUEST[$key]; }
  }

  # update subsection settings
  $subsections = array('advanced', 'wysiwyg');
  foreach ($subsections as $subsection) {
    $sectionSettings =& $SETTINGS[$subsection];
    foreach (array_keys($sectionSettings) as $key) {
      if (array_key_exists($key, $_REQUEST)) { $sectionSettings[$key] = $_REQUEST[$key]; }
    }
  }

  # save to file
  saveSettings();

  # return to admin home
  notice('Settings have been saved.');
  showInterface($savePagePath);
}

//
function getTimeZoneOptions($selectedTimezone = '') {
  global $SETTINGS;

  // get timezone name to offset
  $tzNameToOffset = array();
  foreach (timezone_abbreviations_list() as $abbrZones) {
    foreach ($abbrZones as $abbrZoneArray) {
      $name   = $abbrZoneArray['timezone_id'];
      $offset = convertSecondsToTimezoneOffset($abbrZoneArray['offset']);
      $tzNameToOffset[ $name ] = $offset;
    }
  }

  // sort from GMT-11:00 to GMT+14:00
  $tzKeyValuesArray = array();
  foreach ($tzNameToOffset as $tzName => $tzOffset) {  $tzKeyValuesArray[] = array($tzName,$tzOffset); }
  uasort($tzKeyValuesArray, '_sortTimeZones');

  $tzNameToOffset = array();
  foreach ($tzKeyValuesArray as $keyAndValue) {
    list($key, $value) = $keyAndValue;
    $tzNameToOffset[$key] = $value;
  }

  // get options
  $options = '';
  foreach ($tzNameToOffset as $tzName => $tzOffset) {
    if (!$tzName) { continue; }
    $isSelected    = $tzName == $selectedTimezone;
    $selectedAttr  = $isSelected ? 'selected="selected"' : '';
    $options      .= "<option value='$tzName' $selectedAttr>(GMT $tzOffset) $tzName</option>\n";
  }

  return $options;
}

// return timezones sorted from GMT-11:00 to GMT+14:00, and then by name
// usage: uasort($tzKeyValuesArray, '_sortTimeZones');
function _sortTimeZones($arrayA, $arrayB) {
  list($nameA, $offsetA) = $arrayA;
  list($nameB, $offsetB) = $arrayB;

  // sort by -/+ offset first
  $isNegativeA = (bool) strstr($offsetA, '-'); // eg: -08:00
  $isNegativeB = (bool) strstr($offsetB, '-');
  $cmp = strcmp($isNegativeB, $isNegativeA);
  if ($cmp != 0) { return $cmp; }

  // sort by offset value next
  $cmp = strcmp($offsetA, $offsetB);
  if ($isNegativeA) { $cmp *= -1; }        // sort negative offsets in reverse
  if ($cmp != 0) { return $cmp; }

  // sort by name last
  return strcasecmp($nameA, $nameB);
}

// list($maxCpuSeconds, $memoryLimitMegs, $maxProcessLimit, $ulimitOutput) = getUlimitValues('soft');
function getUlimitValues($type = 'soft') {
  $maxCpuSeconds     = '';
  $memoryLimitKbytes = '';
  $maxProcessLimit   = '';
  $output            = '';

  // get shell command
  if     ($type == 'soft') { $cmd = 'sh -c "ulimit -a -S" 2>&1'; }
  elseif ($type == 'hard') { $cmd = 'sh -c "ulimit -a -H" 2>&1'; }
  else                     { die(__FUNCTION__ . ": type must be either hard or soft"); }

  // get output
  $output = @shell_exec($cmd);

  // parse output
  if (preg_match("/^(time|cpu time).*?\s(\S*)$/m", $output, $matches))                  { $maxCpuSeconds = $matches[2]; }
  if (preg_match("/^(data|data seg).*?\s(\S*)$/m", $output, $matches))                  { $dataSegLimit  = $matches[2]; }
  if (preg_match("/^(vmemory|virtual mem).*?\s(\S*)$/m", $output, $matches))            { $vmemoryLimit  = $matches[2]; }
  if (preg_match("/^(concurrency|max user processes).*?\s(\S*)$/m", $output, $matches)) { $maxProcessLimit  = $matches[2]; }

  if (@$vmemoryLimit > @$dataSegLimit) { $memoryLimitKbytes = @$vmemoryLimit; }
  else                                 { $memoryLimitKbytes = @$dataSegLimit; }

  //
  return array($maxCpuSeconds, $memoryLimitKbytes, $maxProcessLimit, $output);
}

?>
