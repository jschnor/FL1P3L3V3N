<?php
/*
Plugin Name: Permalinks
Description: Create SEO optimized permalinks, custom URLS, or custom aliases for any page.
Version: 1.01
Requires at least: 2.53
*/

### UPDATE THESE VALUES
$GLOBALS['PERMALINKS']['autopopulate']            = true; // automatically fill in permalink field if user leaves it blank
$GLOBALS['PERMALINKS']['autopopulate_fromFields'] = array('name', 'title'); // the first field in this list with content will be used to create the permalinks. To use multiple fields separate them with spaces
$GLOBALS['PERMALINKS']['autopopulate_skipWords']  = array('a','an','and','as','at','before','but','by','for','from','is','in','into','it','like','of','off','on','onto','per','since','than','the','this','that','to','up','via','with'); // these seo unfriendly words will be removed
$GLOBALS['PERMALINKS']['404_not_found_filepath']  = dirname(__FILE__) . '/permalinks_notFound404.php'; // filepath to include if Permalink isn't found

// DON'T UPDATE ANYTHING BELOW THIS LINE

$GLOBALS['PERMALINKS_PLUGIN']  = true;

addAction('admin_postlogin',               'permalink_cms_onInstallCreateSchemas',  null, 0);
addFilter('record_preedit',                'permalink_cms_onEditShowFieldPrefix',   null, 2);
addAction('record_presave',                'permalink_cms_onPreSaveAutopopulate',   10,   3);
addAction('record_presave',                'permalink_cms_onPreSaveLowercase',      20,   3);
addAction('record_save_posterrorchecking', 'permalink_cms_onSaveErrorChecking',     null, 3);
addAction('record_save_posterrorchecking', 'permalinkDB_onSaveErrorChecking', null, 3);
addAction('record_postsave',               'permalink_cms_onSaveUpdatePermalinks',  null, 4);
addAction('record_posterase',              'permalink_cms_onEraseRemovePermalinks', null, 2);
addFilter('viewer_output_rows',            'permalink_viewers_updateLinks',         null, 3);


// plugin menu - add code generator link
pluginAction_addHandlerAndLink(t('Code Generator'), 'permalink_codeGeneratorLink', 'admins');
function permalink_codeGeneratorLink() { redirectBrowserToURL('?menu=_codeGenerator&_generator=permalink_codeGenerator'); }

// plugin menu - add Permalinks DB link
pluginAction_addHandlerAndLink(t('Permalinks DB'), 'permalink_permalinksMenuLink', 'admins');
function permalink_permalinksMenuLink() { redirectBrowserToURL('?menu=_permalinks'); }

// code generator menu -
addGenerator('permalink_codeGenerator',  t("Permalinks"), t("Generate .htaccess code for redirecting requests."));
function permalink_codeGenerator() { require_once("permalinks_codeGenerator.php"); permalink_codeGenerator_showPage(); exit; }

// -------------------------------------------

// create permalink schema once plugin is installed
function permalink_cms_onInstallCreateSchemas() {
  global $TABLE_PREFIX;


  // v1.01 upgrade - remove old schema so it gets re-created with new schema below (mysql data won't change)
  $upgradeTo101 = !array_value(loadSchema('_permalinks'), 'old'); // check for lack of field 'old' in schema
  if ($upgradeTo101) {
    @unlink( DATA_DIR.'/schema/_permalinks.ini.php' );
  }

  // on install/upgrade - create schemas from ./pluginSchemas/
  plugin_createSchemas();

  // v1.01 upgrade - set old flag on all but the latest permalinks
  if ($upgradeTo101) {
    $allAsOldQuery = "UPDATE {$TABLE_PREFIX}_permalinks SET `old` = 1";
    mysql_query($allAsOldQuery) or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");

    $latestAsNewQuery = "UPDATE {$TABLE_PREFIX}_permalinks p1
                           JOIN (SELECT recordNum, MAX(updatedDate) as updatedDate FROM {$TABLE_PREFIX}_permalinks GROUP BY tableName, recordNum) as p2
                             ON p1.recordNum = p2.recordNum AND p1.updatedDate = p2.updatedDate
                            SET old = 0";
    mysql_query($latestAsNewQuery) or die("MySQL Error: ". htmlspecialchars(mysql_error()) . "\n");
  }

}

