<?php
  global $tableName, $schema, $escapedTableName, $isMyAccountMenu;

  // Check if old record exists and load it
  $query        = mysql_escapef("SELECT * FROM `$escapedTableName` WHERE num = ? LIMIT 1", @$_REQUEST['num']);
  $oldRecord    = mysql_get_query($query);
  $recordExists = $oldRecord;
  $isNewRecord  = !$oldRecord;

  //
  doAction('record_presave', $tableName, $isNewRecord, $oldRecord);

  //
  $mySqlColsAndTypes = getMySqlColsAndType($escapedTableName);
  $newRecordValues   = _getRecordValuesFromFormInput();

  ### error checking
  $inputErrors    = '';
  $maxRecordError = $recordExists ? '' : showMaxRecordsError('returnText');
  if     ($maxRecordError)                              { $inputErrors = $maxRecordError; }
  elseif (@$schema['_disableAdd']    && !$recordExists) { $inputErrors = t('Adding records has been disabled for this section!') . "\n"; }
  elseif (@$schema['_disableModify'] && $recordExists)  { $inputErrors = t('Modifying records has been disabled for this section!') . "\n"; }
  else                                                  { $inputErrors = _getInputValidationErrors($mySqlColsAndTypes, $newRecordValues); }
  if ($inputErrors) { die($inputErrors); }  // displayed by ajax form submitter

  if (!$_REQUEST['num'] && !$_REQUEST['preSaveTempId']) { die("No value set for 'preSaveTempId'!"); }
  if ($isMyAccountMenu && $isNewRecord) { die("Record doesn't exist! My Account menu can't create new records."); }

  doAction('record_save_errorchecking', $tableName, $recordExists, $oldRecord);
  doAction('record_save_posterrorchecking', $tableName, $recordExists, $oldRecord);


  ### insert blank record if needed
  if ($isNewRecord) {
    // insert blank record
    mysqlStrictMode(false); // disable strict mode so we don't get errors for not specifying field values
    mysql_query("INSERT INTO `$escapedTableName` () VALUES()"); # or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
    $last_insert_id = mysql_insert_id(); // NOTE: This must come RIGHT after query or it won't work
    mysqlStrictMode(true);

    // get record number
    $_REQUEST['num'] = $last_insert_id;

    // adopt uploads
    if ($_REQUEST['preSaveTempId']) { adoptUploads($tableName, $_REQUEST['preSaveTempId'], $last_insert_id); }
  }

  ### update record
  $updateColumnValues = _getColsToValuesForSQLSet($mySqlColsAndTypes, $newRecordValues, $isNewRecord);
  if ($updateColumnValues) {
    $updateQuery = "UPDATE `$escapedTableName` SET $updateColumnValues WHERE num = '".mysql_escape($_REQUEST['num'])."'";
    $result      = @mysql_query($updateQuery);

    // if error
    if (!$result) {
      $error = "MySQL Error: ". mysql_error() . "\n"; // htmlencode() not needed here as message is shown in javascript alert

      // remove last inserted record
      if (isset($last_insert_id)) {
        mysql_query("DELETE FROM `$escapedTableName` WHERE num = '".mysql_escape($last_insert_id)."'");
      }

      // show error message
      die($error);
    }
  }

  // My Account - update session login details
  if ($isMyAccountMenu) {
    $username     = @$_REQUEST['username'] ? $_REQUEST['username']                    : $CURRENT_USER['username'];
    $passwordHash = getPasswordDigest(coalesce(@$_REQUEST['password'], $CURRENT_USER['password']));
    loginCookie_set($username, $passwordHash);
  }

  // User Accounts - update access levels
  if (@$_REQUEST['accessList'] && @$schema['accessList']['type'] == 'accessList') {
    _updateAccessList();
  }

  // Category Sections - update category meta data
  if ($schema['menuType'] == 'category') { updateCategoryMetadata(); }

  doAction('record_postsave', $tableName, $isNewRecord, $oldRecord, $_REQUEST['num']);

  ### redisplay list page
  print $_REQUEST['num'];

  exit; // print record number or nothing to redisplay list page (done in edit_functions.js by ajax form submit code)



