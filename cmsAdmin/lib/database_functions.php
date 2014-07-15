<?php

//
function connectIfNeeded() {
  if (@$GLOBALS['DBH']) { return; }
  connectToMySQL();
}

//
function connectToMySQL($returnErrors = false) {
  global $SETTINGS, $DBH;

  ### Get connection details
  $hostname       = getFirstDefinedValue(@$SETTINGS["mysql:{$_SERVER['HTTP_HOST']}"]['hostname'], $SETTINGS['mysql']['hostname']);
  $username       = getFirstDefinedValue(@$SETTINGS["mysql:{$_SERVER['HTTP_HOST']}"]['username'], $SETTINGS['mysql']['username']);
  $password       = getFirstDefinedValue(@$SETTINGS["mysql:{$_SERVER['HTTP_HOST']}"]['password'], $SETTINGS['mysql']['password']);
  $database       = getFirstDefinedValue(@$SETTINGS["mysql:{$_SERVER['HTTP_HOST']}"]['database'], $SETTINGS['mysql']['database']);
  $textOnlyErrors = coalesce(inCLI(), @$SETTINGS["mysql:{$_SERVER['HTTP_HOST']}"]['textOnlyErrors'], $SETTINGS['mysql']['textOnlyErrors']);

  ##  SLOW REMOTE CONNECTION
  ##  If you are connecting to a remote database that is intolerably slow, try
  ##  updating the mysql configuration file (often "/etc/my.cfg") by adding the
  ##  following option to the [mysqld] section:
  ##
  ##     skip-name-resolve
  ##
  ##  Here is the MySQL documentation for this option:
  ##
  ##    --skip-name-resolve
  ##    Do not resolve host names when checking client connections. Use only IP addresses.
  ##    If you use this option, all Host column values in the grant tables must be IP addresses or localhost.

  ### Connect to database
  $DBH = @mysql_connect($hostname, $username, $password);
  if (!$DBH) {
    $connectionError = mysql_error();
    if     ($returnErrors)   { return "Error connecting to MySQL:<br/>\n$connectionError"; }
    elseif ($textOnlyErrors) { die("Error connecting to MySQL: $connectionError"); }
    else                     {
      $libDir = pathinfo(__FILE__, PATHINFO_DIRNAME); // viewers may be in different dirs
      include("$libDir/menus/dbConnectionError.php");
    };
    exit();
  }


  // select db
  $isDbSelected = mysql_select_db($database);
  if (!$isDbSelected) {
    mysql_query("CREATE DATABASE `$database`") or die("MySQL Error: ". mysql_error(). "\n");
    mysql_select_db($database) or die("MySQL Error: ". mysql_error(). "\n");
  }


  ### check for required mysql version
  $currentVersion  = preg_replace("/[^0-9\.]/", '', mysql_get_server_info());
  if (version_compare(REQUIRED_MYSQL_VERSION, $currentVersion, '>')) {
    $error  = "This program requires MySQL v" .REQUIRED_MYSQL_VERSION. " or newer. This server has v$currentVersion installed.<br/>\n";
    $error .= "Please ask your server administrator to install MySQL v" .REQUIRED_MYSQL_VERSION. " or newer.<br/>\n";
    if ($returnErrors) { return $error; }
    die($error);
  }

  ### Set Character Set
  # note: set through PHP 'set_charset' function so mysql_real_escape string() knows what charset to use. setting the charset
  # ... through mysql queries with 'set names' didn't cause mysql_client_encoding() to return a different value
  mysql_set_charset("utf8") or die("Error loading character set utf8: " .mysql_error(). '');

  # set MySQL strict mode - http://dev.mysql.com/doc/refman/5.0/en/server-sql-mode.html
  mysqlStrictMode(true);

  # set MySQL timezone offset
  setMySqlTimezone();

  //
  return '';
}




