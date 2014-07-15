<?php

  ### set globals
  if (@$_REQUEST['tableName'] == '') { die("no tableName specified!"); }
  $_REQUEST['tableName'] = getTableNameWithPrefix($_REQUEST['tableName']);  # force add table prefix (if not specified)

  global $tableName, $tableNameWithPrefix, $schema;
  $tableName           = $_REQUEST['tableName'];
  $tableNameWithPrefix = getTableNameWithPrefix($tableName);
  $schema              = loadSchema($tableName);
  if (!$schema) { die("Couldn't find table '" .htmlencode($tableName). "'!"); }

  ### dispatch actions
  if      (@$_REQUEST['saveTableDetails'])                  { saveTableDetails();  }
  else if (@$_REQUEST['dropTable'])                         { dropTable();  }
  else if (@$_REQUEST['saveFieldOrder'])                    { saveFieldOrder(); }
  else if (@$_REQUEST['do'] == 'enableSystemFieldEditing')  { enableSystemFieldEditing(); }
  else if (@$_REQUEST['do'] == 'disableSystemFieldEditing') { disableSystemFieldEditing(); }
  else if (@$_REQUEST['addField'])                          { include('lib/menus/database/editField.php'); exit;  }
  else if (@$_REQUEST['editField'])                         { include('lib/menus/database/editField.php'); exit;  }
  else if (@$_REQUEST['eraseField'])                        { eraseField();  }
  else if (@$_REQUEST['displayFieldList'])                  { displayFieldList(); exit; }


//
function getTableDetails() {
  global $tableName;

  $tableDetails = array();
  $tableDetails['rowCount'] = mysql_count($tableName);

  return $tableDetails;
}


//
function dropTable() {
  global $tableNameWithPrefix, $APP;

  //
  disableInDemoMode('', 'database/listTables.php');

  // drop MySQL table
  $result = mysql_query("DROP TABLE `".mysql_escape($tableNameWithPrefix)."`") or die("Error dropping MySQL table:\n\n". htmlencode(mysql_error()) . "\n");

  // delete schema file
  $tableNameWithoutPrefix = getTableNameWithoutPrefix($tableNameWithPrefix);
  $schemaFilepath         = DATA_DIR . "/schema/$tableNameWithoutPrefix.ini.php";
  unlink($schemaFilepath);

  // list tables
  redirectBrowserToURL('?menu=database&action=listTables');
  exit;
}


//
function displayFieldList() {
  // Note: put this is in a function so in future we can dynamically regenerate the field list with ajax.
  // Currently this breaks the sortable rows feature though. So we're just reloading the whole page on editField save.
  global $tableName, $schema;

  $fieldList = _getFieldList();

   // id="field_<?php echo ($field['name'])

  ?>

  <?php foreach ($fieldList as $field): ?>
    <?php $fieldSchema = @$schema[ $field['name'] ]; ?>

     <tr class="<?php echo $field['bgColorClass'] ?><?php if (@$field['isSystemField']) { echo ' inactive'; } ?>">

     <td style="text-align: center; vertical-align: middle; padding: 0px 5px" class="dragger">
      <input type='hidden' name='_fieldName' value='<?php echo $field['name'] ?>' class='_fieldName' />
      <img src="lib/images/drag.gif" height="6" width="19" class='dragger' title='<?php et('Click and drag to change order.') ?>' alt="" /><br/>
     </td>

      <td class="listRow">
        <?php
          if (@$field['type'] == 'separator') {
            if ( @$field['separatorHeader']) { echo "<div align='center' style='line-height: 200%'><b>--- {$field['separatorHeader']} ---</b></div>\n"; }
            else                             { echo "<div align='center'>--- {$field['separatorType']} ---</div>"; }
          }
          else if (@$field['type'] == 'relatedRecords') {
             echo "<div align='center' style='line-height: 200%'><b>--- {$field['label']} ---</b></div>\n";
          }
          else {
            echo @!empty($field['label']) ? htmlencode($field['label']) : "(no field label)";
          }
        ?>
      </td>
      <td class="listRow" style="text-align:center">
        <?php
          echo array_key_exists('type', $field) ? $field['type'] : "none";
          if (@$field['hidden']) { echo "(hidden)"; }
        ?><br/>
      </td>
      <td class="listRow">
        <?php echo $field['name']; ?>
        <span style='color: #999; float: right'>
        <?php
          $advancedInfo = array();
          $advancedInfo[] = htmlencode(@$field['columnType']); 
          $advancedInfo[] = @$field['indexed'] ? t("indexed") : '';
          print implode(', ', array_filter($advancedInfo));
        ?>
        </span>
      </td>
      
      <?php if ($field['isEditable']): ?>
        <td class="listRow" style="text-align:center"><a href="#" onclick="modifyField('<?php echo urlencode($tableName) ?>','<?php echo urlencode($field['name']) ?>'); return false;"><?php et('modify') ?></a></td>

        <?php if ($field['name'] == 'num'): ?>
          <td class="listRow" style="text-align:center">erase</td>
        <?php else: ?>
          <td class="listRow" style="text-align:center"><a href="#" onclick="confirmEraseField('<?php echo urlencode($tableName) ?>','<?php echo urlencode($field['name']) ?>', this); return false;"><?php et('erase') ?></a></td>
        <?php endif ?>

      <?php else: ?>
        <td class="listRow" style="text-align:center" colspan="2">system field</td>
      <?php endif ?>
     </tr>
  <?php endforeach ?>




  <?php if (empty($fieldList)): ?>
   <tr>
    <td>Sorry, no fields were found!</td>
   </tr>
  <?php endif ?>

  <?php
}