//
function _getInputValidationErrors($mySqlColsAndTypes, $newRecordValues) {
  global $schema, $tableName, $escapedTableName, $CURRENT_USER, $isMyAccountMenu;
  $errors    = '';
  $recordNum = @$_REQUEST['num'];

  // load schema columns
  foreach ($schema as $fieldname => $fieldSchema) {
    if (!is_array($fieldSchema)) { continue; } // fields are stored as arrays, other entries are table metadata
    if (!userHasFieldAccess($fieldSchema)) { continue; }                      // skip fields that the user has no access to
    if ($tableName == 'accounts' && $fieldname == 'isAdmin' && !$CURRENT_USER['isAdmin']) { continue; } // skip admin only fields
    if ($isMyAccountMenu && @!$fieldSchema['myAccountField']) { continue; }                             // skip validation on fields that aren't displayed
    $isMyAccountPasswordField = $isMyAccountMenu && $fieldname == 'password';

    $value       = @$newRecordValues[$fieldname];
    $labelOrName = (@$fieldSchema['label'] != '') ? $fieldSchema['label'] : $fieldname;

    // date fields - check if required suffixes are missing
    $missingDateSubfields = 0;
    $partialDateEntered   = false;
    if (@$fieldSchema['type'] == 'date') {
      $requiredDateSuffixes = array('mon','day','year');
      if ($fieldSchema['showTime']) {
        if ($fieldSchema['use24HourFormat']) { array_push($requiredDateSuffixes, 'hour24', 'min'); }
        else                                 { array_push($requiredDateSuffixes, 'hour12', 'min','isPM'); }
        if ($fieldSchema['showSeconds'])     { array_push($requiredDateSuffixes, 'sec'); }
      }

      $subFieldCount = 0;
      foreach ($requiredDateSuffixes as $suffix) {
        if (@$_REQUEST["$fieldname:$suffix"] == '') { $missingDateSubfields++;  }
      }

      $partialDateEntered = $missingDateSubfields && count($requiredDateSuffixes) > $missingDateSubfields; // if some but not all date subfields entered then require all of them
    }



    // check required fields
    $checkRequired = (@$fieldSchema['isRequired'] && !$isMyAccountPasswordField) || $partialDateEntered;
    if ($checkRequired) {

      if ($fieldSchema['type'] == 'upload') {
        if (!getUploadCount($tableName, $fieldname, @$_REQUEST['num'], @$_REQUEST['preSaveTempId'])) {
          $errors .= sprintf(t("'%s' is required! You must upload a file!"), $labelOrName) . "\n";
        }
      }

      elseif ($fieldSchema['type'] == 'date') {
        if     ($partialDateEntered)   { $errors .= sprintf(t("Please fill out all '%s' fields!"), $labelOrName). "\n"; }
        elseif ($missingDateSubfields) { $errors .= sprintf(t("'%s' is required!"), $labelOrName). "\n"; }
      }

      elseif ($value == '')  {
        $errors .= sprintf(t("'%s' is required!"), $labelOrName) . "\n";
      }
    }

    // check for unique fields
    if (@$fieldSchema['isUnique'] && $value != '') {  // unique allows blank fields (use required to require value)
      $errors .= __getUniqueFieldErrors($labelOrName, $fieldname, $value, $recordNum);
    }

    // get length of content
    if (@$fieldSchema['type'] == 'wysiwyg') {
      $textOnlyValue = strip_tags($value);
      $textOnlyValue = preg_replace('/\s+/', ' ', $textOnlyValue);
      $textLength    = strlen($textOnlyValue);
    }
    elseif (@$fieldSchema['type'] == 'textbox' && @$fieldSchema['autoFormat']) {
      $textOnlyValue = str_replace("<br/>\n","\n",$value);
      $textLength = strlen($textOnlyValue);
    }
    else {
      $textLength = strlen($value);
    }

    // check min/max length of content
    if ($value != '' && @$fieldSchema['minLength'] && $textLength < $fieldSchema['minLength']) {
      $errors .= sprintf(t('\'%1$s\' must be at least %2$s characters! (currently %3$s characters)'), $labelOrName, $fieldSchema['minLength'], $textLength) . "\n";
    }
    if ($value != '' && @$fieldSchema['maxLength'] && $textLength > $fieldSchema['maxLength']) {
      $errors .= sprintf(t('\'%1$s\' cannot be longer than %2$s characters! (currently %3$s characters)'), $labelOrName, $fieldSchema['maxLength'], $textLength) . "\n";
    }

    // check allowed/disallowed characters (skip if $fieldSchema['charset'] is blank to avoid: "Warning: preg_match(): Compilation failed: missing terminating ]")
    if (strlen(@$fieldSchema['charset']) > 0) {
      $allowRegexp    = '/[^' .preg_quote(@$fieldSchema['charset'], '/'). ']/';
      $disallowRegexp = '/[' .preg_quote(@$fieldSchema['charset'], '/'). ']/';
      if (@$fieldSchema['charsetRule'] == 'allow' && preg_match($allowRegexp, $value)) {
        $errors .= sprintf(t('\'%1$s\' only allows the following characters (%2$s)'), $labelOrName, $fieldSchema['charset']) . "\n";
      }
      if (@$fieldSchema['charsetRule'] == 'disallow' && preg_match($disallowRegexp, $value)) {
        $errors .= sprintf(t('\'%1$s\' doesn\'t allow the following characters (%2$s)'), $labelOrName, $fieldSchema['charset']) . "\n";
      }
    }

    // custom field error checking
    if (@$schema['menuType'] == 'category' && $fieldname == 'parentNum') {

      // load parent category
      $escapedNum = mysql_escape($value);
      $query = "SELECT num, name, lineage FROM `$escapedTableName` WHERE num = '$escapedNum' LIMIT 1";
      $result = mysql_query($query) or die("MySQL Error: " .mysql_error(). "\n");
      $parentCategory = mysql_fetch_assoc($result);
      if (is_resource($result)) { mysql_free_result($result); }

      // error checking
      if (preg_match("/:$recordNum:/", $parentCategory['lineage'])) {
        $errors .= sprintf(t('\'%s\' can\'t select the current category or any categories under the current category!'), $labelOrName) . "\n";
      }
    }

    // my account - password changing
    $newPasswordEntered = @$_REQUEST['password:old'] || @$_REQUEST['password'] || @$_REQUEST['password:again'];
    if ($isMyAccountPasswordField && $newPasswordEntered && !$errors) {
      $_REQUEST['password:old'] = preg_replace("/^\s+|\s+$/s", '', @$_REQUEST['password:old']); // v2.52 remove leading and trailing whitespace
      $oldPasswordHash          = getPasswordDigest(@$_REQUEST['password:old']);

      if      (!@$_REQUEST['password:old'])                                      { $errors .= t("Please specify your current password!") . "\n"; }
      else if ($oldPasswordHash != getPasswordDigest($CURRENT_USER['password'])) { $errors .= t("Current password is not correct!") . "\n"; } // v2.51 works when comparing hashed and unhashed passwords the same
      $errors .= getNewPasswordErrors(@$_REQUEST['password'], @$_REQUEST['password:again'], $CURRENT_USER['username']); // v2.52
    }

    // accounts - password changing (usually done by admin) v2.52
    if ($tableName == 'accounts' && $fieldname == 'password' && !$errors) {
      $errors .= getNewPasswordErrors(@$_REQUEST['password'], null, @$newRecordValues['username']); // v2.52
    }

  }

  //
  return $errors;
}