//
function createMissingSchemaTablesAndFields() {
  global $APP, $TABLE_PREFIX;

  $schemaTables = getSchemaTables();
  $mysqlTables  = getMysqlTablesWithPrefix();

  // create missing schema tables in mysql
  foreach ($schemaTables as $tableName) {

    // create mysql table
    $mysqlTableName = $TABLE_PREFIX . $tableName;
    if (!in_array($mysqlTableName, $mysqlTables)) {
      notice(t("Creating MySQL table for schema table: ").$tableName."<br/>\n");
      $result = mysql_query("CREATE TABLE `".mysql_escape($mysqlTableName)."` (num int(10) unsigned NOT NULL auto_increment, PRIMARY KEY (num)) ENGINE=MyISAM DEFAULT CHARSET=utf8;");
      if (!$result) { alert(sprintf("Error creating MySQL table: %s<br/>\MySQL error was: ",$mysqlTableName).htmlencode(mysql_error()) . "\n"); }
      if (is_resource($result)) { mysql_free_result($result); }

      // run defaultSqlData if applicable
      $defaultSqlFile = DATA_DIR . "/schema/$tableName.defaultSqlData.php";
      if (file_exists($defaultSqlFile)) {
        restoreDatabase($defaultSqlFile, $tableName);
        notice(t("Importing default data for schema table: ").$tableName."<br/>\n");
      }
    }


    // get schema fieldnames
    $schemaFieldnames = array();
    $tableSchema = loadSchema($tableName);
    foreach ($tableSchema as $name => $valueOrArray) {
      if (is_array($valueOrArray)) { array_push($schemaFieldnames, $name); } // only fields has arrays as values
    }

    // get mysql fieldnames
    $mysqlFieldnames = array();
    $result = mysql_query("SHOW COLUMNS FROM `".mysql_escape($mysqlTableName)."`") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
    while ($row = mysql_fetch_assoc($result)) { array_push($mysqlFieldnames, strtolower($row['Field'])); }
    if (is_resource($result)) { mysql_free_result($result); }

    // add missing fieldnames to mysql
    $addFieldSQL = '';
    foreach ($schemaFieldnames as $fieldname) {
      if (!in_array(strtolower($fieldname), $mysqlFieldnames)) {
        $columnType = getColumnTypeFor($fieldname, @$tableSchema[$fieldname]['type'], @$tableSchema[$fieldname]['customColumnType']);
        if (!$columnType) { continue; }
        if ($addFieldSQL) { $addFieldSQL .= ", "; }
        $addFieldSQL .= " ADD COLUMN `".mysql_escape($fieldname)."` $columnType";
        
        // add index?
        if (@$tableSchema[$fieldname]['indexed']) {
          list($indexName, $indexColList) = getIndexNameAndColumnListForField($fieldname, $columnType);
          $addFieldSQL .= ", ADD INDEX `$indexName` $indexColList";
        }
      }
    }
    if ($addFieldSQL) {
      mysql_query("ALTER TABLE `".mysql_escape($mysqlTableName)."` $addFieldSQL") or die("Error adding fields to '$mysqlTableName', the error was:\n\n". htmlencode(mysql_error()));
      notice(t("Adding MySQL fields for schema table:")." $tableName<br/>\n");
    }
  }
}

// list($indexName, $indexColList) = getIndexNameAndColumnListForField($fieldName, $columnType);
// generate an indexName and "index column clause" for use by CREATE INDEX or DROP INDEX
function getIndexNameAndColumnListForField($fieldName, $columnType) {
  
  // determine if the column type is a string type (we must supply a key length for BLOB/TEXT, we must not for non-string types)
  $stringTypes = array(
    'CHAR', 'VARCHAR', 'BINARY', 'VARBINARY', 'TINYBLOB', 'BLOB', 'MEDIUMBLOB',
    'LONGBLOB', 'TINYTEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'ENUM', 'SET'
  ); 
  preg_match('/(\w+)/', $columnType, $matches);
  $firstWordInColumnType = @$matches[1];
  $isStringType          = in_array(strtoupper($firstWordInColumnType), $stringTypes);
  
  
  // get index prefix length for strings
  $keyLength = ''; 
  if ($isStringType) { // To speed up ORDER BY on text fields the index prefix length must be as long as the field
    if     (preg_match('/^[\w\s*]+\((\d+)\)/', $columnType, $matches) ) { $keyLength = min(@$matches[1], 255); }
    else                                                                { $keyLength = 16; }
    if ($keyLength) { $keyLength = "($keyLength)"; }
  }
  
  // construct return values: $indexName and $indexColList
  $indexName    = "_auto_".mysql_escape($fieldName);
  $indexColList = "(".mysql_escape($fieldName)."$keyLength)";
  return array($indexName, $indexColList);
}

// create schema from sourcefile (if schema doesn't already exist) and display notices about new schema
function createSchemaFromFile($sourcePath) {
  $schemaFile = basename($sourcePath);
  $targetPath = realpath(DATA_DIR . '/schema') . '/' . $schemaFile;

  static $order;
  if (!$order) { $order = time(); }
  $order++; // add schema sequentially, even if adding them in the same second.

  // copy schema file
  if (file_exists($targetPath)) { return; }
  @copy($sourcePath, $targetPath) or die(t("Error copying schema file!").$php_errormsg);

  // update schema file
  list($tableName) = explode('.', $schemaFile);
  $schema = loadSchema($tableName);
  $schema['menuOrder'] = $order; // sort new schema to the bottom
  saveSchema($tableName, $schema);

  // display message and create tables
  createMissingSchemaTablesAndFields();  // create mysql tables

}