// dynamically modify permalink schema to so "http://HOSTNAME/" and "/" shows before and after permalink field
function permalink_cms_onEditShowFieldPrefix($tableName, $recordNum) {
  if (!array_key_exists('permalink', $GLOBALS['schema'])) { return; } // skip for sections without permalink fields

  // update permalink prefix/suffix to show current hostname (whatever that may be)
  $GLOBALS['schema']['permalink']['fieldPrefix']  = "http://" . htmlencode( $_SERVER['HTTP_HOST'] ) . PREFIX_URL . '/';
  $GLOBALS['schema']['permalink']['description'] = '/';
}

// if users submits a blank permalink (or a permalink with prefix only) autopopulate it based on title,name,etc field content
function permalink_cms_onPreSaveAutopopulate($tableName, $isNewRecord, $oldRecord) {
  if (!$GLOBALS['PERMALINKS']['autopopulate'])            { return; } // don't auto-populate unless enabled
  if (!array_key_exists('permalink', $GLOBALS['schema'])) { return; } // skip for sections without permalink fields
  if ($tableName == '_permalinks')                        { return; } // skip when admin is directly editing permalinks table

  // is autopopulate needed?
  $permalinkText  = @$_REQUEST['permalink'];
  $requiredPrefix = $GLOBALS['schema']['permalink']['defaultValue'];
  $doAutopopulate = ($permalinkText == '' || $permalinkText == $requiredPrefix);
  if (!$doAutopopulate) { return; }

  // get auto populate text
  $autopopulateText  = '';
  $skipWordsRegexp   = implode('|', array_filter($GLOBALS['PERMALINKS']['autopopulate_skipWords'], 'preg_quote'));
  foreach ($GLOBALS['PERMALINKS']['autopopulate_fromFields'] as $fieldOrFields) {
    $inputText = '';
    $fields = preg_split("/ /", $fieldOrFields);
    foreach ($fields as $field) {
      if (!array_key_exists($field, $_REQUEST)) { continue 2; } // skip if one or more fields not defined
      $inputText .= $_REQUEST[$field] . ' '; // trailing space in case more fields are added (final trailing space will be removed by _permalink_generatePermalink())
    }

    // get permalink text
    $autopopulateText = _permalink_generatePermalink( $inputText, $requiredPrefix );
    if ($autopopulateText != '') { break; } // stop as soon as we have something
  }
  if ($autopopulateText == '') { return; } // if we couldn't auto-generate anything then return (the user will get regular errors to either fill in title or permalink)


  // make sure $autopopulateText is unique (add -1, -2, -3, etc up to 100)
  $originalText  = $autopopulateText;
  $originalWhere = $isNewRecord ? "1" : mysql_escapef("num != ? ", @$_REQUEST['num']);
  $where         = "$originalWhere AND " . mysql_escapef("permalink = ?", $autopopulateText);
  $count         = 0;
  while (mysql_count('_permalinks', $where)) {
    $count         = $count + 1;
    $autopopulateText = $originalText . "-$count";
    $where         = "$originalWhere AND " . mysql_escapef("permalink = ?", $autopopulateText);
    if ($count > 100) { die(__FUNCTION__. ": Couldn't find a unique value to autopopulate with after 100 tries!"); }
  }

  // update request
  $_REQUEST['permalink'] = $autopopulateText;
}

