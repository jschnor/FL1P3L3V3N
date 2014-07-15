<?php


// Escape special characters in the mysql queries to prevent SQL injection attacks.
// Doesn't require a database connection like mysql_real_escape string.  The
// following characters are escaped: \x00, \r, \n, \, `, ', ", and \x1a
// ***NOTE*** MySQL values must be wrapped in quotes to be secure: fieldname = "$escapedValue"
function mysql_escape($string, $escapeLikeWildcards = false) {
  // Note that even though this function isn't character-set aware it's a safe alternative
  // to mysql_real_escape string() so long as ascii or utf8 charsets are used (which we use).
  // NOTE: Extended comments are available below function in C-V-S copy.

  $escaped = strtr($string, array(
    "\x00" => '\0',
    "\n"   => '\n',
    "\r"   => '\r',
    '\\'   => '\\\\',
    '`'    => "\`",
    "'"    => "\'",
    '"'    => '\"',
    "\x1a" => '\Z'
  ));

  //
  if ($escapeLikeWildcards) { // added in 2.60
    $escaped = addcslashes($escaped, '%_');
  }
  
  //
  return $escaped;
}

//
function mysql_escapeLikeWildcards($string) { 
  return addcslashes($string, '%_');
}



// Automatically espaces and quotes input values and inserts them into query, kind of like mysqli_prepare()
// Example: mysql_escapef("num = ? AND name = ?", $num, $name),
function mysql_escapef() {
  $args         = func_get_args();
  $queryFormat  = array_shift($args);
  $replacements = $args;

  // make replacements
  $escapedQuery = '';
  $queryParts   = explode('?', $queryFormat);
  foreach ($queryParts as $part) {
    $escapedQuery .= $part;
    if ($part == end($queryParts)) { continue; } // don't add escaped value on end of query
    $escapedQuery .= "'" . mysql_escape( array_shift($replacements) ) . "'";
  }

  //
  return $escapedQuery;
}

//
function mysqlStrictMode($strictMode) {
  $currentVersion  = preg_replace("/[^0-9\.]/", '', mysql_get_server_info());
  $isMySql5        = version_compare($currentVersion, '5.0.0', '>=');

  # only for Mysql 5
  if (!$isMySql5) { return; }

  # set MySQL strict mode - http://dev.mysql.com/doc/refman/5.0/en/server-sql-mode.html
  if ($strictMode) {
    $query = "SET SESSION sql_mode = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER'";
    mysql_query($query) or die("MySQL Error: " .mysql_error(). "\n");
  }
  else {
    $query = "SET SESSION sql_mode = 'NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER'";
    mysql_query($query) or die("MySQL Error: " .mysql_error(). "\n");
  }
}

//
function setMySqlTimezone($returnError = false) {
  global $SETTINGS;
  $tzOffsetSeconds = date("Z");

  // ignore offsets greater than 12 hours (illegal offset)
  if (abs($tzOffsetSeconds) > 12*60*60) { return; }

  // set mysql timezone
  $offsetString = convertSecondsToTimezoneOffset($tzOffsetSeconds);
  $query        = "SET time_zone = '$offsetString';";
  if (!mysql_query($query)) {
    $error = "MySQL Error: " .mysql_error(). "\n";
    if ($returnError) { return $error; }
    else              { die($error); }
  }
}

// Generate LIMIT clause for paging
function mysql_limit($perPage, $pageNum) {
  $limit   = '';
  $perPage = (int) $perPage;
  $pageNum = (int) $pageNum;

  //
  if ($pageNum == 0) { $pageNum = 1; }

  //
  if ($perPage) {
    $limit  = "LIMIT $perPage OFFSET " . ($pageNum-1) * $perPage;
  }

  //
  return $limit;
}