//
function getSortedSchemas() {

  $schemas = array();
  foreach (getSchemaTables() as $tableName) {
    $schemas[$tableName] = loadSchema($tableName);
  }
  uasort($schemas, '_sortMenusByOrder');

  return $schemas;
}

function _sortMenusByOrder($fieldA, $fieldB) {

  // sort field meta data below sorted by "order" value
  $orderA = array_key_exists('menuOrder', $fieldA) ? $fieldA['menuOrder'] : 1000000000;
  $orderB = array_key_exists('menuOrder', $fieldB) ? $fieldB['menuOrder'] : 1000000000;
  if ($orderA < $orderB) { return -1; }
  if ($orderA > $orderB) { return 1; }
  return 0;
}

// $schemaTables = getSchemaTables();
// $schemaTables = getSchemaTables(DATA_DIR.'/schemaPresets/');
function getSchemaTables($dir = '') {

  if (!$dir) { $dir = realpath(DATA_DIR . '/schema/'); }

  // get schema files
  $schemaTables = array();
  foreach (scandir($dir) as $file) {
    if (!preg_match("/([^.]+)\.ini\.php$/", $file, $matches)) { continue; } // skip non-schema files
    $tableName = $matches[1];
    $schemaTables[] = $tableName;
  }

  return $schemaTables;
}


// $schemaFields = getSchemaFields($tablename);
// foreach ($schemaFields as $fieldname => $fieldSchema) {
// $fieldnames = array_keys( getSchemaFields($tablename) );
function &getSchemaFields($tableNameOrSchema) {

  // load schema
  $schema = $tableNameOrSchema;
  if (!is_array($schema)) { $schema = loadSchema($tableNameOrSchema); }

  // load fields
  $fieldList = array();
  foreach ($schema as $name => $valueOrArray) {
    if (is_array($valueOrArray)) {  // only fields have arrays as values, other values are table metadata
      $fieldList[$name]               = $valueOrArray;
      $fieldList[$name]['name']       = $name;                 // add pseudo-field for fieldname
      $fieldList[$name]['_tableName'] = $schema['_tableName']; // add pseudo-field for _tableName
    }
  }

  //
  return $fieldList;
}

// $schema = loadSchema($tableName);
function loadSchema($tableName, $schemaDir = '') {
  global $APP;

  // error checking
  if (!$tableName)                                       { die(__FUNCTION__ . ": no tableName specified!"); }
  if (preg_match('/[^a-zA-Z0-9\-\_\(\)]+/', $tableName)) { die(__FUNCTION__ . ": tableName '" .htmlencode($tableName). "' contains invalid characters!"); }

  // get schemapath
  $tableNameWithoutPrefix = getTableNameWithoutPrefix($tableName);
  if (!$schemaDir) { $schemaFilepath = DATA_DIR . "/schema/$tableNameWithoutPrefix.ini.php"; }
  else             { $schemaFilepath = "$schemaDir/". getTableNameWithoutPrefix($tableName) . ".ini.php"; }

  // load schema
  $schema = array();
  if (file_exists($schemaFilepath)) {
    $schema = loadStructOrINI($schemaFilepath);
  }

  // add _tableName (v2.16+)
  if ($schema) {
    $schema['_tableName'] = $tableNameWithoutPrefix;
  }

  //
  return $schema;
}


// save schema, sorting entries by field order
function saveSchema($tableName, $schema, $schemaDir = '') {
  global $APP;

  // error checking
  if (!$tableName) { die(__FUNCTION__ . ": no tableName specified!"); }

  // get schema filepath
  $tableNameWithoutPrefix = getTableNameWithoutPrefix($tableName);
  if (!$schemaDir) { $schemaFilepath = DATA_DIR . "/schema/$tableNameWithoutPrefix.ini.php"; }
  else             { $schemaFilepath = "$schemaDir/$tableNameWithoutPrefix.ini.php"; }


  // sort schema
  $metaData = array();
  $fields   = array();
  foreach ($schema as $name => $value) {
    if (is_array($value)) { $fields[$name]   = $value; }
    else                  { $metaData[$name] = $value; }
  }
  ksort($metaData);
  uasort($fields, '__sortSchemaFieldsByOrder'); // sort schema keys
  $schema = $metaData + $fields;

  // add _tableName (v2.16+)
  if ($schema) { // we need to do this in saveSchema as well as load in case the table was renamed (we want to save the new tablename value)
    $schema['_tableName'] = $tableNameWithoutPrefix;
  }

  // save schema
  saveStruct($schemaFilepath, $schema);

  // debug: save in old format - uncomment, click "Save Details" under Section Editors for the table you want, then re-comment
  //saveINI($schemaFilepath, $schema, true); die("saved in old format: $schemaFilepath");
}


