<?php

  // default field values (used creating fields)
  global $defaultValue;
  $defaultValue = array();
  $defaultValue['order']               = time(); // sort to bottom
  $defaultValue['label']               = '';
  $defaultValue['type']                = 'none';
  $defaultValue['adminOnly']           = '0';
  $defaultValue['isSystemField']       = '0';
  $defaultValue['defaultValue']        = '';
  $defaultValue['isPasswordField']     = '0';
  $defaultValue['isRequired']          = '0';
  $defaultValue['isUnique']            = '0';
  $defaultValue['minLength']           = '';
  $defaultValue['maxLength']           = '';
  $defaultValue['charsetRule']         = '';
  $defaultValue['charset']             = '';
  $defaultValue['autoFormat']          = '1';
  $defaultValue['fieldPrefix']         = '';
  $defaultValue['description']         = '';
  $defaultValue['fieldWidth']          = '';   // also used by textboxes
  $defaultValue['myAccountField'] = '0';

  // date options
  $defaultValue['defaultDate']         = '';                            // '' for currentDate, none for no date, or 'custom'
  $defaultValue['defaultDateString']   = date('Y') . '-01-01 00:00:00'; // if custom use this date (or strtotime value)
  $defaultValue['showTime']            = '1';
  $defaultValue['showSeconds']         = '1';
  $defaultValue['use24HourFormat']     = '0';
  $defaultValue['yearRangeStart']      = ''; // v2.16 use dynamic defaults // date('Y') - 2;
  $defaultValue['yearRangeEnd']        = ''; // v2.16 use dynamic defaults // date('Y') + 8;

  // checkbox options
  $defaultValue['checkedByDefault']  = '0';
  $defaultValue['checkedValue']      = t('Yes');
  $defaultValue['uncheckedValue']    = t('No');

  // list options
  $defaultValue['listType']           = 'pulldown';
  $defaultValue['optionsType']        = "text";  // text, table, sql
  $defaultValue['optionsText']        = "option one\noption two\noption three";
  $defaultValue['optionsTablename']   = '';
  $defaultValue['optionsValueField']  = '';
  $defaultValue['optionsLabelField']  = '';
  $defaultValue['optionsQuery']       = "SELECT fieldname1, fieldname2\n  FROM `<?php echo \$TABLE_PREFIX ?>tableName`";
  $defaultValue['filterField']        = '';

  // wysiwyg options
  $defaultValue['defaultContent']      = '';
  $defaultValue['fieldHeight']         = '';   // also used by textboxes
  $defaultValue['allowUploads']        = '1';
  $defaultValue['wysiwygCode']         = 'default wysiwyg code';

  // upload options
  $defaultValue['allowedExtensions']     = 'gif,jpg,png,wmv,mov,swf,pdf';
  $defaultValue['checkMaxUploadSize']    = '1';
  $defaultValue['maxUploadSizeKB']       = '5120';
  $defaultValue['checkMaxUploads']       = '1';
  $defaultValue['maxUploads']            = '25';
  $defaultValue['resizeOversizedImages'] = '1';
  $defaultValue['maxImageHeight']        = '800';
  $defaultValue['maxImageWidth']         = '600';
  $defaultValue['createThumbnails']      = '1';
  $defaultValue['maxThumbnailHeight']    = '150';
  $defaultValue['maxThumbnailWidth']     = '150';
  $defaultValue['createThumbnails2']     = '0';
  $defaultValue['maxThumbnailHeight2']   = '150';
  $defaultValue['maxThumbnailWidth2']    = '150';
  $defaultValue['createThumbnails3']     = '0';
  $defaultValue['maxThumbnailHeight3']   = '150';
  $defaultValue['maxThumbnailWidth3']    = '150';
  $defaultValue['createThumbnails4']     = '0';
  $defaultValue['maxThumbnailHeight4']   = '150';
  $defaultValue['maxThumbnailWidth4']    = '150';
  $defaultValue['useCustomUploadDir']    = '0';
  $defaultValue['customUploadDir']       = $SETTINGS['uploadDir'];
  $defaultValue['customUploadUrl']       = $SETTINGS['uploadUrl'];
  $defaultValue['infoField1']            = "Title";
  $defaultValue['infoField2']            = "Caption";
  $defaultValue['infoField3']            = '';
  $defaultValue['infoField4']            = '';
  $defaultValue['infoField5']            = '';

  // separator options
  $defaultValue['separatorType']       = 'blank line';
  $defaultValue['separatorHeader']     = '';
  $defaultValue['separatorHTML']       = "<tr>\n <td colspan='2'>\n </td>\n</tr>";

  // Related Table options
  $defaultValue['relatedTable']        = '';
  $defaultValue['relatedLimit']        = '25';
  $defaultValue['relatedView']         = '';
  $defaultValue['relatedModify']       = '';
  $defaultValue['relatedErase']        = '';
  $defaultValue['relatedCreate']       = '';
  $defaultValue['relatedWhere']        = 'foreignFieldNum=\'<?php echo mysql_escape(@$RECORD[\'num\']) ?'.'>\'';
  $defaultValue['relatedMoreLink']     = 'foreignFieldNum_match=<?php echo htmlencode(@$RECORD[\'num\']) ?'.'>';


  // get column type
  $defaultValue['customColumnType']  = '';
  
  // mysql column index
  $defaultValue['indexed']           = '';

  // error checking
  if (@$_REQUEST['tableName'] == '') { die("no 'tableName' specified!"); }

  // load schema
  global $schema;
  $schema = loadSchema($_REQUEST['tableName']);
  if (empty($schema)) {
    $error  = "Can't find schema file for table '" . htmlencode($_REQUEST['tableName']) . "'. ";
    $error .= "Check the table details, click 'Save Details', and try again.<br/>\n";
    $error .= "(Reload your browser to close this dialog).<br/>\n";
    die($error);
  }

  // dispatch actions
  if (@$_REQUEST['save']) {
    submitFormViaAjax();
    exit;
  }