//
function _getFieldList() {
  global $SETTINGS, $tableName, $schema;

  // create field list
  $fieldList = array();

  // load schema columns
  foreach ($schema as $name => $valueOrArray) {
    if (is_array($valueOrArray)) {  // only fields has arrays as values
      $fieldList[$name]               = $valueOrArray;
      $fieldList[$name]['name']       = $name;
    }
  }

  // load mysql columns
  $columns = array();
  $result      = mysql_query("SHOW COLUMNS FROM `".mysql_escape($tableName)."`") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  while ($row = mysql_fetch_assoc($result)) {
    $name = $row['Field'];
    $fieldList[$name]['name']       = $name;
    $fieldList[$name]['columnType'] = $row['Type'];
  }

  // sort field list (by order,
  function _sortByOrder($fieldA, $fieldB) {
    $orderA = array_key_exists('order', $fieldA) ? $fieldA['order'] : 1000000000;
    $orderB = array_key_exists('order', $fieldB) ? $fieldB['order'] : 1000000000;

    if ($orderA < $orderB) { return -1; }
    if ($orderA > $orderB) { return 1; }

    return 0;

  }
  uasort($fieldList, '_sortByOrder');

  //
  foreach (array_keys($fieldList) as $fieldname) {
    $fieldAttributes = &$fieldList[$fieldname];
    $fieldAttributes['isColumn']      = !@$fieldAttributes['isSeparator'];
    $fieldAttributes['isEditable']    = !@$fieldAttributes['isSystemField'] || $SETTINGS['mysql']['allowSystemFieldEditing'];
    $fieldAttributes['isSystemField'] = @$fieldAttributes['isSystemField'];

    static $lastClass = 'oddRow';
    $lastClass        = ($lastClass == "listRowOdd") ? 'listRowEven' : 'listRowOdd'; # rotate bgclass
    $fieldAttributes['bgColorClass'] = $lastClass;
  }

  //
  return $fieldList;
}