// sort field list by order key, eg: uasort($schema, '__sortSchemaFieldsByOrder');
function __sortSchemaFieldsByOrder($fieldA, $fieldB) {

  // mixed metadata/fields - sort metadata keys up, field arrays down
  if (!is_array($fieldA)) { return -1; }
  if (!is_array($fieldB)) { return 1; }

  // sort field meta data below sorted by "order" value
  $orderA = array_key_exists('order', $fieldA) ? $fieldA['order'] : 1000000000;
  $orderB = array_key_exists('order', $fieldB) ? $fieldB['order'] : 1000000000;
  if ($orderA < $orderB) { return -1; }
  if ($orderA > $orderB) { return 1; }
  return 0;
}


//
function getTableNameWithoutPrefix($tableName) {  // add $TABLE_PREFIX to table if it isn't there already
  $regexp = "/^" .preg_quote($GLOBALS['TABLE_PREFIX']). '/';
  return preg_replace($regexp, '', $tableName); // remove prefix
}


//
function getTableNameWithPrefix($tableName) { // add $TABLE_PREFIX to table if it isn't there already
  return $GLOBALS['TABLE_PREFIX'] . getTableNameWithoutPrefix($tableName);
}


//
function getColumnTypeFor($fieldName, $fieldType, $customColumnType = '') {
  $columnType = '';

  // special case: default column type specified
  if      ($customColumnType)        { $columnType = $customColumnType; }

  // Special Fieldnames
  elseif  ($fieldName == 'num')              { $columnType = 'int(10) unsigned NOT NULL auto_increment'; }
  elseif  ($fieldName == 'createdDate')      { $columnType = 'datetime NOT NULL'; }
  elseif  ($fieldName == 'createdByUserNum') { $columnType = 'int(10) unsigned NOT NULL'; }
  elseif  ($fieldName == 'updatedDate')      { $columnType = 'datetime NOT NULL'; }
  elseif  ($fieldName == 'updatedByUserNum') { $columnType = 'int(10) unsigned NOT NULL'; }
  elseif  ($fieldName == 'dragSortOrder')    { $columnType = 'int(10) unsigned NOT NULL'; }
  // NOTE:  Other special field types don't need to be specified here because they have required
  //        ... field types in /lib/menus/default/editField_functions.php that map to the column
  //        ... types below.  We only need to specify the column types above because they are
  //        ... not available with any predefined field type.

  // otherwise return columnType for fieldType
  elseif ($fieldType == '')               { $columnType = ''; }
  elseif ($fieldType == 'none')           { $columnType = ''; }
  elseif ($fieldType == 'textfield')      { $columnType = 'mediumtext'; }
  elseif ($fieldType == 'textbox')        { $columnType = 'mediumtext'; }
  elseif ($fieldType == 'wysiwyg')        { $columnType = 'mediumtext'; }
  elseif ($fieldType == 'date')           { $columnType = 'datetime NOT NULL'; }
  elseif ($fieldType == 'list')           { $columnType = 'mediumtext'; }
  elseif ($fieldType == 'checkbox')       { $columnType = 'tinyint(1) unsigned NOT NULL'; }
  elseif ($fieldType == 'upload')         { $columnType = ''; }
  elseif ($fieldType == 'separator')      { $columnType = ''; }
  elseif ($fieldType == 'relatedRecords') { $columnType = ''; }

  // special fields types
  elseif ($fieldType == 'accessList')   { $columnType = ''; }
  elseif ($fieldType == 'dateCalendar') { $columnType = ''; }

  else {
    die(__FUNCTION__ . ": Field '" .htmlencode($fieldName). "' has unknown fieldType '" .htmlencode($fieldType). "'.");
  }

  return $columnType;
}


//
function getMysqlTablesWithPrefix() {
  global $TABLE_PREFIX;

  $tableNames = array();
  $escapedTablePrefix = mysql_escape($TABLE_PREFIX);
  $escapedTablePrefix = preg_replace("/([_%])/", '\\\$1', $escapedTablePrefix);  // escape mysql wildcard chars
  $result    = mysql_query("SHOW TABLES LIKE '$escapedTablePrefix%'") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  while ($row = mysql_fetch_row($result)) {
    array_push($tableNames, $row[0]);
  }
  if (is_resource($result)) { mysql_free_result($result); }

  return $tableNames;
}