//
function getTablesAndFieldnames() {
  global $APP;
  $tablesAndFields = array();

  //
  foreach (getSchemaTables() as $tableName) {
    $schema = loadSchema($tableName);
    foreach ($schema as $fieldname => $fieldSchema) {
      if (!is_array($fieldSchema)) { continue; }  // skip table metadata - fields are arrays
      if (@$fieldSchema['type'] == 'separator') { continue; }  // skip separators
      if (@$fieldSchema['type'] == 'relatedRecords') { continue; }  // skip

      $tablesAndFields[$tableName][] = $fieldname;
    }
  }

  // sort tablenames (fieldnames are already sorted by saveSchema)
  ksort($tablesAndFields);

  //
  return $tablesAndFields;
}

// load field attributes (or defaults)
function getFieldAttributes($fieldname) {
  global $schema, $defaultValue;

  // get field schema
  $fieldSchema = array();
  if ($fieldname && array_key_exists($fieldname, $schema)) {
    $fieldSchema = $schema[$fieldname];
  }

  ### get field values (or defaults)
  $field = array();
  foreach (array_keys($defaultValue) as $key) { // set defaults if no value defined
    $field[$key] = isset($fieldSchema[$key]) ? $fieldSchema[$key] : $defaultValue[$key];
  }
  $field['newFieldname'] = $fieldname;

  //
  return $field;
}