// Return permalinkText with SEO rules applied
// SEO Rules include: remove "skip words", spaces to dashes, remove non-alphanumeric, remove leading/trailing underscores
// returns blank if no permalink could be generated (such as if title was all spaces)
function _permalink_generatePermalink($inputText, $prefix = '') {
  $permalinkText = $inputText;

  // remove accents from latin chars for SEO and readability - ref: https://www.google.com/search?q=seo+accented+characters
  $charsToEntities = array( // reference: http://php.net/manual/en/function.str-replace.php#85431
    'A'   => '/&Agrave;|&Aacute;|&Acirc;|&Atilde;|&Auml;|&Aring;/',
    'a'   => '/&agrave;|&aacute;|&acirc;|&atilde;|&auml;|&aring;/',
    'C'   => '/&Ccedil;/',
    'c'   => '/&ccedil;/',
    'E'   => '/&Egrave;|&Eacute;|&Ecirc;|&Euml;|&AElig;/',
    'e'   => '/&egrave;|&eacute;|&ecirc;|&euml;|&aelig;/',
    'I'   => '/&Igrave;|&Iacute;|&Icirc;|&Iuml;/',
    'i'   => '/&igrave;|&iacute;|&icirc;|&iuml;/',
    'N'   => '/&Ntilde;/',
    'n'   => '/&ntilde;/',
    'O'   => '/&Ograve;|&Oacute;|&Ocirc;|&Otilde;|&Ouml;|&Oslash;/',
    'o'   => '/&ograve;|&oacute;|&ocirc;|&otilde;|&ouml;|&oslash;/',
    'U'   => '/&Ugrave;|&Uacute;|&Ucirc;|&Uuml;/',
    'u'   => '/&ugrave;|&uacute;|&ucirc;|&uuml;/',
    'Y'   => '/&Yacute;/',
    'y'   => '/&yacute;|&yuml;/',
    'a.'  => '/&ordf;/',
    'o.'  => '/&ordm;/',
    'and' => '/&amp;/',
  );
  $permalinkText = htmlentities($permalinkText, ENT_NOQUOTES, 'UTF-8'); // convert special chars to html entities
  $permalinkText = preg_replace($charsToEntities, array_keys($charsToEntities), $permalinkText); // replace those entities with non accented versions

  // get auto populate text
  $skipWordsRegexp  = implode('|', array_filter($GLOBALS['PERMALINKS']['autopopulate_skipWords'], 'preg_quote'));
  foreach ($GLOBALS['PERMALINKS']['autopopulate_fromFields'] as $field) {
    $permalinkText = preg_replace("/\b($skipWordsRegexp)\b/i", '', $permalinkText); // remove "skip words"
    $permalinkText = preg_replace('/\s+/', '-', $permalinkText);               // replace spaces with dashes
    $permalinkText = preg_replace('/[^a-z0-9\-\.\_]+/i', '', $permalinkText);  // remove non-alphanumeric chars
    $permalinkText = preg_replace("/-+/", '-', $permalinkText);                // collapse multiple dashes
    $permalinkText = preg_replace("/(^-+|-+$)/", '', $permalinkText);          // remove leading and trailing underscores
    if ($permalinkText != '') { break; } // stop as soon as we have something
  }
  if ($permalinkText == '') { return; } // if we couldn't auto-generate anything then return (the user will get regular errors to either fill in title or permalink)

  // add prefix
  $permalinkText = $prefix . $permalinkText;

  return $permalinkText;
}

//
function permalink_cms_onPreSaveLowercase($tableName, $isNewRecord, $oldRecord) {
  if (!array_key_exists('permalink', $GLOBALS['schema'])) { return; } // skip for sections without permalink fields

  // lowercase permalink
  if (@$_REQUEST['permalink']) {
    $_REQUEST['permalink'] = strtolower(@$_REQUEST['permalink']);
  }
}