// get mysql column names/types
function getMySqlColsAndType($escapedTableName) {

  $columns = array();
  $result  = mysql_query("SHOW COLUMNS FROM `$escapedTableName`") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  while ($row = mysql_fetch_assoc($result)) {
    $columns[ $row['Field'] ] = $row['Type'];
  }
  if (is_resource($result)) { mysql_free_result($result); }

  return $columns;
}

//
function getMysqlColumnType($tableName, $fieldname) {
  if ($fieldname == '') { return ''; }

  $escapedTableName = mysql_escape($tableName);
  $escapedFieldName = mysql_escape($fieldname);
  $escapedFieldName = preg_replace("/([_%])/", '\\\$1', $escapedFieldName); // escape mysql wildcard chars
  $result           = mysql_query("SHOW COLUMNS FROM `$escapedTableName` LIKE '$escapedFieldName'") or die("MySQL Error: ". htmlencode(mysql_error()) ."\n");
  $row              = mysql_fetch_assoc($result);
  if (is_resource($result)) { mysql_free_result($result); }

  $columnType       = $row['Type'];
  if ($row['Type'] && $row['Null'] != 'YES') { $columnType .= " NOT NULL"; }
  if ($row['Extra'])                         { $columnType .= " {$row['Extra']}"; }

  return $columnType;
}


//
function getTablenameErrors($tablename) {

  // get used tablenames
  static $usedTableNamesLc = array();
  static $loadedTables;
  if (!$loadedTables++) {
    foreach (getMysqlTablesWithPrefix() as $usedTablename) {
      $withoutPrefixLc = strtolower(getTablenameWithoutPrefix($usedTablename));
      array_push($usedTableNamesLc, $withoutPrefixLc);
    }
    foreach (getSchemaTables() as $usedTableName) {
      $withoutPrefixLc = strtolower($usedTablename);
      array_push($usedTableNamesLc, $withoutPrefixLc);
    }
  }


  // get reserved tablenames
  $reservedTableNamesLc = array();
  array_push($reservedTableNamesLc, 'home', 'admin', 'database', 'accounts', 'license'); // the are hard coded menu names
  array_push($reservedTableNamesLc, 'default');  // can't be used because menu folder exists with default menu files
  array_push($reservedTableNamesLc, 'all');      // can't be used because the "all" keyword gives access to all menus in user accounts

  // get error
  $error       = null;
  $tablenameLc = strtolower(getTableNameWithoutPrefix($tablename));
  if      ($tablenameLc == '')                          { $error = "No table name specified!\n"; }
  else if (!preg_match("/^[a-z]/", $tablenameLc))       { $error = "Table name must start with a letter!\n"; }
  else if (preg_match("/[A-Z]/", $tablename))           { $error = "Table name must be lowercase!\n"; }
  else if (preg_match("/[^a-z0-9\-\_]/", $tablename))   { $error = "Table name can only contain these characters (\"a-z, 0-9, - and _\")!\n"; }
  if (in_array($tablenameLc, $usedTableNamesLc))        { $error = "That table name is already in use, please choose another.\n"; }
  if (in_array($tablenameLc, $reservedTableNamesLc))    { $error = "That table name is not allowed, please choose another.\n"; }
  //
  return $error;
}


// foreach (getListOptions('tableName', 'fieldName') as $value => $label):
function getListOptions($tablename, $fieldname, $useCache = false) {

  $valuesToLabels = array();

  $schema       = loadSchema($tablename);
  $fieldSchema  = $schema[$fieldname];
  $fieldOptions = getListOptionsFromSchema($fieldSchema, null, $useCache);
  foreach ($fieldOptions as $valueAndLabel) {
    list($value, $label) = $valueAndLabel;
    $valuesToLabels[$value] = $label;
  }

  return $valuesToLabels;
}