//
function submitFormViaAjax() {
  global $schema;

  //
  disableInDemoMode('', 'ajax');

  // auto-assign separator and relatedRecords fieldnames
  if ($_REQUEST['type'] == 'separator' || $_REQUEST['type'] == 'relatedRecords') {
    if ($_REQUEST['fieldname'] == '') { // new field
      $newFieldname = '';
      $count = '001';
      while (!$newFieldname || array_key_exists($newFieldname, $schema)) {
        $newFieldname = "__{$_REQUEST['type']}{$count}__";
        $count = str_pad(++$count, 3, '0', STR_PAD_LEFT);
      }
      $_REQUEST['newFieldname'] = $newFieldname;
    }
    else {
      $_REQUEST['newFieldname'] = $_REQUEST['fieldname'];
    }
  }
  
  // support MySQL Column Type dropdown supplying a value
  if (@$_REQUEST['customColumnType-select'] !== '_customColumnType_') {
    $_REQUEST['customColumnType'] = @$_REQUEST['customColumnType-select'];
  }

  // Separator - Use label for header
  if ($_REQUEST['type'] == 'separator' && @$_REQUEST['label'] != '') {
    $_REQUEST['separatorType']   = 'header bar';
    $_REQUEST['separatorHeader'] = $_REQUEST['label'];
    $_REQUEST['label']           = ''; // blank out label so we don't save it
  }

  // Note: 'order' is a MySQL keyword that causes errors if not escaped, that's why it's reserved
  $reservedFieldnames  = "menu menuName menuType menuOrder menuHidden tableHidden listPageFields listPageOrder listPageSearchFields length order action page"; // _fields aren't allow by default
  $fieldnameChanged    = $_REQUEST['fieldname'] && $_REQUEST['fieldname'] != $_REQUEST['newFieldname'];
  $isFieldnameReserved = preg_match("/\b\Q{$_REQUEST['newFieldname']}\E\b/i", $reservedFieldnames);
  $typeNoneFields      = array('num', 'createdDate', 'createdByUserNum', 'updatedDate', 'updatedByUserNum', 'dragSortOrder');
  $typeDateFields      = array('publishDate', 'removeDate');
  $typeCheckboxFields  = array('neverRemove', 'hidden');

  // error checking
  $errors = '';
  if (@$_REQUEST['tableName'] == '')                                 { $errors .= "no 'tableName' specified!\n"; }
  if (@$_REQUEST['type']      == '')                                 { $errors .= "no field 'type' specified!\n"; }
  if (!$_REQUEST['type'])                                            { $errors .= "You must enter a value for 'Field Type'\n"; }
  if     (!@$_REQUEST['newFieldname'])                               { $errors .= "You must enter a value for 'Field Name'\n"; }
  elseif (preg_match('/[^a-z0-9\_\-]/i', $_REQUEST['newFieldname'])) { $errors .= "'Field Name' can only contain the following characters (a-z, A-Z, 0-9, - and _)\n"; }
  elseif (preg_match('/^_/i', $_REQUEST['newFieldname']) &&
          $_REQUEST['type'] != 'separator' &&
          $_REQUEST['type'] != 'relatedRecords')                     { $errors .= "'Field Name' cannot start with an underscore\n"; }
  elseif ($isFieldnameReserved)                                      { $errors .= "Selected fieldname is reserved, please choose another.\n"; }
  elseif ($fieldnameChanged && @$schema[$_REQUEST['newFieldname']])  { $errors .= "Selected fieldname is already in use, please choose another.\n"; }
  if (@$_REQUEST['useCustomUploadDir']) {
    if (!preg_match('/\/$/', $_REQUEST['customUploadDir']))          { $errors .= "Upload Directory Path must end with a slash! (eg: products/ or /www/htdocs/uploads/products/)\n"; }
    if (!preg_match('/\/$/', $_REQUEST['customUploadUrl']))          { $errors .= "Upload Folder Url must end with a slash! (eg: products/ or /www/htdocs/uploads/products/)\n"; }
  }
  if (in_array($_REQUEST['newFieldname'], $typeNoneFields)     && $_REQUEST['type'] != 'none')     { $errors .= "Field '{$_REQUEST['newFieldname']}' must be set to type 'none'\n"; }
  if (in_array($_REQUEST['newFieldname'], $typeDateFields)     && $_REQUEST['type'] != 'date')     { $errors .= "Field '{$_REQUEST['newFieldname']}' must be set to type 'date'\n"; }
  if (in_array($_REQUEST['newFieldname'], $typeCheckboxFields) && $_REQUEST['type'] != 'checkbox') { $errors .= "Field '{$_REQUEST['newFieldname']}' must be set to type 'checkbox'\n"; }

  if ($_REQUEST['type'] == 'textfield' && @$_REQUEST['charsetRule'] && preg_match("/\-./", @$_REQUEST['charset'])) {
    $errors .= "Allowed Content: If character list contains a dash it must be the last character!\n";
  }

  if ($_REQUEST['type'] == 'upload' || $_REQUEST['type'] == 'wysiwyg') {
    if (@$_REQUEST['resizeOversizedImages']) {
      if ($_REQUEST['maxImageHeight'] == '')                      { $errors .= "Resize images: Please specify a value for Max Image Height!\n"; }
      if (preg_match('/[^0-9\_]/i', $_REQUEST['maxImageHeight'])) { $errors .= "Resize images: Max Image Height must be a numeric value!\n"; }
      if ($_REQUEST['maxImageWidth'] == '')                       { $errors .= "Resize images: Please specify a value for Max Image Width!\n"; }
      if (preg_match('/[^0-9\_]/i', $_REQUEST['maxImageWidth']))  { $errors .= "Resize images: Max Image Width must be a numeric value!\n"; }
    }
    foreach (array('',2,3,4) as $num) {
      if (@$_REQUEST["createThumbnails$num"]) {
        $fieldLabel = "Create thumbnail" . (($num) ? "($num)" : '');
        if ($_REQUEST["maxThumbnailHeight$num"] == '')                      { $errors .= "$fieldLabel: Please specify a value for Max Image Height!\n"; }
        if (preg_match('/[^0-9\_]/i', $_REQUEST["maxThumbnailHeight$num"])) { $errors .= "$fieldLabel: Max Image Height must be a numeric value!\n"; }
        if ($_REQUEST["maxThumbnailWidth$num"] == '')                       { $errors .= "$fieldLabel: Please specify a value for Max Image Width!\n"; }
        if (preg_match('/[^0-9\_]/i', $_REQUEST["maxThumbnailWidth$num"]))  { $errors .= "$fieldLabel: Max Image Width must be a numeric value!\n"; }
      }
    }
  }

  if ($errors) {
    print $errors;
    exit;
  }

  // update mysql first to get any MySQL errors before updating schema
  _updateMySQL();

  //
  _updateSchema($schema);



}