// on save add some error checking to make sure permalinks are what we want
function permalink_cms_onSaveErrorChecking($tableName, $recordExists, $oldRecord) {
  if (!array_key_exists('permalink', $GLOBALS['schema']))   { return; } // skip for sections without permalink fields
  if ($tableName == '_permalinks') { return; } // skip for _permalinks menu itself

  // check that viewer path can be determined
  list(, $pathErrors) = _permalink_getAbsolutePath($tableName, null);
  if ($pathErrors) { die(t("Permalinks: ") . $pathErrors); }

  // get permalink
  $permalinkText   = @$_REQUEST['permalink'];
  $permalinkRecord = mysql_get('_permalinks', null, array('permalink' => $permalinkText)); // check if permalink already exists in database
  $iaAlreadyUsed   = $permalinkRecord && $permalinkRecord['recordNum'] != @$_REQUEST['num'] && ($tableName != '_permalinks');

  // error checking
  $requiredPrefix  = $GLOBALS['schema']['permalink']['defaultValue'];
  if     (!$permalinkText)                              { die("You must enter a value for 'permalink'!"); }
  elseif ($permalinkText == $requiredPrefix)            { die("You must enter a value for 'permalink' after '" .htmlencode($requiredPrefix). "'!"); }
  elseif (!startsWith($requiredPrefix, $permalinkText)) { die("Permalink must start with '" .htmlencode($requiredPrefix). "'!"); }
  elseif (preg_match("|[^\w\-\./]|i", $permalinkText))  { die("Permalink can only contain these chars (a-z0-9/-.)!"); }
  elseif (preg_match("!^/|/$!", $permalinkText))        { die("Permalink can not start or end with a slash!"); }
  elseif (preg_match("!\.{2,}!", $permalinkText))       { die("Permalink can not include '..'!"); }
  elseif (preg_match("!/{2,}!", $permalinkText))        { die("Permalink can not include '//'!"); }
  elseif ($iaAlreadyUsed)                               { die(sprintf("Permalink '%s' is already in use, please choose another!", htmlencode($permalinkText))); }



}

// on save, add permalink to database
// NOTE: We never remove old permalinks, so that old permalinks ALWAYS work (we only erase permalinks when records are removed)
function permalink_cms_onSaveUpdatePermalinks($tableName, $isNewRecord, $oldRecord, $recordNum) {
  if (!array_key_exists('permalink', $GLOBALS['schema'])) { return; } // skip for sections without permalink fields
  if ($tableName == '_permalinks') { return; } // skip when admin is directly editing permalinks table

  // get permalink
  $permalinkText   = @$_REQUEST['permalink'];
  $permalinkRecord = mysql_get('_permalinks', null, array('permalink' => $permalinkText)); // check if permalink already exists in database
  $iaAlreadyUsed   = $permalinkRecord && $permalinkRecord['recordNum'] != @$_REQUEST['num'];

  // error checking
  permalink_cms_onSaveErrorChecking($tableName, $isNewRecord, $oldRecord);
  if ($iaAlreadyUsed)           { die("Error: Permalink is already in use, please choose another!"); }

  // mark all other matching permalinks as old
  $where = mysql_escapef("`tableName` = ? AND `recordNum` = ? AND permalink != ?", $tableName, $recordNum, $permalinkText);
  mysql_update('_permalinks', null, $where, array('old' => '1'));

  // insert/update
  $colsToValues = array('permaLink' => $permalinkText, 'tableName' => $tableName, 'recordNum' => $recordNum, 'updatedDate=' => 'NOW()', 'old' => '0');
  if ($permalinkRecord) { mysql_update('_permalinks', $permalinkRecord['num'], null, $colsToValues); }
  else                  { mysql_insert('_permalinks', $colsToValues); }
}

// on erase, remove permalinks
function permalink_cms_onEraseRemovePermalinks($tableName, $recordNumsAsCSV) {
  if (!array_key_exists('permalink', $GLOBALS['schema'])) { return; } // skip for sections without permalink fields
  if ($tableName == '_permalinks') { return; } // skip when admin is directly editing permalinks table

  $deleteWhere = "`tableName` = '" .mysql_escape($tableName). "' AND recordNum IN ($recordNumsAsCSV)";
  mysql_delete('_permalinks', null, $deleteWhere);
}


//
function permalink_viewers_updateLinks($rows, $listDetails, $schema) {
  if (!@array_key_exists('permalink', $schema)) { return $rows; } // skip if no permalink field specified

  // update _link to point to permalink
  foreach (array_keys($rows) as $index) {
    $row = &$rows[$index];
    if ($row['permalink']) { $row['_link'] = PREFIX_URL . '/' .$row['permalink']. '/'; }
    unset($row);
  }

  //
  return $rows;
}