//
function getListOptionsFromSchema($fieldSchema, $record=null, $useCache=false, $listValues=null) {
  global $TABLE_PREFIX;

  $listOptions     = array();
  $optionsType     = @$fieldSchema['optionsType'];

  // get list values to lookup
  $listValuesAsCSV = '';
  if ($listValues) {
    foreach ($listValues as $value) { $listValuesAsCSV .= "'" .mysql_escape($value). "',"; }
    $listValuesAsCSV = chop($listValuesAsCSV, ','); // remove trailing comma
  }

  ### parse text options
  if ($optionsType == 'text') { // parse
    $optionText = explode("\n", @$fieldSchema['optionsText']);

    foreach ($optionText as $optionString) {
      if (preg_match("/(^|[^\|])(\|\|)*(\|)(?!\|)/", $optionString, $match, PREG_OFFSET_CAPTURE)) {
        $delimiterOffset = $match[3][1];
        $value = substr($optionString, 0, $delimiterOffset);
        $label = substr($optionString, $delimiterOffset+1);
      }
      else {
        $value = $optionString;
        $label = $optionString;
      }

      $value = str_replace("||", "|", $value);
      $label = str_replace("||", "|", $label);

      // remove trailing whitespace
      $value = rtrim($value);
      $label = rtrim($label);

      $listOptions[] = array($value, $label);
    }
  }

  ### lookup table values
  else {
    $cacheTable = '';

    // create query
    if ($optionsType == 'table') {
      $valueField   = @$fieldSchema['optionsValueField'];
      $labelField   = @$fieldSchema['optionsLabelField'];
      $selectTable  = $TABLE_PREFIX . $fieldSchema['optionsTablename'];
      $tableSchema  = loadSchema($fieldSchema['optionsTablename']);
      $where        = $listValuesAsCSV               ? "WHERE `$valueField` IN ($listValuesAsCSV)" : '';
      $orderBy      = @$tableSchema['listPageOrder'] ? "ORDER BY {$tableSchema['listPageOrder']}"  : '';
      $query        = "SELECT `$valueField`, `$labelField` FROM `$selectTable` $where $orderBy LIMIT 0, 999";
      $cacheTable   = $fieldSchema['optionsTablename'];
    }
    else if ($optionsType == 'query') {
      $filterFieldValue                = @$record[ @$fieldSchema['filterField'] ];
      $GLOBALS['ESCAPED_FILTER_VALUE'] = mysql_escape($filterFieldValue);
      $query                           = getEvalOutput($fieldSchema['optionsQuery']);

      if (preg_match("/\bFROM\s+(\S+)/", $query, $matches)) {
        $cacheTable = $matches[1];
        $cacheTable = preg_replace("/\W/", '', $cacheTable); // remove ` quotes, etc
      }
    }
    else { die("Unknown optionsType '$optionsType'!"); }

    // load cache module
    if ($useCache && $cacheTable) {
      $libDir = dirname(__FILE__);
      if (file_exists("$libDir/viewer_turboCache.php")) { require_once "$libDir/viewer_turboCache.php"; }

      // load cached result
      if (!function_exists('turboCache_load')) { die("Error: 'useCaching' enabled but no caching plugin found!<br/>Either disable 'useCaching' or install caching plugin."); }

      $listOptions = turboCache_load($cacheTable, $query);
      if ($listOptions) {
        return $listOptions;
      }
    }

    // execute query
    $result = @mysql_query($query);
    if (!$result) {
      $error  = "There was an error creating the list field '" .@$fieldSchema['name']. "'.\n\n";
      $error .= "MySQL Error: " .mysql_error(). "\n\n";
      header("Content-type: text/plain");
      die($error);
    }
    while ($row = mysql_fetch_row($result)) {
      $value = $row[0];
      $label = array_key_exists(1, $row) ? $row[1] : $value; // use value if no label specified
      $listOptions[] = array($value,$label);
    }
    if (is_resource($result)) { mysql_free_result($result); }

    // save to cache
    if ($useCache && $cacheTable) {
      turboCache_save($cacheTable, $query, $listOptions);
    }
  }

  //
  return $listOptions;
}

