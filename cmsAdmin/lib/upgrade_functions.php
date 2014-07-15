<?php

global $PROGRAM_DIR;

//
showUpgradeErrors();
checkFilePermissions();

//
_upgradeToVersion1_04();
_upgradeToVersion1_06();
_upgradeToVersion1_07();
_upgradeToVersion1_08();
_upgradeToVersion1_10();
_upgradeSettings();
_upgradeAccounts();
_upgradeToVersion1_24();
_upgradeToVersion2_05();
_upgradeToVersion2_07();
_upgradeToVersion2_09();

//
_removeOldCacheFiles();

//
_notifyUpgradeComplete();


//
function showUpgradeErrors() {
  $upgradeErrors = '';

  // check for accesslist schema
  $schemaPath = DATA_DIR.'/schema/_accesslist.ini.php';
  if (!file_exists($schemaPath)) {
    $upgradeErrors .= "<b>Upgrade Notice:</b> You must upload the latest /data/schema/_accesslist.ini.php before upgrading!<br/>\n";
  }

  // check for settings schema
  #$schemaPath = DATA_DIR.'/schema/_settings.ini.php';
  #if (!file_exists($schemaPath)) {
  #  $upgradeErrors .= "<b>Upgrade Notice:</b> You must upload the latest /data/schema/_settings.ini.php before upgrading!<br/>\n";
  #}

  // check for old plugin dir (changed in v1.34)
  $oldPluginDir = "{$GLOBALS['PROGRAM_DIR']}/lib/plugins";
  if (is_dir($oldPluginDir)) {
    $upgradeErrors .= "<b>Upgrade Notice</b>: Plugins directory has changed! If you have custom plugins, move them from /lib/plugins/ to /plugins/.  Then remove old /lib/plugins/ folder<br/>\n";
  }

  // check for old wysiwyg path in custom wysiwyg file
  $customWysiwygCode = @file_get_contents('lib/wysiwyg_custom.php');
  if (preg_match("/tinymce3/", $customWysiwygCode)) {
    $upgradeErrors .= "<b>Upgrade Notice</b>: WYSIWYG paths have changed.  Please replace 'tinymce3/' with '3rdParty/tiny_mce/' in /lib/wysiwyg_custom.php<br/>\n";
  }
  if (preg_match("/css\/wysiwyg.css/", $customWysiwygCode)) {
    $upgradeErrors .= "<b>Upgrade Notice</b>: WYSIWYG paths have changed.  Please replace 'css/wysiwyg.css' with 'lib/wysiwyg.css' in /lib/wysiwyg_custom.php<br/>\n";
  }



  //
  if ($upgradeErrors) { die($upgradeErrors); }

}


//
function _upgradeToVersion2_09() {
  global $SETTINGS;
  if ($SETTINGS['programVersion'] >= '2.09') { return; }

  // create missing table "_settings"
  createMissingSchemaTablesAndFields();

  //
  makeAllUploadRecordsRelative();

  //
  saveAndRefresh('2.09');
}


//
function _upgradeToVersion2_07() {
  global $SETTINGS, $APP, $TABLE_PREFIX;
  if ($SETTINGS['programVersion'] >= '2.07') { return; }


  // update mysql tables, schema, schema preset files
  $schemaDirs = array(DATA_DIR .'/schema', DATA_DIR . '/schemaPresets');
  foreach ($schemaDirs as $schemaDir) {
    foreach (getSchemaTables($schemaDir) as $tableName) {
      $schema = loadSchema($tableName, $schemaDir);
      if (@$schema['menuType'] == 'link') {
        // add field
        if (!array_key_exists('_targetBlank', $schema)) { $schema['_targetBlank'] = 1;  }
      }
      // add field
      if (!array_key_exists('_disablePreview', $schema)) { $schema['_disablePreview'] = 0;  }
      uasort($schema, '__sortSchemaFieldsByOrder'); // sort schema keys
      saveSchema($tableName, $schema, $schemaDir);
    }
  }

  //
  saveAndRefresh('2.07');
}