// error checking for manual updates to permalinks DB
function permalinkDB_onSaveErrorChecking($tableName, $recordExists, $oldRecord) {
  if ($tableName != '_permalinks')   { return; } // only run for permalinks DB

  // error checking for custom source urls
  if (@$_REQUEST['customSourceUrl'] != '') {
    list($viewerAbsPath, $pathErrors) = _permalink_getAbsolutePath(null, $_REQUEST['customSourceUrl']);
    if ($pathErrors) { die($pathErrors); }
  }
}

// list($abspath, $pathErrors) = _permalink_getAbsolutePath($tablename, null);
// list($abspath, $pathErrors) = _permalink_getAbsolutePath(null, $customSourceUrl);
// if ($pathErrors) { die( nl2br(htmlencode($pathErrors)) ); }
function _permalink_getAbsolutePath($tableName = null, $relPathAndQuery = null) {
  global $SETTINGS;
  $absPath = '';
  $errors  = '';

  // error checking
  if (!file_exists($SETTINGS['webRootDir'])) {
    $errors .= sprintf(t("Check Settings, the following 'Website Root Directory' is invalid: '%s'"), $SETTINGS['webRootDir']) . "\n";
    return(array(null, $errors));
  }

  // custom source url
  if ($relPathAndQuery) {
    $relPath = array_first(explode('?', $relPathAndQuery));       // remove ?query=string from viewerUrl (if any)
    $absPath = getAbsolutePath(ltrim($relPath,'/'), $SETTINGS['webRootDir']);
    if (!$absPath) {
      $errors .= sprintf(t("Couldn't find filepath for permalink 'Custom Source Url' of '%s'!"), $relPath) . "\n";
      $errors .= t("Check that file exists and 'Website Root Directory' is correct under settings.") . "\n";
    }
    elseif (!file_exists($absPath))       { $errors .= sprintf(t("Permalink filepath does not exist '%s'!"), $absPath) . "\n"; }
  }

  // automatic permalinks
  elseif ($tableName) {
    $schema        = loadSchema( $tableName );
    $viewerUrl     = $schema['_detailPage'];
    $viewerRelPath = array_value(explode('?', $viewerUrl), 0);       // remove ?query=string from viewerUrl (if any)
    $viewerRelPath = str_replace('%20', ' ', $viewerRelPath);        // convert url encoded %20 to file-system friendly ' '
    if (file_exists($SETTINGS['webRootDir'].PREFIX_URL.$viewerRelPath)) { $viewerRelPath = PREFIX_URL.$viewerRelPath; } // add PREFIX_URL if file exists (/~username/ prefixs may be virtual only and not reflected in filesystem paths, where-as /clients/example.com/ prefixes may exist in filepaths)
    $absPath       = getAbsolutePath(ltrim($viewerRelPath,'/'), $SETTINGS['webRootDir']);

    if     (!$viewerUrl)                  { $errors .= sprintf(t("No 'Detail Page URL' set under: Admin > Section Editors > '%s' > Viewer Urls!"), $tableName). "\n"; }
    elseif (contains('http', $viewerUrl)) { $errors .= sprintf(t("'Detail Page URL' can't start with http in: Admin > Section Editors > '%s' > Viewer Urls!"), $tableName). "\n"; }
    elseif (!$viewerRelPath)              { $errors .= sprintf(t("'Detail Page URL' doesn't contain a filename under: Admin > Section Editors > '%s' > Viewer Urls!"), $tableName). "\n"; }
    elseif (!$absPath)                    { $errors .= sprintf(t("Couldn't find filepath for 'Detail Page URL' under: Admin > Section Editors > '%s' > Viewer Urls! Relative path: %s"), $tableName, $viewerRelPath). "\n"; }
    elseif (!file_exists($absPath))       { $errors .= sprintf(t("Permalink filepath does not exist '%s'!"), $absPath) . "\n"; }
  }

  //
  return array($absPath, $errors);
}



?>