//
function mysql_count($tableName, $whereEtc = 'TRUE') {
  if (!$tableName) { die(__FUNCTION__ . ": No tableName specified!"); }
  $tableNameWithPrefix = getTableNameWithPrefix($tableName);
  $escapedTableName    = mysql_escape( $tableNameWithPrefix );

  //
  if (!$whereEtc) { $whereEtc = 'TRUE'; } // old function took where as optional argument so '' would return all
  if (is_array($whereEtc)) { $whereEtc = mysql_where($whereEtc); }
  $query =  "SELECT COUNT(*) FROM `$escapedTableName` WHERE $whereEtc";

  $result = @mysql_query($query) or dieAsCaller(__FUNCTION__ . "() MySQL Error: ". htmlencode(mysql_error()) . "\n");
  list($recordCount) = mysql_fetch_row($result);
  if (is_resource($result)) { mysql_free_result($result); }

  //
  return intval($recordCount); // v2.52 intval added
}


//
function mysql_select_found_rows() {
  $result = mysql_query('SELECT FOUND_ROWS()') or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  $count  = mysql_result($result, 0);
  if (is_resource($result)) { mysql_free_result($result); }

  return $count;
}

// Wait up to $timeout seconds to get a lock and then return 0 or 1
// Docs: http://dev.mysql.com/doc/refman/4.1/en/miscellaneous-functions.html#function_get-lock
function mysql_get_lock($lockName, $timeout = 0) {
  $query    = mysql_escapef("SELECT GET_LOCK(?, ?)", $lockName, $timeout);
  $result   = mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  $isLocked = mysql_result($result, 0);
  if (is_resource($result)) { mysql_free_result($result); }

  return $isLocked;
}

// Release a previously held lock
// Docs: http://dev.mysql.com/doc/refman/4.1/en/miscellaneous-functions.html#function_release-lock
function mysql_release_lock($lockName) {
  $query      = mysql_escapef("SELECT RELEASE_LOCK(?)", $lockName);
  $result     = mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  $isReleased = mysql_result($result, 0);
  if (is_resource($result)) { mysql_free_result($result); }

  return $isReleased;
}

// Format time in MySQL datetime format (default to current server time)
function mysql_datetime($timestamp = null) {
  if ($timestamp === null) { $timestamp = time(); }
  return date('Y-m-d H:i:s', $timestamp); // MySQL format: YYYY-MM-DD HH:MM:SS
}

// return comma separated list of escaped values for construction WHERE ... IN('val1','val2','val3') queries
// if array is empty $defaultValue or 0 is returned so the query will always be value (and not ... IN() which is invalid)
// Usage: $where = "myfield IN (" .mysql_escapeCSV($values). ")";
function mysql_escapeCSV($valuesArray, $defaultValue = '0') {

  // get CSV values
  $csv = '';
  foreach ($valuesArray as $value) { $csv .= "'" .mysql_escape($value) ."',"; }
  $csv = chop($csv, ',');

  // set default
  if ($csv == '') { $csv = "'" .mysql_escape($defaultValue) ."'"; } // v2.50 quote default value to valid unexpected results comparing a number (0) with a string

  //
  return $csv;
}

// return first matching record or FALSE
// $record = mysql_get($tableName, 123);                   // get first record where: num = 123
// $record = mysql_get($tableName, null, "name = 'test'"); // get first record where: name = 'test'
// $record = mysql_get($tableName, 123,  "name = 'test'"); // get first record where: num = 123 AND name = 'test'
function mysql_get($tableName, $recordNum, $customWhere = null) {
  if ($recordNum && preg_match("/[^0-9]/", strval($recordNum))) { die(__FUNCTION__ . ": second argument must be numeric or null, not '" .htmlencode(strval($recordNum)). "'!"); }

  $fullTableName = getTableNameWithPrefix($tableName);
  $where         = _mysql_getWhereFromNumAndCustomWhere($recordNum, $customWhere);
  $query         = "SELECT * FROM `$fullTableName` WHERE $where LIMIT 1";
  $record        = mysql_get_query($query);

  // add _tableName key to record
  if ($record) { $record['_tableName'] = $tableName; }

  return $record;
}