// return MySQL WHERE clause for google style query: +word -word "multi word phrase"
// ... function always returns a value (or 1) so output can be AND'ed to existing WHERE
// $where = getWhereForKeywords($keywordString, $fieldnames);
// list($where, $andTerms, $notTerms) = getWhereForKeywords($keywordString, $fieldnames, true);
function getWhereForKeywords($keywordString, $fieldnames, $wantArray = false) {
  if (!is_array($fieldnames)) { die(__FUNCTION__ . ": fieldnames must be an array!"); }

  // parse out "quoted strings"
  $searchTerms = array();
  $quotedStringRegexp = "/([+-]?)(['\"])(.*?)\\2/";
  preg_match_all($quotedStringRegexp, $keywordString, $matches, PREG_SET_ORDER);
  foreach ($matches as $match) {
    list(,$plusOrMinus,,$phrase) = $match;
    $phrase = trim($phrase);
    $searchTerms[$phrase] = $plusOrMinus;
  }
  $keywordString = preg_replace($quotedStringRegexp, '', $keywordString); // remove quoted strings

  // parse out keywords
  $keywords = preg_split('/[\\s,;]+/', $keywordString);
  foreach ($keywords as $keyword) {
    $plusOrMinus = '';
    if (preg_match("/^([+-])/", $keyword, $matches)) {
      $keyword = preg_replace("/^([+-])/", '', $keyword, 1);
      $plusOrMinus = $matches[1];
    }

    $searchTerms[$keyword] = $plusOrMinus;
  }

  // create query
  $where = '';
  $conditions = array();
  $andTerms   = array();
  $notTerms   = array();
  foreach ($searchTerms as $term => $plusOrMinus) {
    if ($term == '') { continue; }

    $likeOrNotLike  = ($plusOrMinus == '-') ? "NOT LIKE" : "LIKE";
    $andOrOr        = ($plusOrMinus == '-') ? " AND " : " OR ";
    $termConditions = array();

    if ($plusOrMinus == '-') { $notTerms[] = $term; }
    else                     { $andTerms[] = $term; }

    foreach ($fieldnames as $fieldname) {
      $fieldname = trim($fieldname);
      $escapedKeyword = mysql_escape($term, true);
      $termConditions[] = "`" .mysql_escape($fieldname). "` $likeOrNotLike '%$escapedKeyword%'";
    }

    if ($termConditions) {
      $conditions[] = "(" . join($andOrOr, $termConditions) . ")\n";
    }

  }

  //
  $where = join(" AND ", $conditions);
  if (!$where) { $where = 1; }

  //
  if ($wantArray) { return array($where, $andTerms, $notTerms); }
  else            { return $where; }
}

// leave tablename blank for all tables
function backupDatabase($filenameOrPath = '', $selectedTable = '') {
  global $TABLE_PREFIX;
  $prefixPlaceholder = '#TABLE_PREFIX#_';

  set_time_limit(60*5);  // v2.51 - allow up to 5 minutes to backup/restore database
  session_write_close(); // v2.51 - End the current session and store session data so locked session data doesn't prevent concurrent access to CMS by user while backup in progress

  // error checking
  if ($selectedTable != '') {
    $schemaTables = getSchemaTables();
    if (preg_match("/[^\w\d\-\.]/", $selectedTable)) { die(__FUNCTION__ ." : \$selectedTable contains invalid chars! " . htmlencode($selectedTable)); }
    if (!in_array($selectedTable, $schemaTables)) { die("Unknown table selected '" .htmlencode($selectedTable). "'!"); }
  }

  // open backup file
  $hostname         = preg_replace('/[^\w\d\-\.]/', '', @$_SERVER['HTTP_HOST']);
  if (!$filenameOrPath) {
    $filenameOrPath  = "$hostname-v{$GLOBALS['APP']['version']}-".date('Ymd-His');
    if ($selectedTable) { $filenameOrPath .= "-$selectedTable"; }
    $filenameOrPath .= ".sql.php";
  }
  $outputFilepath = isAbsolutePath($filenameOrPath) ? $filenameOrPath : DATA_DIR."/backups/$filenameOrPath"; // v2.60 if only filename provided, use /data/backup/ as the basedir 
  $fp         = @fopen($outputFilepath, 'x');
  if (!$fp) { return false; }  // file already exists - avoid race condition

  // create no execute php header
  fwrite($fp, "-- <?php die('This is not a program file.'); exit; ?>\n\n");  # prevent file from being executed

  // get tablenames to backup
  if ($selectedTable) {
    $tablenames = array( getTableNameWithPrefix($selectedTable) );
  }
  else {
    $skippedTables = array('_cron_log', '_outgoing_mail'); // don't backup these table names
    $skippedTables = applyFilters('backupDatabase_skippedTables', $skippedTables);  // let users skip tables via plugins
    $skippedTables = array_map('getTableNameWithPrefix', $skippedTables);           // add table_prefix to all table names (if needed)
    $allTables     = getMysqlTablesWithPrefix();
    $tablenames    = array_diff($allTables, $skippedTables);                        // remove skipped tables from list
  }

  // backup database
  foreach ($tablenames as $unescapedTablename) {
    $escapedTablename        = mysql_escape($unescapedTablename);
    $tablenameWithFakePrefix = $prefixPlaceholder . getTableNameWithoutPrefix($escapedTablename);

    // create table
    fwrite($fp, "\n--\n");
    fwrite($fp, "-- Table structure for table `$tablenameWithFakePrefix`\n");
    fwrite($fp, "--\n\n");

    fwrite($fp, "DROP TABLE IF EXISTS `$tablenameWithFakePrefix`;\n\n");

    $result = mysql_query("SHOW CREATE TABLE `$escapedTablename`");
    list(,$createStatement) = mysql_fetch_row($result) or die("MySQL Error: ".htmlencode(mysql_error()));
    $createStatement = str_replace("TABLE `$TABLE_PREFIX", "TABLE `$prefixPlaceholder", $createStatement);
    fwrite($fp, "$createStatement;\n\n");
    if (is_resource($result)) { mysql_free_result($result); }

    // create rows
    fwrite($fp, "\n--\n");
    fwrite($fp, "-- Dumping data for table `$tablenameWithFakePrefix`\n");
    fwrite($fp, "--\n\n");

    $result = mysql_query("SELECT * FROM `$escapedTablename`") or die("MySQL Error: ".htmlencode(mysql_error()));
    while ($row = mysql_fetch_row($result)) {
      $values = '';
      foreach ($row as $value) {
        if (is_null($value)) { $values .= 'NULL,'; }
        else                 { $values .= '"' .mysql_real_escape_string($value). '",'; }
      }
      $values = chop($values, ','); // remove trailing comma

      fwrite($fp, "INSERT INTO `$tablenameWithFakePrefix` VALUES($values);\n");
    }
    if (is_resource($result)) { mysql_free_result($result); }
  }

  //
  fwrite($fp, "\n");
  $result = fwrite($fp, "-- Dump completed on " .date('Y-m-d H:i:s O'). "\n\n");
  if ($result === false) { die(__FUNCTION__ . ": Error writing backup file! $php_errormsg"); }
  fclose($fp) || die(__FUNCTION__ . ": Error closing backup file! $php_errormsg");

  //
  return $outputFilepath;
}

