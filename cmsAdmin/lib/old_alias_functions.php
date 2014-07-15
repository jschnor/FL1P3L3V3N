<?php
// these functions were either renamed, replaced, or deprecated but are left here for compatibility with older custom code

// prev to 2.13
function countRecords           ($tableName, $whereClause = '') { return mysql_count($tableName, $whereClause); }
function mysql_select_count_from($tableName, $whereClause = '') { return mysql_count($tableName, $whereClause); }

function countRecordsByUser($tableName, $userNum = null) {
  if (!$userNum) { $userNum = @$GLOBALS['CURRENT_USER']['num']; }
  return mysql_count($tableName, "`createdByUserNum` = '" .mysql_escape($userNum). "'");
}

function escapeMysqlString($string) { return mysql_escape($string); }
function xmp_r($string)             { return showme($string); }
function getNumberFromEndOfUrl()    { return getLastNumberInUrl(); }

// as of 2.13
function mysql_query_fetch_row_assoc($query) { return mysql_get_query($query); }        // v2.16 replaced mysql_fetch calls with the following...
function mysql_query_fetch_row_array($query) { return mysql_get_query($query, true); }
function mysql_query_fetch_all_assoc($query) { return mysql_select_query($query); }
function mysql_query_fetch_all_array($query) { return mysql_select_query($query, true); }


// as of 2.15
function escapeJs($str) { return jsEncode($str); }

### as of 2.16

// load data from legacy INI file format
function loadINI($filepath) {
  // load INI file data
  if (!file_exists($filepath)) { die("Error: Couldn't find ini file '$filepath'"); } // error checking
  $iniValues = @parse_ini_file($filepath, true);
  if (@$php_errormsg) { die(__FUNCTION__ . ": $php_errormsg"); }
  return _decodeIniValues($iniValues);
}

// save old INI format files
function saveINI($filepath, $array, $sortKeys = 0) {
  $globals  = '';
  $sections = '';
  $invalidKeyRegexp   = '/[^a-zA-Z0-9\-\_\.]/i'; # dis-allowed chars[{}|&~![()"] (from http://ca.php.net/parse_ini_file)
  $filename = pathinfo($filepath, PATHINFO_BASENAME);

  // encode values
  $array = _encodeIniValues($array);

  ### get ini data
  if ($sortKeys) { ksort($array); }
  foreach ($array as $key => $value) {

    # save sub-sections
    if (is_array($value)) {
      $sections .= "\n[{$key}]\n";

      $childArray = $value;
      foreach ($childArray as $childKey => $childValue) {
        if (preg_match($invalidKeyRegexp, $childKey)) {
          $format  = 'Error: Invalid character(s) in key "%1$s", only the following chars are allowed in key names: a-z, A-Z, 0-9, -, _, . Filename: %2$s';
          $error   = sprintf($format, htmlencode($childKey), $filename);
          die($error);
        }

        $needsQuotes = !is_numeric($childValue) && !is_bool($childValue);
        if ($needsQuotes) { $sections .= "$childKey = \"$childValue\"\n"; }
        else              { $sections .= "$childKey = $childValue\n"; }
      }
    }

    # save global keys
    else {
      if (preg_match($invalidKeyRegexp, $key)) { die("Error: Invalid character(s) in key '".htmlencode($key)."', the following chars aren't allowed in key names: a-z, A-Z, 0-9, -, _, ." . t('Filename') . ": $filename"); }

      $needsQuotes = !is_numeric($value) && !is_bool($value);
      if ($needsQuotes) { $globals .= "$key = \"$value\"\n"; }
      else              { $globals .= "$key = $value\n"; }
    }

  }

  # create ini content
  $content = ";<?php die('This is not a program file.'); exit; ?>\n\n";  # prevent file from being executed
  $content .= $globals;
  $content .= $sections;

  # error checking
  if (file_exists($filepath) && !is_writable($filepath)) { die("Error writing to '$filepath'!<br/>\nFile isn't writable, check permissions!"); }

  # save ini file
  file_put_contents($filepath, $content) || die("Error writing to '$filepath'! $php_errormsg");
}

// encode key values that parse_ini_file can't handle
function _encodeIniValues($array) {
  // v2.03 - added encoding/decoding for $ since trailing $'s cause errors in PHP 5.3.0 - http://bugs.php.net/bug.php?id=48660
  static $matches      = array("\\",   "\n",  "\r", '"',  '$');
  static $replacements = array('\\\\', '\\n', '',   '\\q', '\\d');

  foreach (array_keys($array) as $key) {
    $value = &$array[$key];
    if (is_array($value)) { $value = _encodeIniValues($value); }
    else                  { $value = str_replace($matches, $replacements, $value); }
  }

  return $array;
}

// helped function for loadINI
function _decodeIniValues($array) {
  // v2.03 - added encoding/decoding for $ since trailing $'s cause errors in PHP 5.3.0 - http://bugs.php.net/bug.php?id=48660
  static $replacements = array('\\\\' => "\\", '\\n' => "\n", '\\q' => '"', '\\d' => '$');
  static $replaceCode  = "array_key_exists('\\1', \$replacements) ? \$replacements['\\1'] : '\\1';";

  // check for encoded chars - this check reduces execute time by up to 0.5 seconds or more
  $serializedData = serialize($array);
  if (!preg_match("/\\\\\\\\|\\\\n|\\\\q|\\\\d/", $serializedData)) { return $array; }

  // replace encoded chars
  foreach (array_keys($array) as $key) {
    $value = &$array[$key];
    if (is_array($value)) { $value = _decodeIniValues($value); }
    else                  { $value = @preg_replace('/(\\\\.)/e', $replaceCode, $value); } // this code is the fastest of several alternatives
  }
  return $array;
}