// shortcut functions for mysql_fetch
function &mysql_get_query($query, $indexedArray = false) {
  $result   = @mysql_query($query) or dieAsCaller("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  $firstRow = $indexedArray ? mysql_fetch_row($result) : mysql_fetch_assoc($result);
  if (is_resource($result)) { mysql_free_result($result); }
  return $firstRow;
}

// return array of matching records.  Where can contain LIMIT and other SQL
// $records = mysql_select($tableName, "createdByUserNum = '1'");
// $records = mysql_select($tableName, "createdByUserNum = '1' LIMIT 10");
// $records = mysql_select($tableName); // get all records
function mysql_select($tableName, $whereEtc = 'TRUE') {
  if (is_array($whereEtc)) { $whereEtc = mysql_where($whereEtc); }
  $fullTableName  = getTableNameWithPrefix($tableName);
  $query          = "SELECT * FROM `$fullTableName` WHERE $whereEtc";
  $records        = mysql_select_query($query);

  // add _tableName key to records
  foreach ($records as $key => $record) { $records[$key]['_tableName'] = $tableName; }

  return $records;
}

// shortcut functions for mysql_fetch
function &mysql_select_query($query, $indexedArray = false) {
  $result = mysql_query($query) or dieAsCaller("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  $rows   = array();
  if   (!$indexedArray) { while ($row = mysql_fetch_assoc($result)) { $rows[] = $row; } }
  else                  { while ($row = mysql_fetch_row($result))   { $rows[] = $row; } }
  if (is_resource($result)) { mysql_free_result($result); }
  return $rows;
}

// erase matching records
// mysql_delete($tableName, 123);                            // erase records where: num = 123
// mysql_delete($tableName, null, "createdByUserNum = '1'"); // erase records where: createdByUserNum = '1'
// mysql_delete($tableName, 123,  "createdByUserNum = '1'"); // erase records where: num = 123 AND createdByUserNum = '1'
// Note: For safety either recordnum or a where needs to be specified to delete ALL records.  No recordNum and no where does nothing
function mysql_delete($tableName, $recordNum, $customWhere = null) {
  if ($recordNum && preg_match("/[^0-9]/", strval($recordNum))) { die(__FUNCTION__ . ": second argument must be numeric or null, not '" .htmlencode(strval($recordNum)). "'!"); }
  $tableName  = getTableNameWithPrefix($tableName);
  $where      = _mysql_getWhereFromNumAndCustomWhere($recordNum, $customWhere);
  $delete     = "DELETE FROM `$tableName` WHERE $where";
  mysql_query($delete) or dieAsCaller("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  return mysql_affected_rows(); // added in 2.13
}


// update matching records
// mysql_update($tableName, $recordNum, null,                     array('set' => '1234'));
// mysql_update($tableName, null,       "createdByUserNum = '1'", array('set' => '1234'));
// mysql_update($tableName, $recordNum, "createdByUserNum = '1'", array('set' => '1234', 'updatedDate=' => 'NOW()'));
function mysql_update($tableName, $recordNum, $customWhere, $columnsToValues) {
  $tableName  = getTableNameWithPrefix($tableName);
  $where      = _mysql_getWhereFromNumAndCustomWhere($recordNum, $customWhere);
  $set        = mysql_getMysqlSetValues($columnsToValues);
  $update     = "UPDATE `$tableName` SET $set WHERE $where";
  mysql_query($update) or dieAsCaller("MySQL Error: ". mysql_error(). "\n");
}


// insert a record
// $newRecordNum = mysql_insert($tableName, $colsToValues);
// $newRecordNum = mysql_insert($tableName, array('name' => 'asdf', 'createdDate=' => 'NOW()'));
// v2.16 - added $tempDisableMysqlStrictMode option
function mysql_insert($tableName, $colsToValues, $tempDisableMysqlStrictMode = false) {

  //
  $tableName = getTableNameWithPrefix($tableName);
  $set       = mysql_getMysqlSetValues($colsToValues);
  $insert    = "INSERT INTO `$tableName` SET $set";

  //
  if ($tempDisableMysqlStrictMode) { mysqlStrictMode(false); }
  mysql_query($insert) or dieAsCaller("MySQL Error: ". mysql_error(). "\n");
  $recordNum = mysql_insert_id();
  if ($tempDisableMysqlStrictMode) { mysqlStrictMode(true); }

  return $recordNum;
}


// $where = _mysql_getWhereFromNumAndCustomWhere($recordNum, $customWhere);
// v2.50 - $recordNum now accepts zero "0" and doesn't treat it as undefined
function _mysql_getWhereFromNumAndCustomWhere($recordNum, $customWhere) {
  if (is_array($customWhere)) { $customWhere = mysql_where($customWhere); }
  $where      = '';
  if ($recordNum != '') { $where .= "`num` = " .intval($recordNum); }
  if ($customWhere)     { $where .= ($where) ? " AND ($customWhere)" : $customWhere; }
  if ($where == '')     { $where  = 'FALSE'; } // match nothing if no where specified
  return $where;
}


//
function mysql_getMysqlSetValues($columnsToValues) {
  $mysqlSet = '';

  if (is_array($columnsToValues)) {
    foreach ($columnsToValues as $column => $value) {
      list($column, $dontEscapeValue) = extractSuffixChar($column, '=');

      if (!preg_match('/^(\w+)$/', $column)) { die(__FUNCTION__. ": Invalid column name '" .htmlencode($column). "'!"); } // error checking: whitelist column chars to prevent sql injection

      if ($dontEscapeValue) { $mysqlSet .= "`$column` = $value, "; }
      else                  { $mysqlSet .= "`$column` = '" . mysql_escape($value) . "', "; }
    }
  }

  //
  $mysqlSet = chop($mysqlSet, ', ');

  return $mysqlSet;
}

// convenience function for turning an array into a WHERE clause
function mysql_where($criteriaArray = null, $extraWhere = 'TRUE') {
  $where = '';
  if ($criteriaArray) {
    foreach ($criteriaArray as $fieldName => $value) {
      if (!preg_match('/^(\w+)$/', $fieldName)) { die(__FUNCTION__. ": Invalid column name '" .htmlencode($fieldName). "'!"); } // error checking: whitelist column chars to prevent sql injection
      $where .= mysql_escapef("`$fieldName` = ? AND ", $value);
    }
  }
  $where .= $extraWhere;
  return $where;
}


function ___mysql_getRecords() { die("IN DEVELOPMENT"); }
/*
// mysql_getRecords() is getRecords() with a more developer-friendly API
//   $matches is an array('field' => 'value') which automatically builds a WHERE clause
//   $options are the same as getRecords() accepts, but many defaults are overridden unless you set array('asViewer' => true)
function mysql_getRecords($tableName, $where = null, $options = null) {
  $options = coalesce($options, array());

  // set tableName
  $options['tableName'] = $tableName;

  // merge in defaults unless 'asViewer' is set
  $getRecordsDefaults = array(
    'allowSearch'       => false,
    'loadUploads'       => false,
    'loadCreatedBy'     => false,
    'loadListDetails'   => false,
    'ignoreHidden'      => true,
    'ignorePublishDate' => true,
    'ignoreRemoveDate'  => true,
  );
  if (!@$options['asViewer']) { $options = array_merge($getRecordsDefaults, $options); }

  // parse 'matches' into WHERE clause
  if (is_array($where)) {
    $where = mysql_where($where);
  }
  $options['where'] = $where;

  // call getRecords()
  list($rows, $listDetails, $schema) = getRecords($options);
  return $rows;
}

*/

//eof