// check fields that require "unique" values
function __getUniqueFieldErrors($fieldLabel, $fieldName, $fieldValue, $recordNum) {
  global $escapedTableName, $tableName;
  $error = '';

  // check if value already in use
  $where         = "`$fieldName` = '".mysql_escape($fieldValue)."'";
  if ($recordNum) { $where .= " AND num != '".mysql_escape($recordNum)."'"; } # ignore records existing value (which might be the same)
  $count = mysql_count($tableName, $where);
  if ($count > 0) {
    $error = sprintf(t("'%s' value must be unique. The selected value is already in use!"), $fieldLabel) . "\n";
  }

  //
  return $error;
}


//
function _getColsToValuesForSQLSet($mySqlColsAndTypes, $newRecordValues, $listAllColsForInsert = false) {
  global $schema, $tableName, $isSingleMenu, $SETTINGS;
  $currentDate  = date("Y-m-d H:i:s"); // set default to required Format: YYYY-MM-DD HH:MM:SS
  $colsToValues = array();

  // get form submited values
  foreach ($newRecordValues as $colName => $newValue) {
    $colsToValues[$colName] = $newValue;
  }

  // add default values for undefined fields (FOR INSERT ONLY)
  if ($listAllColsForInsert) {
    $colsToValues = _addUndefinedDefaultsToNewRecord($colsToValues, $mySqlColsAndTypes);
  }

  // set special field values
  if (array_key_exists('updatedDate', $mySqlColsAndTypes))      { $colsToValues['updatedDate']      = $currentDate; }
  if (array_key_exists('updatedByUserNum', $mySqlColsAndTypes)) { $colsToValues['updatedByUserNum'] = $GLOBALS['CURRENT_USER']['num']; }

  // hash passwords if needed
  if ($SETTINGS['advanced']['encryptPasswords'] && $tableName == 'accounts' && @$colsToValues['password']) {
    $colsToValues['password'] = getPasswordDigest(@$_REQUEST['password']);
  }

  // allow admin to change createdByUserNum
  if (@$GLOBALS['hasEditorAccess'] && @$_REQUEST['createdByUserNum']) { $colsToValues['createdByUserNum'] = $_REQUEST['createdByUserNum']; }

  ### get colsToValues string
  $colsToValuesString = '';
  foreach ($colsToValues as $colName => $value) {
    if ($colName == "num" and !$value) { continue; } // skip num with value of 0

    // save blank int column values as null
    $columnType  = @$mySqlColsAndTypes[$colName];
    $fieldType   = @$schema[$colName]['type'];
    $isIntColumn = preg_match("/^(tinyint|smallint|mediumint|int|bigint|float)/i", $columnType);
    if ($value == '' && $isIntColumn && $fieldType != 'checkbox') {
      $colsToValuesString .= "`$colName` = NULL, ";
    }

    // all other fields
    else {
      $colsToValuesString .= "`$colName` = '".mysql_escape($value)."', ";
    }

  }
  $colsToValuesString = rtrim($colsToValuesString, ", ");

  //
  return $colsToValuesString;
}