//
function _upgradeToVersion2_05() {
  global $SETTINGS, $APP, $TABLE_PREFIX;
  if ($SETTINGS['programVersion'] >= '2.05') { return; }


  // update mysql tables, schema, schema preset files
  $skipTables = array('uploads','_accesslist');
  $schemaDirs = array(DATA_DIR .'/schema', DATA_DIR . '/schemaPresets');
  foreach ($schemaDirs as $schemaDir) {
    foreach (getSchemaTables($schemaDir) as $tableName) {
      if (in_array($tableName, $skipTables)) { continue; }  // skip tables
      $schema           = loadSchema($tableName, $schemaDir);

      // add field
      if (!array_key_exists('_disableView', $schema)) { $schema['_disableView'] = 1;  }
      uasort($schema, '__sortSchemaFieldsByOrder'); // sort schema keys
      saveSchema($tableName, $schema, $schemaDir);
    }
  }

  //
  saveAndRefresh('2.05');
}

//
function _upgradeToVersion1_24() {
  global $SETTINGS, $APP, $TABLE_PREFIX;
  if ($SETTINGS['programVersion'] >= '1.24') { return; }

  ### Update account with "Editor" access to all sections to have Editor access
  ### to all by User Accounts so upgrading doesn't grant additional access

  // get list of accounts to update
  $query   = "SELECT * FROM `{$TABLE_PREFIX}_accesslist` acl\n";
  $query  .= "         JOIN `{$TABLE_PREFIX}accounts` a\n";
  $query  .= "           ON acl.tableName = 'all' AND acl.accessLevel = 9 AND a.num = acl.userNum AND a.isAdmin != 1\n";
  $records = mysql_select_query($query);

  // update users
  $schemaTables = getSchemaTables();
  foreach ($records as $user) {

    // insert new access levels
    $insertRows  = '';
    $randomId    = uniqid('', true);
    foreach ($schemaTables as $tableName) {
      if ($tableName == 'accounts') { continue; }
      if ($tableName == '_accesslist') { continue; }
      if ($tableName == 'uploads') { continue; }
      if ($insertRows) { $insertRows .= ",\n"; }
      $escapedUserNum   = mysql_escape( $user['num'] );
      $escapedTableName = mysql_escape( $tableName );
      $accessLevel      = '9';
      $maxRecords       = "NULL";
      $escapedSaveId    = mysql_escape( $randomId );
      $insertRows  .= "('$escapedUserNum', '$escapedTableName', '$accessLevel', $maxRecords, '$escapedSaveId')";
    }

    $insertQuery  = "INSERT INTO `{$TABLE_PREFIX}_accesslist`\n";
    $insertQuery .= "(userNum, tableName, accessLevel, maxRecords, randomSaveId)\n";
    $insertQuery .= "VALUES $insertRows\n";
    mysql_query($insertQuery) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");

    // delete old access levels
    $deleteQuery  = "DELETE FROM `{$TABLE_PREFIX}_accesslist`\n";
    $deleteQuery .= "WHERE userNum = '" .mysql_escape( $user['num'] ). "'\n";
    $deleteQuery .= "  AND randomSaveId != '" .mysql_escape( $randomId ). "'\n";
    mysql_query($deleteQuery) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  }

  //
  saveAndRefresh('1.24');
}