//
function _updateSchema($schema) {

  $oldColumnName = $_REQUEST['fieldname'];
  $newColumnName = $_REQUEST['newFieldname'];

  // remove old column
  unset($schema[$oldColumnName]);

  // create new column (duplicate fieldname check already done in submitFormViaAjax)
  $schema[$newColumnName] = array();

  // ignore fields
  if (@$_REQUEST['separatorType'] != 'header bar') { unset($_REQUEST['separatorHeader']); }
  if (@$_REQUEST['separatorType'] != 'html')       { unset($_REQUEST['separatorHTML']); }
  if (@$_REQUEST['optionsType'] != 'text' &&
      @$_REQUEST['optionsText'] != '')             { $_REQUEST['optionsText'] = ''; }
  if (@$_REQUEST['optionsType'] != 'table')        { $_REQUEST['optionsTablename'] = ''; $_REQUEST['optionsValueField'] = ''; $_REQUEST['optionsLabelField'] = '';  }
  if (@$_REQUEST['optionsType'] != 'query')        { $_REQUEST['optionsQuery'] = ''; $_REQUEST['filterField'] = ''; }
  if (@!$_REQUEST['useCustomUploadDir'])           { $_REQUEST['customUploadDir'] = ''; $_REQUEST['customUploadUrl'] = ''; }

  // update field schema (save these fields)
  $fieldsIgnoredIfEmpty  = array('customColumnType', 'isSystemField', 'adminOnly',
                                 'optionsText', 'optionsTablename', 'optionsValueField', 'optionsLabelField', 'optionsQuery', 'filterField',
                                 'myAccountField' // this field is only shown when editing the accounts section
                                 ); // these fields aren't saved if they are blank or zero
  $fieldAttributesByType = array(    // these fields are saved for each field type
    'none'      => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'indexed'),
    'textfield' => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'indexed', 'defaultValue', 'fieldPrefix', 'description', 'fieldWidth', 'isPasswordField', 'isRequired', 'isUnique', 'minLength', 'maxLength', 'charsetRule', 'charset'),
    'textbox'   => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'indexed', 'defaultContent', 'fieldPrefix', 'description', 'isRequired', 'isUnique', 'minLength', 'maxLength', 'fieldHeight', 'autoFormat'),
    'date'      => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'indexed', 'fieldPrefix', 'description', 'isRequired', 'isUnique', 'defaultDate', 'defaultDateString', 'showTime', 'showSeconds', 'use24HourFormat', 'yearRangeStart', 'yearRangeEnd'),
    'list'      => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'indexed', 'defaultValue', 'fieldPrefix', 'description', 'isRequired', 'isUnique', 'listType', 'optionsType', 'optionsText', 'optionsTablename', 'optionsValueField', 'optionsLabelField', 'optionsQuery', 'filterField'),
    'checkbox'  => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'indexed', 'fieldPrefix', 'checkedByDefault', 'description', 'checkedValue', 'uncheckedValue'),
    'upload'    => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'fieldPrefix', 'description', 'isRequired',
                         'allowedExtensions', 'checkMaxUploadSize', 'maxUploadSizeKB',
                         'checkMaxUploads', 'maxUploads',
                         'resizeOversizedImages', 'maxImageHeight', 'maxImageWidth',
                         'createThumbnails', 'maxThumbnailHeight', 'maxThumbnailWidth',
                         'createThumbnails2', 'maxThumbnailHeight2', 'maxThumbnailWidth2',
                         'createThumbnails3', 'maxThumbnailHeight3', 'maxThumbnailWidth3',
                         'createThumbnails4', 'maxThumbnailHeight4', 'maxThumbnailWidth4',
                         'useCustomUploadDir', 'customUploadDir', 'customUploadUrl',
                         'infoField1', 'infoField2', 'infoField3', 'infoField4', 'infoField5'),
    'wysiwyg'   => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'indexed', 'fieldPrefix', 'description', 'defaultContent', 'allowUploads', 'isRequired', 'isUnique', 'minLength', 'maxLength', 'fieldHeight',
                         'allowedExtensions', 'checkMaxUploadSize', 'maxUploadSizeKB',
                         'checkMaxUploads', 'maxUploads',
                         'resizeOversizedImages', 'maxImageHeight', 'maxImageWidth',
                         'createThumbnails', 'maxThumbnailHeight', 'maxThumbnailWidth',
                         'createThumbnails2', 'maxThumbnailHeight2', 'maxThumbnailWidth2',
                         'createThumbnails3', 'maxThumbnailHeight3', 'maxThumbnailWidth3',
                         'createThumbnails4', 'maxThumbnailHeight4', 'maxThumbnailWidth4',
                         'useCustomUploadDir', 'customUploadDir', 'customUploadUrl'),
    'separator' => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'separatorType', 'separatorHeader', 'separatorHTML'),

    /* Advanced Fields */

    'relatedRecords' => array('order', 'label', 'type', 'relatedTable', 'relatedLimit', 'relatedView', 'relatedModify', 'relatedErase', 'relatedCreate', 'relatedWhere', 'relatedMoreLink', 'isSystemField', 'adminOnly', 'myAccountField'),

    'parentCategory' => array('customColumnType', 'order', 'label', 'type', 'isSystemField', 'adminOnly', 'myAccountField', 'indexed'),
  );
  foreach ($fieldAttributesByType[$_REQUEST['type']] as $name) {
    $value     = array_key_exists($name, $_REQUEST) ? $_REQUEST[$name] : $GLOBALS['defaultValue'][$name]; // use default value if no form value defined (such as with quick add)
    $skipField = empty($value) && in_array($name, $fieldsIgnoredIfEmpty); // don't record empty values for these fields
    if (!$skipField) {
      $schema[$newColumnName][$name] = $value;
    }
  }

  //
  $tablenameWithoutPrefix = getTableNameWithoutPrefix( $GLOBALS['tableName'] );

  // save field schema
  saveSchema($_REQUEST['tableName'], $schema);
}