//
function saveTableDetails() {
  global $TABLE_PREFIX, $schema, $APP, $tableName, $tableNameWithPrefix;
  $oldSchemaFilepath = DATA_DIR . '/schema/' .getTableNameWithoutPrefix($_REQUEST['tableName']). ".ini.php";
  $newSchemaFilepath = DATA_DIR . '/schema/' .getTableNameWithoutPrefix($_REQUEST['newTableName']). ".ini.php";

  //
  disableInDemoMode('', 'database/listTables.php');

  // error checking
  $errors = '';
  if ($_REQUEST['newTableName'] == '') { $errors .= "You must specify a tablename!<br/>\n"; }
  if (preg_match("/dragSortOrder/", @$_REQUEST['listPageFields']) || preg_match("/dragSortOrder/", $_REQUEST['listPageOrder'])) {
    if (!preg_match("/^dragSortOrder/", @$_REQUEST['listPageFields'])) { $errors .= "If used, dragSortOrder must be the first field in 'ListPage Fields'!<br/>\n"; }
    if (!preg_match("/^dragSortOrder/", $_REQUEST['listPageOrder']))  { $errors .= "If used, dragSortOrder must be the first field in 'Order By'!<br/>\n"; }
  }
  if (@$_REQUEST['tableName'] && !$schema) {
    $errors .= "Error updating schema file.  Please wait a few seconds and try again.<br/>\n";
  }
  if     (!is_writable(DATA_DIR . '/schema/')) { $errors .= "Schema dir '/data/schema/' isn't writable.  Please update permissions.<br/>\n"; }
  elseif (!is_writable($oldSchemaFilepath))    { $errors .= "Schema file '/data/schema/" .basename($oldSchemaFilepath). "' isn't writable.  Please update permissions.<br/>\n"; }

  
 // v2.53 - require urls to start with scheme:// or / (to ensure links are valid when moving between sites)
  $fieldNamesToLabels = array();
  
  $fieldNamesToLabels['_listPage']    = 'List Page Url';
  $fieldNamesToLabels['_detailPage']  = 'Detail Page Url';
  $fieldNamesToLabels['_previewPage'] = 'Preview Page Url';
  foreach ($fieldNamesToLabels as $name => $label) {
    $startsWithHttpOrSlash = preg_match("|^(\w+:/)?/|", @$_REQUEST[$name]);
    if (@$_REQUEST[$name] && !$startsWithHttpOrSlash) { $errors .= t("$label must start with /") . "<br/>\n"; }
  }

  //
  if ($errors) {
    alert($errors);
    return;
  }

  // force add table prefix (if not specified)
  $_REQUEST['newTableName'] = getTableNameWithPrefix($_REQUEST['newTableName']);

  ### rename table
  if ($_REQUEST['tableName'] != $_REQUEST['newTableName']) {
    $error = getTablenameErrors( $_REQUEST['newTableName'] );
    if ($error) {
      alert($error);
      return;
    }


    // rename mysql table
    $result = mysql_query("RENAME TABLE `".mysql_escape($_REQUEST['tableName'])."`
                                        TO `".mysql_escape($_REQUEST['newTableName'])."`")
              or die("Error renaming MySQL table:\n\n". htmlencode(mysql_error()) . "\n");

    // rename schema file
    rename_winsafe($oldSchemaFilepath, $newSchemaFilepath) or die("Error renaming schema file!");

    // update uploads table with new table name
    $where        = array('tableName' => getTableNameWithoutPrefix($_REQUEST['tableName'])    ); // old tableName
    $colsToValues = array('tableName' => getTableNameWithoutPrefix($_REQUEST['newTableName']) ); // new tableName
    $result       = mysql_update('uploads', null, $where, $colsToValues);

    // update tableName form field
    $_REQUEST['tableName'] = $_REQUEST['newTableName'];

    // update globals with new tablename
    $tableName                = $_REQUEST['tableName']; // sic
    $tableNameWithPrefix      = $_REQUEST['tableName'];

  }

  ### update schema fields
  $schema['menuName']                           = $_REQUEST['menuName'];
  $schema['_indent']                            = @$_REQUEST['_indent'];
  $schema['menuType']                           = $_REQUEST['menuType'];
  $schema['menuOrder']                          = $_REQUEST['menuOrder'];

  if ($_REQUEST['menuType'] != 'link') {
    $schema['menuHidden']                       = $_REQUEST['menuHidden'];
    $schema['listPageFields']                   = @$_REQUEST['listPageFields'];
    $schema['listPageOrder']                    = $_REQUEST['listPageOrder'];
    $schema['listPageSearchFields']             = $_REQUEST['listPageSearchFields'];
    $schema['_perPageDefault']                  = @$_REQUEST['_perPageDefault'];
    $schema['_maxRecords']                      = $_REQUEST['_maxRecords'];
    $schema['_maxRecordsPerUser']               = $_REQUEST['_maxRecordsPerUser'];
    $schema['_disableAdd']                      = $_REQUEST['_disableAdd'];
    $schema['_disableView']                     = $_REQUEST['_disableView'];
    $schema['_disableModify']                   = $_REQUEST['_disableModify'];
    $schema['_disableErase']                    = $_REQUEST['_disableErase'];
    $schema['_disablePreview']                  = $_REQUEST['_disablePreview'];
    $schema['_filenameFields']                  = @$_REQUEST['_filenameFields'];
    $schema['_listPage']                        = @$_REQUEST['_listPage'];
    $schema['_detailPage']                      = $_REQUEST['_detailPage'];
    $schema['_previewPage']                     = $_REQUEST['_previewPage'];
    $schema['_hideRecordsFromDisabledAccounts'] = $_REQUEST['_hideRecordsFromDisabledAccounts'];
    $schema['_requiredPlugins']                 = @$_REQUEST['_requiredPlugins'];
  }
  if ($_REQUEST['menuType'] == 'link') {
    $schema['_url']                           = $_REQUEST['_url'];
    $schema['_linkTarget']                    = @$_REQUEST['_linkTarget'];
    $schema['_linkMessage']                   = @$_REQUEST['_linkMessage'];
    $schema['_iframeHeight']                  = @$_REQUEST['_iframeHeight'];
    unset( $schema['_targetBlank'] ); // unset old schema value (if it exists)
  }
  if ($_REQUEST['menuType'] == 'category') {
    $schema['_maxDepth']                      = $_REQUEST['_maxDepth'];
  }

  saveSchema($_REQUEST['tableName'], $schema);

  //
  notice("Table details for '" .htmlencode($schema['menuName']). "' have been saved.");

}

//
function getTableDetailErrors($schema) {
  global $tableNameWithPrefix;
  if (!$schema) { die(__FUNCTION__ . ": No schema specified!"); }
  $errors = '';

  // test sorting fields
  if (@$schema['listPageOrder']) {
    $query  = "SELECT num FROM `" .mysql_escape($tableNameWithPrefix). "` ";
    $query .= "ORDER BY {$schema['listPageOrder']} ";
    $query .= "LIMIT 1";

    $result = @mysql_query($query);
    if (!$result) {
      $errors .= "<b>Sorting Error:</b> Check your 'Order By' fields in the sorting tab for invalid field names.<br/>\n";
      $errors .= "MySQL returned the following error: " . htmlencode(mysql_error()) . "\n";
    }
  }

  return $errors;
}


//
function saveFieldOrder() {
  global $APP, $schema;

  //
  disableInDemoMode('', 'ajax');
  if (!$schema) { print "Error updating schema file.  Please wait a few seconds and try again."; exit; }

  $fieldOrderChanged = !empty($_REQUEST['newFieldnameOrder']);
  if ($fieldOrderChanged) {


    // update schema field order
    $newFieldnameOrder = explode(',', $_REQUEST['newFieldnameOrder']);
    $order = 0;
    foreach ($newFieldnameOrder as $fieldname) {
      if (!is_array( @$schema[$fieldname] )) { die("Couldn't find '$fieldname' in table '{$_REQUEST['tableName']}' schema!"); }
      $schema[$fieldname]['order'] = ++$order;
    }

    // save schema
    saveSchema($_REQUEST['tableName'], $schema);
  }


  // this function is called via ajax.  Output is returned as errors via javascript alert.  Output nothing on success.
  exit;

}


//
function enableSystemFieldEditing() {
  global $SETTINGS, $APP;

  //
  disableInDemoMode('', 'database/listTables.php');

  // update settings
  $SETTINGS['mysql']['allowSystemFieldEditing'] = 1;
  saveSettings();

  //
  notice("System field editing has been enabled.");
}


//
function disableSystemFieldEditing() {
  global $SETTINGS, $APP;

  //
  disableInDemoMode('', 'database/listTables.php');

  // update settings
  $SETTINGS['mysql']['allowSystemFieldEditing'] = 0;
  saveSettings();

  //
  notice("System field editing has been disabled.");

}


//
function eraseField() {
  global $TABLE_PREFIX, $schema;

  //
  disableInDemoMode('', 'ajax');

  $tableName = $_REQUEST['tableName'];
  $fieldname = $_REQUEST['fieldname'];
  if (!$tableName) { die("no tableName specified!\n"); }
  if (!$fieldname) { die("no tableName specified!\n"); }

  // erase from schema
  unset($schema[$fieldname]);
  saveSchema($tableName, $schema);

  // erase from mySQL
  $columnType = getMysqlColumnType($tableName, $fieldname);
  if ($columnType != '') {
    $result = mysql_query("ALTER TABLE `".mysql_escape($tableName)."`
                              DROP COLUMN `".mysql_escape($fieldname)."`")
              or die("There was an error removing the MySQL Column, the error was:\n\n". htmlencode(mysql_error()) . "\n");
  }

  // expire uploads (mark files for erasing by blanking out fieldname - they get erased when upload form is submitted)
  $tableNameWithoutPrefix = getTableNameWithoutPrefix($tableName);
  $query  = "UPDATE `{$TABLE_PREFIX}uploads`";
  $query .= "   SET fieldName = ''";
  $query .= " WHERE fieldName = '".mysql_escape($fieldname)."' AND";
  $query .= "       tableName = '".mysql_escape($tableNameWithoutPrefix)."'";
  mysql_query($query) or die("There was an error erasing old uploads:\n\n". htmlencode(mysql_error()) . "\n");


  // this function is called via ajax.  Output is returned as errors via javascript alert.  Output nothing on success.
  exit;

}

?>