//
function _upgradeToVersion1_10() {
  global $SETTINGS, $APP, $TABLE_PREFIX;
  if ($SETTINGS['programVersion'] >= '1.10') { return; }

  ### Update Access Levels
  _upgradeToVersion1_10_accessLevels();


  // update mysql tables, schema, schema preset files
  $schemaDirs = array(DATA_DIR .'/schema', DATA_DIR . '/schemaPresets');
  $fieldsToMaintainOrder = array('num','createdDate','createdByUserNum','updatedDate','updatedByUserNum');
  foreach ($schemaDirs as $schemaDir) {
    foreach (getSchemaTables($schemaDir) as $tableName) {
      $schema           = loadSchema($tableName, $schemaDir);
      $escapedTableName = mysql_escape( getTableNameWithPrefix($tableName) );
      $isPreset         = $schemaDir == DATA_DIR.'/schemaPresets';

      // skip tables
      if ($tableName == 'uploads')     { continue; }
      if ($tableName == '_accesslist') { continue; }

      // add fields
      $schema['num']['order']     = "1";
      $schema['createdDate']      = array('order' => '2', 'type' => 'none', 'label' => "Created", 'isSystemField' => '1');
      $schema['createdByUserNum'] = array('order' => '3', 'type' => 'none', 'label' => "Created By", 'isSystemField' => '1');
      $schema['updatedDate']      = array('order' => '4', 'type' => 'none', 'label' => "Last Updated", 'isSystemField' => '1');
      $schema['updatedByUserNum'] = array('order' => '5', 'type' => 'none', 'label' => "Last Updated By", 'isSystemField' => '1');

      //
      foreach (array_keys($schema) as $fieldname) {
        $fieldSchema = &$schema[$fieldname];
        if (!is_array($fieldSchema)) { continue; }  // fields are stored as arrays, other entries are table metadata, skip metadata
        if (!in_array($fieldname, $fieldsToMaintainOrder)) {
          $fieldSchema['order'] = @$fieldSchema['order'] + 6;
        }

        ### Change column type for checkbox fields
        if (@$fieldSchema['type'] == 'checkbox' && !$isPreset) {
          mysql_query("UPDATE `$escapedTableName` SET `$fieldname` = 0 WHERE `$fieldname` IS NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
          mysql_query("ALTER TABLE `$escapedTableName` CHANGE COLUMN `$fieldname` `$fieldname` tinyint(1) unsigned NOT NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
        }

        ### Change column type for datetime fields
        if (@$fieldSchema['type'] == 'date' && !$isPreset) {
          mysql_query("UPDATE `$escapedTableName` SET `$fieldname` = '0000-00-00 00:00:00' WHERE `$fieldname` IS NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
          mysql_query("ALTER TABLE `$escapedTableName` CHANGE COLUMN `$fieldname` `$fieldname` datetime NOT NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
        }

        // Rename autoPublish fields
        if ($fieldname == 'autoPublishStartDate' && !@$schema['publishDate']) {
          $schema['publishDate'] = $fieldSchema;
          unset($schema[$fieldname]);
          if (!$isPreset) {
            mysql_query("UPDATE `$escapedTableName` SET `$fieldname` = '0000-00-00 00:00:00' WHERE `$fieldname` IS NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
            mysql_query("ALTER TABLE `$escapedTableName` CHANGE COLUMN `$fieldname` `publishDate` datetime NOT NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
          }
        }
        if ($fieldname == 'autoPublishEndDate' && !@$schema['removeDate']) {
          $schema['removeDate'] = $fieldSchema;
          unset($schema[$fieldname]);
          if (!$isPreset) {
            mysql_query("UPDATE `$escapedTableName` SET `$fieldname` = '0000-00-00 00:00:00' WHERE `$fieldname` IS NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
            mysql_query("ALTER TABLE `$escapedTableName` CHANGE COLUMN `$fieldname` `removeDate` datetime NOT NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
          }
        }
        if ($fieldname == 'autoPublishNeverExpires' && !@$schema['neverRemove']) {
          $schema['neverRemove'] = $fieldSchema;
          unset($schema[$fieldname]);
          if (!$isPreset) {
            mysql_query("UPDATE `$escapedTableName` SET `$fieldname` = 0 WHERE `$fieldname` IS NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
            mysql_query("ALTER TABLE `$escapedTableName` CHANGE COLUMN `$fieldname` `neverRemove` tinyint(1) unsigned NOT NULL") or die("Mysql error:\n\n". htmlencode(mysql_error()) . " in " .__FILE__ . ", line " .__LINE__);
          }
        }
      }

      uasort($schema, '__sortSchemaFieldsByOrder'); // sort schema keys
      saveSchema($tableName, $schema, $schemaDir);
    }
  }

  //
  createMissingSchemaTablesAndFields(); // create missing fields
  clearAlertsAndNotices(); // don't show "created table/field" alerts

  saveAndRefresh('1.10'); // uncomment this after next update
}


//
function _upgradeToVersion1_10_accessLevels() {
  global $TABLE_PREFIX;

  // error checking (check upgrade files were uploaded)
  $errors           = '';
  $accessListSchema = loadSchema("_accesslist");
  $accountsSchema   = loadSchema("accounts");
  if (empty($accessListSchema)) { $errors .= "Error: You must upload the latest /data/schema/_accesslist.ini.php before upgrading!<br/>\n"; }
  if ($errors) {
    die($errors);
  }

  // check if already upraded
  $result = mysql_query("SELECT * FROM `{$TABLE_PREFIX}accounts` LIMIT 0,1") or die("MySQL Error: ". htmlencode(mysql_error()) ."\n");
  $record = mysql_fetch_assoc($result);
  if (!$record || !array_key_exists('tableAccessList', $record)) { return; }


  // create new access table
  $query = "CREATE TABLE IF NOT EXISTS `{$TABLE_PREFIX}_accesslist` (
    `userNum`      int(10) unsigned NOT NULL,
    `tableName`    varchar(255) NOT NULL,
    `accessLevel`  tinyint(3) unsigned NOT NULL,
    `maxRecords`   int(10) unsigned default NULL,
    `randomSaveId` varchar(255) NOT NULL
  ) ENGINE=MyISAM DEFAULT CHARSET=utf8;";
  mysql_query($query) || die("Error creating new access table.<br/>\n MySQL error was: ". htmlencode(mysql_error()) . "\n");

  // create accessList field
  if (!@$accountsSchema['accessList']) {
    $accountsSchema['accessList'] = array('type' => 'accessList', 'label' => "Section Access", 'isSystemField' => '1', 'order' => 20);
    createMissingSchemaTablesAndFields(); // create missing fields
    clearAlertsAndNotices(); // don't show "created table/field" alerts
  }

  // drop tableAccessList
  if (@$accountsSchema['tableAccessList']) {
    unset($accountsSchema['tableAccessList']);
    saveSchema('accounts', $accountsSchema);
  }

  ### upgrade access levels
  $schemaTables = getSchemaTables();
  $schemaTables[] = "all";
  $result = mysql_query("SELECT * FROM `{$TABLE_PREFIX}accounts`") or die("MySQL Error: ". htmlencode(mysql_error()) ."\n");
  while ($record = mysql_fetch_assoc($result)) {
    if(!array_key_exists('tableAccessList', $record)) { die(__FUNCTION__ . ": Couldn't load field 'tableAccessList'!"); }

    // convert section access to new format
    $tableNames = array();
    $tableNames['all'] = 1; // default all to "By Section" access
    foreach ($schemaTables as $tableName) {
      $adminAccess = preg_match("/\b$tableName\b/i", $record['tableAccessList']);
      if ($adminAccess) { $tableNames[$tableName] = '9'; }
    }

    // foreach table - add to insert query
    $insertRows   = '';
    $fieldNames   = "userNum, tableName, accessLevel, maxRecords, randomSaveId";
    $foundAll     = false;
    foreach ($tableNames as $tableName => $accessLevel) {
      if ($insertRows) { $insertRows .= ",\n"; }
      $escapedUserNum   = mysql_escape( $record['num'] );
      $escapedTableName = mysql_escape( $tableName );
      $maxRecords       = "NULL";
      $escapedSaveId    = mysql_escape( uniqid('', true) );
      $insertRows  .= "('$escapedUserNum', '$escapedTableName', '$accessLevel', $maxRecords, '$escapedSaveId')";
    }

    // add all
    $insertQuery  = "INSERT INTO `{$TABLE_PREFIX}_accesslist` ($fieldNames) VALUES $insertRows;";

    // insert new access rights
    if ($insertRows) {
      mysql_query($insertQuery) or die("MySQL Error Inserting New Access Rights: ". htmlencode(mysql_error()) . "\n");
    }
  }

  // drop tableAccessList
  $query = "ALTER TABLE `{$TABLE_PREFIX}accounts` DROP COLUMN `tableAccessList`;";
  mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");

}

//
function _upgradeToVersion1_08() {
  global $SETTINGS, $APP;
  if ($SETTINGS['programVersion'] >= '1.08') { return; }

  ### re-encode all ini files (store "\n" as '\n', \ as \\, and " as \q)

  // settings
  $SETTINGS = parse_ini_file(SETTINGS_FILEPATH, true); // load without decoding
  saveSettings(); // save (automatically encodes)

  // schema files
  $schemaDir = DATA_DIR . '/schema';
  foreach (getSchemaTables($schemaDir) as $tableName) {
    $schemaPath = "$schemaDir/$tableName.ini.php";
    $schema     = parse_ini_file($schemaPath, true); // load without decoding
    saveSchema($tableName, $schema, $schemaDir);
  }

  // schema presets
  $presetDir = DATA_DIR . '/schemaPresets';
  foreach (getSchemaTables($presetDir) as $tableName) {
    $presetPath = "$presetDir/$tableName.ini.php";
    $schema     = parse_ini_file($presetPath, true); // load without decoding
    saveSchema($tableName, $schema, $presetDir);
  }

  saveAndRefresh('1.08');
}

//
function _upgradeToVersion1_07() {
  global $SETTINGS, $APP;
  if ($SETTINGS['programVersion'] >= '1.07') { return; }

  // rename schema fields
  foreach (getSchemaTables() as $tableName) {
    $schema = loadSchema($tableName);
    foreach (array_keys($schema) as $fieldname) {
       $fieldSchema = &$schema[$fieldname];
      if (!is_array($fieldSchema)) { continue; }  // fields are stored as arrays, other entries are table metadata, skip metadata

      if (@$fieldSchema['type'] == 'list') {
        // add 'optionsType'
        if (!@$fieldSchema['optionsType']) { $fieldSchema['optionsType'] = 'text'; }

        // rename 'listOptions' to 'optionsText'
        if (array_key_exists('listOptions', $fieldSchema)) {
          $fieldSchema['optionsText'] = $fieldSchema['listOptions'];
          unset($fieldSchema['listOptions']);
        }
      }

    }
    saveSchema($tableName, $schema);
  }

  createMissingSchemaTablesAndFields(); // create missing fields
  clearAlertsAndNotices(); // don't show "created table/field" alerts

  saveAndRefresh('1.07');

}

//
function _upgradeToVersion1_06() {
  global $SETTINGS, $APP;
  if ($SETTINGS['programVersion'] >= '1.06') { return; }

  // change schema key 'checkboxDescription' to 'description'
  foreach (getSchemaTables() as $tableName) {
    $schema = loadSchema($tableName);
    foreach (array_keys($schema) as $fieldname) {
      $fieldSchema = &$schema[$fieldname];
      if (!is_array($fieldSchema)) { continue; }  // fields are stored as arrays, other entries are table metadata, skip metadata

      // rename attribute
      if (array_key_exists('checkboxDescription', $fieldSchema)) {
        $fieldSchema['description'] = $fieldSchema['checkboxDescription'];
        unset($fieldSchema['checkboxDescription']);
      }

      // set allowUploads to off for existing WYSIWYG fields
      if (@$fieldSchema['type'] == 'wysiwyg') {
         if (!array_key_exists('allowUploads', $fieldSchema))    { $fieldSchema['allowUploads']    = '0'; }
      }

    }
    saveSchema($tableName, $schema);
  }

  saveAndRefresh('1.06');
}

//
function _upgradeToVersion1_04() {
  global $SETTINGS, $APP;
  if ($SETTINGS['programVersion'] >= '1.04') { return; }

  // update schema files with new upload fields (checkboxes)
  foreach (getSchemaTables() as $tableName) {
    $schema = loadSchema($tableName);
    foreach (array_keys($schema) as $fieldname) {
      $fieldSchema = &$schema[$fieldname];
      if (@$fieldSchema['type'] != 'upload') { continue; }  // skip all but upload fields

      // add fields
      if (!array_key_exists('checkMaxUploadSize', $fieldSchema))    { $fieldSchema['checkMaxUploadSize']    = !empty($fieldSchema['maxUploadSizeKB']); }
      if (!array_key_exists('checkMaxUploads', $fieldSchema))       { $fieldSchema['checkMaxUploads']       = '1'; }
      if (!array_key_exists('resizeOversizedImages', $fieldSchema)) { $fieldSchema['resizeOversizedImages'] = $fieldSchema['maxImageHeight'] && $fieldSchema['maxImageWidth']; }
      if (!array_key_exists('createThumbnails', $fieldSchema))      { $fieldSchema['createThumbnails']      = $fieldSchema['maxThumbnailHeight'] && $fieldSchema['maxThumbnailWidth']; }
      if (!array_key_exists('customUploadDir', $fieldSchema))       { $fieldSchema['customUploadDir']       = ''; }
      if (!array_key_exists('customUploadUrl', $fieldSchema))       { $fieldSchema['customUploadUrl']       = ''; }
      if (!array_key_exists('infoField1', $fieldSchema))            { $fieldSchema['infoField1']            = ''; }
      if (!array_key_exists('infoField2', $fieldSchema))            { $fieldSchema['infoField2']            = ''; }
      if (!array_key_exists('infoField3', $fieldSchema))            { $fieldSchema['infoField3']            = ''; }
      if (!array_key_exists('infoField4', $fieldSchema))            { $fieldSchema['infoField4']            = ''; }
      if (!array_key_exists('infoField5', $fieldSchema))            { $fieldSchema['infoField5']            = ''; }
    }
    saveSchema($tableName, $schema);
  }

  saveAndRefresh('1.04');
}

//
function saveAndRefresh($version) {
  global $SETTINGS, $APP;

  // save settings
  $SETTINGS['programVersion'] = $version;
  saveSettings();

  print "Software updated to v$version<br/>\n";
  print '<meta http-equiv="refresh" content="1" />';
  exit;
}


//
function _upgradeSettings() {
  global $SETTINGS, $APP;

  // NOTE: These are now set in _init_loadSettings()

  // save INI (do this once when upgrading to make sure any new settings are saved)
  saveSettings();
}

//
function _upgradeAccounts() {

  // add new upload fields
  $schema = loadSchema('accounts');

  // make schema and menu visible
  if (@$schema['tableHidden'])       { $schema['tableHidden'] = 0; }
  if (@$schema['menuHidden'])        { $schema['menuHidden']  = 0; }

  // add new fields
  if (!@$schema['createdDate'])      { $schema['createdDate']      = array('type' => 'none', 'label' => "Created", 'isSystemField' => '1'); }
  if (!@$schema['createdByUserNum']) { $schema['createdByUserNum'] = array('type' => 'none', 'label' => "Created By", 'isSystemField' => '1'); }
  if (!@$schema['updatedDate'])      { $schema['updatedDate']      = array('type' => 'none', 'label' => "Last Updated", 'isSystemField' => '1'); }
  if (!@$schema['updatedByUserNum']) { $schema['updatedByUserNum'] = array('type' => 'none', 'label' => "Last Updated By", 'isSystemField' => '1'); }
  if (!@$schema['accessList'])       { $schema['accessList']       = array('type' => 'accessList', 'label' => "Section Access", 'isSystemField' => '1', 'order' => time()); }
  if (!@$schema['lastLoginDate'])    { // added in v2.08
    $schema['lastLoginDate'] = array('type' => 'date', 'label' => "Last Login", 'defaultDate' => 'none', 'order' => time(),
                                     'showTime' => '1', 'use24HourFormat' => '0', 'showSeconds' => '1', 'yearRangeStart' => '2010', 'yearRangeEnd' => '2020');
  }

  // remove fields
  foreach (array_keys($schema) as $fieldname) {
    $fieldSchema = &$schema[$fieldname];
    if (!is_array($fieldSchema)) { continue; }  // fields are stored as arrays, other entries are table metadata, skip metadata

    // remove old "show tablenames" field for old access settings
    if (@$fieldSchema['type'] == 'separator' && preg_match("/listTableNames\(\)'>MySQL Tablenames/", @$fieldSchema['separatorHTML'])) {
      unset($schema[$fieldname]);
    }
  }

  ### update order
  // increase field order for all fields
  foreach (array_keys($schema) as $fieldname) {
    $fieldSchema = &$schema[$fieldname];
    if (!is_array($fieldSchema)) { continue; }  // fields are stored as arrays, other entries are table metadata, skip metadata
    $fieldSchema['order'] += 10;
  }

  // hard code field order
  if (@$schema['num'])              { $schema['num']['order']              = '1';  }
  if (@$schema['createdDate'])      { $schema['createdDate']['order']      = '2';  }
  if (@$schema['createdByUserNum']) { $schema['createdByUserNum']['order'] = '3';  }
  if (@$schema['updatedDate'])      { $schema['updatedDate']['order']      = '4';  }
  if (@$schema['updatedByUserNum']) { $schema['updatedByUserNum']['order'] = '5';  }

  ### change fields

  // Set checked/unchecked values for 'isAdmin' field
  if (@$schema['isAdmin']) {
    if (@$schema['isAdmin']['checkedValue'] == '')   { $schema['isAdmin']['checkedValue']   = 'Yes'; }
    if (@$schema['isAdmin']['uncheckedValue'] == '') { $schema['isAdmin']['uncheckedValue'] = '-'; }
    $schema['isAdmin']['adminOnly'] = "2";
  }

  // Set accessList to be a system field
  if (@$schema['accessList']) { $schema['accessList']['isSystemField'] = 1; }

  // v1.32 - add "My Account" fields
  $myAccountFields = array('fullname','username','email','password');
  foreach ($myAccountFields as $field) {
    if (!is_array(@$schema[$field])) { continue; }
    if (array_key_exists('myAccountField', $schema[$field])) { continue; } // ignore if already set
    $schema[$field]['myAccountField'] = 1;
  }


  // save changes
  saveSchema('accounts', $schema);       // add to schema
  createMissingSchemaTablesAndFields(); // add to database
  clearAlertsAndNotices(); // don't show "created table/field" alerts
}

//
function _removeOldCacheFiles() {

  // remove old tinymce cache files (to ensure any new tinymce changes are used)
  $cacheFiles = scandir_recursive(DATA_DIR, '|/tiny_mce_|', 0);  // cache files have been called both tiny_mce_cache_* and tiny_mce_*
  foreach ($cacheFiles as $filepath) { unlink($filepath); }

}

//
function _notifyUpgradeComplete() {
  global $APP;
  notice("Software upgraded to v{$APP['version']}<br/>\n");

  # notifications about old files when upgrading
  $oldFilepaths = array(
    '/css/ui.css',
    '/css/ui_ie6.css',
    '/css/wysiwyg.css',
    '/images/',
    '/tinymce3/',
    '/lib/plugins/',
    '/lib/menus/accounts/',
    '/tinyMCE/',
  );
  $filepathsToRemove = '';
  foreach ($oldFilepaths as $oldFilepath) {
    if (file_exists(SCRIPT_DIR . $oldFilepath)) {
      $filepathsToRemove .= "- $oldFilepath<br />\n";
    }
  }
  if ($filepathsToRemove) {
    notice("Optional Upgrade Step - Remove these old files:<br />\n$filepathsToRemove");
  }
}

?>