//
function _updateMySQL() {
  global $TABLE_PREFIX, $schema;
  $escapedTableName = mysql_escape($_REQUEST['tableName']);
  
  // get current column name and type
  $oldColumnName = $_REQUEST['fieldname'];
  $newColumnName = $_REQUEST['newFieldname'];
  $oldColumnType = getMysqlColumnType($_REQUEST['tableName'], $oldColumnName);
  $newColumnType = getColumnTypeFor($newColumnName, $_REQUEST['type'], @$_REQUEST['customColumnType']);

  // create/alter/remove MySQL columns
  $isOldColumn       = $oldColumnType;
  $isNewColumn       = ($newColumnType != 'none' && $newColumnType != '');
  $doEraseColumn     = $isOldColumn    && !$isNewColumn;
  $doCreateColumn    = !$oldColumnType && $isNewColumn;
  $doAlterColumn     = $isOldColumn    && $isNewColumn;
  
  // remove existing index (if any) - always dropping/recreating indexes ensure they match renamed fields, etc
  list($oldIndexName, $oldIndexColList) = getIndexNameAndColumnListForField($oldColumnName, $oldColumnType);
  $indexExists = (bool) mysql_get_query("SHOW INDEX FROM `$escapedTableName` WHERE Key_name = '$oldIndexName'");
  if ($indexExists) {
    mysql_query("DROP INDEX `$oldIndexName` ON `$escapedTableName`") or die("Error dropping index `$newIndexName`:". htmlencode(mysql_error()));
  }

  // update table: create, alter, or erase field
  if ($doCreateColumn) {   // create field
    $query  = "ALTER TABLE `".mysql_escape($_REQUEST['tableName'])."`
                              ADD COLUMN  `".mysql_escape($newColumnName)."` $newColumnType";
    $result = mysql_query($query)
              or die("There was an error creating the MySQL Column, the error was:\n\n". mysql_error());
  }
  else if ($doAlterColumn) {    // change field type
    $result = mysql_query("ALTER TABLE `".mysql_escape($_REQUEST['tableName'])."`
                         CHANGE COLUMN `".mysql_escape($oldColumnName)."`
                                       `".mysql_escape($newColumnName)."` $newColumnType")
              or die("There was an error changing the MySQL Column, the error was:\n\n". mysql_error() . "\n");
  }
  else if ($doEraseColumn) {    // erase mysql field
    $query  = "ALTER TABLE `".mysql_escape($_REQUEST['tableName'])."`
               DROP COLUMN `".mysql_escape($oldColumnName)."`";
    $result = mysql_query($query)
              or die("There was an error removing the MySQL Column, the error was:\n\n". mysql_error() . "\n");
  }
  
  // add/re-create index if required
  if (@$_REQUEST['indexed']) {
    list($newIndexName, $newIndexColList) = getIndexNameAndColumnListForField($newColumnName, $newColumnType);
    $result = mysql_query("CREATE INDEX `$newIndexName` ON `$escapedTableName` $newIndexColList") or die("Error creating index `$newIndexName`:". htmlencode(mysql_error()));
  }

  // update uploads table (rename upload field if it was changed)
  $uploadFieldRenamed = $_REQUEST['type'] == 'upload' && $oldColumnName && $oldColumnName != $newColumnName;
  if ($uploadFieldRenamed) {
    $tableNameWithoutPrefix = getTableNameWithoutPrefix($_REQUEST['tableName']);
    $query  = "UPDATE `{$TABLE_PREFIX}uploads`";
    $query .= "   SET fieldName='".mysql_escape($newColumnName)."'";
    $query .= " WHERE fieldName='".mysql_escape($oldColumnName)."' AND";
    $query .= "       tableName='".mysql_escape($tableNameWithoutPrefix)."'";
    mysql_query($query) or die("There was an error updating the uploads database:\n\n". htmlencode(mysql_error()) . "\n");
  }
}