function userHasSectionEditorAccess($tableName)                { return userSectionAccess($tableName) >= 9; }
function userHasSectionAuthorViewerAccess($tableName)          { return userSectionAccess($tableName) >= 7; }
function userHasSectionAuthorAccess($tableName)                { return userSectionAccess($tableName) >= 6; }
function userHasSectionViewerAccess($tableName)                { return userSectionAccess($tableName) >= 3; }
function userHasSectionViewerAccessOnly($tableName)            { return userSectionAccess($tableName) == 3; }
function userHasSectionAuthorViewerAccessOnly($tableName)      { return userSectionAccess($tableName) == 7; }
function mysql_getValuesAsCSV($valuesArray, $defaultValue='0') { return mysql_escapeCSV($valuesArray, $defaultValue); }

// return returns of MySQL query as all/single row and assoc/indexed array
// $rows = mysql_fetch($query);                              // return all rows as assoc arrays
// $row  = mysql_fetch($query, true);                        // return first row as associative array
// list($value1, $value2) = mysql_fetch($query, true, true); // return first row as indexed array
// $indexedRows = mysql_fetch($query, false, true);          // return all rows as indexed arrays
function &mysql_fetch($query, $firstRowOnly = false, $indexedArray = false) {
  if ($firstRowOnly) { return mysql_get_query($query, $indexedArray); }
  else               { return mysql_select_query($query, $indexedArray); }
}

// as of v2.50

function _mysql_getMysqlSetValues($colsToValues) { return mysql_getMysqlSetValues($colsToValues); }

### as of v2.51

// save username and password as login session, doesn't check if they are valid
function user_createLoginSession($username, $password = null) {
  loginCookie_set($username, getPasswordDigest($password));
}

// save username and password as login session, doesn't check if they are valid
// NOTE: In future, do this instead: loginCookie_remove(); $GLOBALS['CURRENT_USER'] = false;
function user_eraseLoginSession() {
  loginCookie_remove();
  $GLOBALS['CURRENT_USER'] = false;
}

// load user with session login credentials, returns false if invalid username or password
// $user = user_loadWithSession();
function user_loadWithSession() { return getCurrentUser(); }

//
function getCurrentUserAndLogin($useAdminUI = true) {
  if ($useAdminUI) { die("Please upgrade the admin.php file, it is out of date!"); } // we moved admin code out of getCurrentUser() and into admin.php
  return getCurrentUser();
}


// deprecated as of v2.51
// $emailHeaders = emailTemplate_load();
// $errors       = sendMessage($emailHeaders);
// if ($errors) { alert("Mail Error: $errors"); }
// v2.16 - logging option is now passed through if defined
function emailTemplate_load($options) {
  $templatePath = @$options['template'];
  $from         = @$options['from'];
  $to           = @$options['to'];
  $subject      = @$options['subject'];
  $placeholders = @$options['placeholders'];

  // error checking
  if (!file_exists($templatePath)) { die(__FUNCTION__.": Couldn't find email template '" .htmlencode($templatePath). "'"); }

  // get message html
  global $FROM, $TO, $SUBJECT, $PLACEHOLDERS;
  list($FROM, $TO, $SUBJECT, $PLACEHOLDERS) = array($from, $to, $subject, $placeholders);
  ob_start();
  include($templatePath);
  $HTML = ob_get_clean();

  // error checking
  if (!$FROM)    { die(__FUNCTION__ . ": No \$FROM set by program or email template '" .htmlencode($templatePath). "'"); }
  if (!@$TO)     { die(__FUNCTION__ . ": No \$TO set by program or email template '" .htmlencode($templatePath). "'"); }
  if (!$SUBJECT) { die(__FUNCTION__ . ": No \$SUBJECT set by program or email template '" .htmlencode($templatePath). "'"); }
  if (!$HTML)    { die(__FUNCTION__ . ": No content found by program or email template '" .htmlencode($templatePath). "'"); }

  //
  $emailHeaders = array(
    'from'    => $FROM,
    'to'      => $TO,
    'subject' => $SUBJECT,
    'html'    => $HTML,
  );
  if (array_key_exists('logging', $options)) { $emailHeaders['logging'] = $options['logging']; }
  return $emailHeaders;
}


// deprecated as of v2.51
function emailTemplate_showPreviewHeader() {
  if (@$_REQUEST['noheader']) { return; }
  $hideHeaderLink = thisPageUrl( array('noheader' => 1) );

  global $FROM, $TO, $SUBJECT;
?>
  <div style="border: 3px solid #000; background-color: #EEE; padding: 10px; text-align: left; margin: 25px">
  <b>Header Preview:</b> (Users won't see this - <a href="<?php echo $hideHeaderLink; ?>">hide header</a>)
<xmp>   From: <?php echo htmlencode($FROM) . "\n" ?>
     To: <?php echo htmlencode($TO) . "\n"; ?>
Subject: <?php echo htmlencode($SUBJECT); ?></xmp>
  </div>
<?php
}

### as of 2.52

// this function used to return a modified time() with a hour/min offset to represent the users timezone
// it's no longer required as the current minimum PHP version we support supports date_default_timezone_set()
// So we just return time() to avoid breaking any existing plugins or 3rd party code that use this.  If a
// timezone is set in the CMS existing code should work as expected.
function getAdjustedLocalTime() { return time(); }

// as of 2.54, use mysql_escape($string, true); instead
function escapeMysqlWildcards($string) { return addcslashes($string, '%_'); }
function getMysqlLimit($perPage, $pageNum) { return mysql_limit($perPage, $pageNum); }

?>