//
function _updateAccessList() {
  global $TABLE_PREFIX;

  // error checking
  if (!@$_REQUEST['accessList']) { die(__FUNCTION__ . ": No accessList specified!"); }

  // get user num
  $userNum = @$_REQUEST['num'];
  if (!$userNum) {
    $result = mysql_query("SELECT LAST_INSERT_ID();") or die("MySQL Error: ". mysql_error() . "\n");
    $userNum = mysql_result($result, 0);
    if (is_resource($result)) { mysql_free_result($result); }
  }
  if (!$userNum) { die(__FUNCTION__ . ": Couldn't get user number!"); }

  // create random save id
  $randomSaveId = uniqid('', true);

  // create insert query
  $fieldNames   = "userNum, tableName, accessLevel, maxRecords, randomSaveId";
  $userNum      = (int) $userNum; // force to int for security
  $insertRows   = '';
  foreach ($_REQUEST['accessList'] as $tableName => $tableValues) {
    if ($tableName != 'all' && $_REQUEST['accessList']['all']['accessLevel'] != '1') { continue; } // don't save section access unless "bySection" is specified for all
    if ($_REQUEST['accessList']['all']['accessLevel'] == '0') { continue; } // skip sections with no access allowed
    if ($insertRows) { $insertRows .= ",\n"; }
    $maxRecords = @$tableValues['maxRecords'] != '' ? "'".mysql_escape($tableValues['maxRecords'])."'" : 'NULL';
    $insertRows .= "('$userNum','" . mysql_escape($tableName) ."','". mysql_escape($tableValues['accessLevel']) .
                   "',$maxRecords,'" . mysql_escape($randomSaveId) . "')";
  }
  $insertQuery  = "INSERT INTO `{$TABLE_PREFIX}_accesslist` ($fieldNames) VALUES $insertRows;";

  // insert new access rights
  if ($insertRows) {
    mysql_query($insertQuery) or die("MySQL Error Inserting New Access Rights: ". mysql_error() . "\n");
  }

  // delete old access rights
  $deleteQuery = "DELETE FROM `{$TABLE_PREFIX}_accesslist` WHERE userNum = '$userNum' AND randomSaveId != '" . mysql_escape($randomSaveId) . "'";
  mysql_query($deleteQuery) or die("MySQL Error Deleting Old Access Rights: ". mysql_error() . "\n");
}


?>