// $backupFiles = getBackupFiles_asArray();
function getBackupFiles_asArray() {
  $backupDir   = DATA_DIR .'/backups';
  $allFiles    = scandir($backupDir);
  $backupFiles = array();
  foreach ($allFiles as $filename) {
    if (!preg_match("/\.sql(\.php)?$/", $filename)) { continue; }
    $backupFiles[] = $filename;
  }

  return $backupFiles;
}

//
function getBackupFiles_asOptions($defaultValue = '') {

  //
  $backupFiles = getBackupFiles_asArray();

  // sort recently modified files first
  array_multisort(
    // @ for: Strict Standards: Only variables should be passed by reference
    @array_map(create_function('$x', 'return filemtime(DATA_DIR."/backups/".$x);'), $backupFiles), SORT_DESC,
    $backupFiles
  );

  //
  if (!$backupFiles) { $labelsToValues = array(t('There are no backups available') => ''); }
  else               {
                        $labelsToValues = array(t('Select version to restore')      => '');
                        $labelsToValues = $labelsToValues + array_combine($backupFiles, $backupFiles);
                     }

  //
  $values      = array_values($labelsToValues);
  $labels      = array_keys($labelsToValues);
  $htmlOptions = getSelectOptions($defaultValue, $values, $labels, false);

  //
  return $htmlOptions;
}

//
function restoreDatabase($filepath, $tablename = '') {
  global $TABLE_PREFIX;
  $prefixPlaceholder = '#TABLE_PREFIX#_';

  set_time_limit(60*5);  // allow up to 5 minutes to backup/restore database
  session_write_close(); // v2.51 - End the current session and store session data so locked session data doesn't prevent concurrent access to CMS by user while backup in progress

  // error checking
  if (!$filepath)                      { die("No backup file specified!"); }
  if (preg_match("/\.\./", $filepath)) { die("Backup filename contains invalid characters."); }

  ### restore backup

  // get file contents
  if (!file_exists($filepath)) { die("Backup file '$filename' doesn't exist!"); }
  $data = file_get_contents($filepath);
  $data = preg_replace('/\r\n/s', "\n", $data);

  // remove comments
  $data = preg_replace('|/\*.*?\*/|', '', $data); // remove /* comment */ style comments
  $data = preg_replace('|^--.*?$|m', '', $data);  // remove -- single line comments

  // insert table prefix
  $data = preg_replace("/^([^`]+`)$prefixPlaceholder/m", "\\1$TABLE_PREFIX", $data);

  // insert table name (used for restoring defaultSqlData files)
  if ($tablename) {
    $data = preg_replace("/^([^`]+`[^`]+)#TABLE_NAME#(`)/m", "\\1$tablename\\2", $data);
  }

  // execute statements
  $queries = preg_split("/;\n\s*/", $data);       // nextlines are always encoded in SQL content so we don't need to worry about accidentally matching them
  foreach ($queries as $query) {
    if (!$query) { continue; } // skip blank queries
    mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  }

}

?>
