<?php

// show pulldown when editor clicks "change" beside "Created By" on edit page in CMS
function ajaxGetUsersAsPulldown() {
  global $TABLE_PREFIX, $hasEditorAccess, $tableName;
  if (!$hasEditorAccess) { return ''; } // must have section admin access

  // get users with access to this section
  $query = "SELECT u.num, u.username
              FROM {$TABLE_PREFIX}accounts u
              JOIN {$TABLE_PREFIX}_accesslist a ON u.num = a.userNum
             WHERE a.accessLevel > 1 AND a.tableName IN ('all','$tableName')
             ORDER BY username";
  $users = mysql_select_query($query);

  // get option values
  $userNums    = array_pluck($users, 'num');
  $userNames   = array_pluck($users, 'username');
  $optionsHTML = getSelectOptions(null, $userNums, $userNames);

  // show pulldown
  $selectHTML  = "<select name='createdByUserNum'>\n";
  $selectHTML .= "<option value=''>" .htmlencode(t("<select user>")). "</option>\n";
  $selectHTML .= $optionsHTML;
  $selectHTML .= "</select>\n";

  //
  print $selectHTML;
  exit;
}


// ajax function to update table order after users drag-sort records
function listDragSort() {
  global $schema, $escapedTableName, $CURRENT_USER, $tableName, $isMyAccountMenu;
  if ($isMyAccountMenu) { die("Access not permitted for My Account menu!"); }

  // error checking
  $errors = '';
  if (!$_REQUEST['recordNums'])                         { $errors .= "No 'recordNums' specified!\n"; }
  if (preg_match("/[^\d\,]/", $_REQUEST['recordNums'])) { $errors .= "'recordNums' contains invalid chars! ('" .htmlencode($_REQUEST['recordNums']). "')\n"; }
  if (!@$schema['dragSortOrder'])                       { $errors .= "No 'dragSortOrder' field specified in table schema!\n"; }
  if ($errors) { die($errors); }

  // assign default value to new dragSortOrder fields
  // NOTE: This copies the existing order by using the schema listPageOrder to Order By
  mysql_query("SET @count = 0") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  mysql_query("UPDATE `$escapedTableName` SET `dragSortOrder` = (SELECT @count := @count + 10) WHERE dragSortOrder = 0 ORDER BY {$schema['listPageOrder']}") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");

  // re-order dragSortOrder field
  // NOTE: this re-numbers all the field values to make sure we don't have duplicates, etc
  mysql_query("UPDATE `$escapedTableName` SET `dragSortOrder` = (SELECT @count := @count + 10) ORDER BY dragSortOrder") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");

  // get order by
  $orderBy = '';
  $sortBy  = @$_SESSION['lastRequest'][$tableName]['sortBy'];
  $sortDir = @$_SESSION['lastRequest'][$tableName]['sortDir'];
  if      ($sortBy && $sortDir == 'desc') { $orderBy = "ORDER BY $sortBy DESC"; }
  else if ($sortBy)                       { $orderBy = "ORDER BY $sortBy"; }
  else if (@$schema['listPageOrder'])     { $orderBy = "ORDER BY {$schema['listPageOrder']}"; }

  // get order values for selected records
  $numToOrder = array();
  $result = mysql_query("SELECT num, dragSortOrder FROM `$escapedTableName`
                          WHERE num IN ({$_REQUEST['recordNums']})
                          ORDER BY {$schema['listPageOrder']}") or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  while ($row = mysql_fetch_assoc($result)) {
    $orderValues[] = $row['dragSortOrder'];
  }

  // re-assign same order values to records in new order
  $recordNums    = preg_split("/\,/", $_REQUEST['recordNums']); // new record order
  $whereOwner   = ''; // restrict re-order access if not admin
  if (!$GLOBALS['hasEditorAccess'] && @$schema['createdByUserNum']) {
    $whereOwner = "AND createdByUserNum = '{$CURRENT_USER['num']}'";
  }

  foreach ($recordNums as $num) {  // apply old order sequence to re-ordered record numbers
    if (!$num) { die("No num found in 'recordNums!'\n"); }

    $newOrder     = array_shift($orderValues);
    $escapedOrder = mysql_escape($newOrder);
    $escapedNum   = mysql_escape($num);

    $query = "UPDATE `$escapedTableName` SET dragSortOrder = '$escapedOrder' WHERE num = '$escapedNum' $whereOwner\n";
    mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  }

  // reset sorting to default (if we refresh the list and still display sorting on a column it will seem like dragSortOrder didn't work)
  $_SESSION['lastRequest'][$tableName]['sortBy'] = '';
  $_SESSION['lastRequest'][$tableName]['sortDir'] = '';

}

//
function eraseRecords() {
  global $TABLE_PREFIX, $tableName, $schema, $escapedTableName, $isMyAccountMenu;
  if ($isMyAccountMenu) { die("Access not permitted for My Account menu!"); }

  // error checking
  $errors = '';
  if      (@$schema['_disableErase'])      { $errors .= t("Erasing records has been disabled for this section!"); }
  else if (!@$_REQUEST['selectedRecords']) { $errors .= t("No record numbers were selected!"); }
  if ($errors) {
    alert($errors);
    return;
  }

  // get record nums to erase
  $recordNumsAsCSV = '0';
  foreach ($_REQUEST['selectedRecords'] as $num) {
    if ($tableName == 'accounts' && $num == $GLOBALS['CURRENT_USER']['num']) { continue; } // don't allow users to erase themselves!
    $recordNumsAsCSV .= ',' . intval($num);
  }

  //
  doAction('record_preerase', $tableName, $recordNumsAsCSV);

  // erase records uploads
  eraseRecordsUploads($recordNumsAsCSV);

  // erase records
  $query  = "DELETE FROM `$escapedTableName` WHERE num IN ($recordNumsAsCSV)";
  mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  $recordsErased = mysql_affected_rows();

  //
  if      ($recordsErased == 0) { alert( t("Couldn't erase record (record no longer exists)!")); }
  else if ($recordsErased == 1) { notice(t("Record erased!")); }
  else if ($recordsErased >= 2) { alert( t("Records erased!")); }

  doAction('record_posterase', $tableName, $recordNumsAsCSV);
}

//
function showMaxRecordsError($returnText = false) {
  global $CURRENT_USER, $tableName, $escapedTableName, $schema, $hasEditorAccess;
  $errors = '';

  // check section record limit
  if (@$schema['_maxRecords'] != '') {
    $recordCount = mysql_count($tableName);

    if ($recordCount >= $schema['_maxRecords']) {
      $errors .= sprintf(t('This section only allows a total of \'%s\' records (section limit).'), $schema['_maxRecords']) . "<br/>\n";
    }
  }

  // check user records limit (regular users only)
  if (!$hasEditorAccess && @$schema['createdByUserNum']) {
    $recordCount = mysql_count($tableName, "`createdByUserNum` = '{$CURRENT_USER['num']}'");

    if (@$schema['_maxRecordsPerUser'] && $recordCount >= $schema['_maxRecordsPerUser']) {
      $errors .= sprintf(t('You are only allowed to have \'%s\' records in this section (Section Editor Limit).'), $schema['_maxRecordsPerUser']) . "<br/>\n";
    }
    elseif (@$CURRENT_USER['accessList'][$tableName]['maxRecords'] && $recordCount >= $CURRENT_USER['accessList'][$tableName]['maxRecords']) {
      $errors .= sprintf(t('You are only allowed to have \'%s\' records in this section (User Account Limit).'), $CURRENT_USER['accessList'][$tableName]['maxRecords']) . "<br/>\n";
    }
  }

  // display errors
  if ($errors) {
    if ($returnText) { return $errors; }
    else {
      alert($errors);
      include('lib/menus/default/list.php');
      exit;
    }
  }

}


// foreach (getUploadInfoFields($record) as $name => $label) { ...
function getUploadInfoFields($fieldname) {
  global $schema;
  $infoFields = array();

  //
  $fieldSchema = $schema[$fieldname];
  foreach ($fieldSchema as $name => $value) {
    if (!preg_match("/^infoField\d+$/", $name)) { continue; } // skip if not info field
    if (!$value)                                { continue; } // skip if no field label
    $fieldname = preg_replace("/Field/", '', $name);

    $infoFields[$fieldname] = $value;
  }

  return $infoFields;
}


// ajax function,
function uploadListReOrder() {
  global $TABLE_PREFIX, $tableName;

  //
  disableInDemoMode('', 'ajax');

  # error checking
  if (!array_key_exists('num', $_REQUEST))              { die(__FUNCTION__ . ": no record 'num' specified!");  }
  if (!array_key_exists('preSaveTempId', $_REQUEST))    { die(__FUNCTION__ . ": no record 'preSaveTempId' specified!");  }
  if (!@$_REQUEST['fieldName'])                         { die(__FUNCTION__ . ": no 'fieldName' specified!"); }
  if (!$_REQUEST['uploadNums'])                         { $errors .= "No 'uploadNums' specified!\n"; }
  if (preg_match("/[^\d\,]/", $_REQUEST['uploadNums'])) { $errors .= "'uploadNums' contains invalid chars! ('" .htmlencode($_REQUEST['uploadNums']). "')\n"; }

  # re-order uploads
  $orderedUploadNums = preg_split("/\,/", $_REQUEST['uploadNums']); // new record order
  $newOrder = 0;
  foreach ($orderedUploadNums as $uploadNumber) {
    $query  = "UPDATE `{$TABLE_PREFIX}uploads`\n";
    $query .= "   SET `order`='".mysql_escape( ++$newOrder )."'\n";
    $query .= " WHERE num       = '$uploadNumber' AND\n";
    $query .= "       tableName = '".mysql_escape($tableName)."' AND\n";
    $query .= "       fieldName = '".mysql_escape($_REQUEST['fieldName'])."' AND\n";
    if      ($_REQUEST['num'])           { $query .= "recordNum     = '".mysql_escape( $_REQUEST['num'] )."'"; }
    else if ($_REQUEST['preSaveTempId']) { $query .= "preSaveTempId = '".mysql_escape( $_REQUEST['preSaveTempId'] )."'"; }
    else                                 { die("No value specified for 'num' or 'preSaveTempId'!"); }
    mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  }

}



function updateCategoryMetadata() {
  global $escapedTableName, $schema;

  if ($schema['menuType'] != 'category') { return; }

  // load categoriesByNum
  $categoriesByNum = array();
  $query = "SELECT * FROM `$escapedTableName` ORDER BY globalOrder";
  $result = mysql_query($query) or die("MySQL Error: " .mysql_error(). "\n");
  while ($row = mysql_fetch_assoc($result)) { $categoriesByNum[ $row['num'] ] = $row; }
  if (is_resource($result)) { mysql_free_result($result); }
  if (empty($categoriesByNum)) { return; }

  // get childNums for each parentNum
  $childNumsOfParentNum = array();
  foreach (array_keys($categoriesByNum) as $num) {
    $parentNum = (int) $categoriesByNum[$num]['parentNum'];
    $childNumsOfParentNum[$parentNum][] = $num;
  }

  // reset order
  _updateCategoryBranch(array(
    'branchParent' => 0,
    'records'      => &$categoriesByNum,
    'childNodes'   => $childNumsOfParentNum,
  ));


  // save new order
  foreach ($categoriesByNum as $num => $category) {
    $query = "UPDATE `$escapedTableName` SET ";
    $query .= "`globalOrder`  = '" .mysql_escape($category['globalOrder']). "', ";
    $query .= "`siblingOrder` = '" .mysql_escape($category['siblingOrder']). "', ";
    $query .= "`depth`        = '" .mysql_escape($category['depth']). "', ";
    $query .= "`lineage`      = '" .mysql_escape($category['lineage']). "', ";
    $query .= "`breadcrumb`   = '" .mysql_escape($category['breadcrumb']). "' ";
    $query .= "WHERE num = '{$category['num']}'";
    mysql_query($query) or die("There was an error updating the category metadata:\n\n". htmlencode(mysql_error()) . "\n");
  }

}

function updateCategoryMetadataDrag() {
  global $escapedTableName, $schema;

  if ($schema['menuType'] != 'category') { return; }

  // load categoriesByNum
  $categoriesByNum = array();
  $query = "SELECT * FROM `$escapedTableName` ORDER BY globalOrder";
  $result = mysql_query($query) or die("MySQL Error: " .mysql_error(). "\n");
  while ($row = mysql_fetch_assoc($result)) { $categoriesByNum[ $row['num'] ] = $row; }
  if (is_resource($result)) { mysql_free_result($result); }
  if (empty($categoriesByNum)) { return; }

  // get childNums for each parentNum
  $childNumsOfParentNum = array();
  foreach (array_keys($categoriesByNum) as $num) {
    $parentNum = (int) $categoriesByNum[$num]['parentNum'];
    $childNumsOfParentNum[$parentNum][] = $num;
  }

  // reset order
  _updateCategoryBranchDrag(array(
    'branchParent' => 0,
    'records'      => &$categoriesByNum,
    'childNodes'   => $childNumsOfParentNum,
  ));


  // save new order
  foreach ($categoriesByNum as $num => $category) {
    $query = "UPDATE `$escapedTableName` SET ";
    $query .= "`parentNum`    = '" .mysql_escape($category['parentNum']). "', ";
    $query .= "`globalOrder`  = '" .mysql_escape($category['globalOrder']). "', ";
    $query .= "`siblingOrder` = '" .mysql_escape($category['siblingOrder']). "', ";
    $query .= "`depth`        = '" .mysql_escape($category['depth']). "', ";
    $query .= "`lineage`      = '" .mysql_escape($category['lineage']). "', ";
    $query .= "`breadcrumb`   = '" .mysql_escape($category['breadcrumb']). "' ";
    $query .= "WHERE num = '{$category['num']}'";
    mysql_query($query) or die("There was an error updating the category metadata:\n\n". htmlencode(mysql_error()) . "\n");
  }

}

function _updateCategoryBranch($args) {

  ## set defaults
  if (!@$args['globalOrder']) { $args['globalOrder'] = 0; }
  if (!@$args['depth'])       { $args['depth']       = 0; }
  if (!@$args['lineage'])     { $args['lineage']     = ":"; }

  # sort branch children
  $sortedChildren = array();
  foreach ($args['childNodes'][ $args['branchParent'] ] as $childNum) {
    $sortedChildren[$childNum] = &$args['records'][$childNum];
  }
  uasort($sortedChildren, '_sortCategoriesBySiblingOrder');

  # loop over branch children
  $siblingOrder = 0;
  foreach (array_keys($sortedChildren) as $childNum) {
    $childRecord = &$args['records'][$childNum];

    $childRecord['globalOrder']  = ++$args['globalOrder'];
    $childRecord['siblingOrder'] = ++$siblingOrder;
    $childRecord['depth']        = $args['depth'];
    $childRecord['lineage']      = $args['lineage'] . "$childNum:";
    $childRecord['breadcrumb']   = @$args['breadcrumb'] ? "{$args['breadcrumb']} : {$childRecord['name']}" : $childRecord['name'];

  # if child has children, loop over them
    if (@$args['childNodes'][$childNum]) {
      _updateCategoryBranch(array(
        'branchParent' => $childNum,
        'globalOrder'  => &$args['globalOrder'],
        'records'      => &$args['records'],
        'childNodes'   => $args['childNodes'],
        'depth'        => ($args['depth'] + 1),
        'lineage'      => $childRecord['lineage'],
        'breadcrumb'   => $childRecord['breadcrumb'],
      ));
    }
  }

}

function _updateCategoryBranchDrag($args) {

  ## set defaults
  if (!@$args['globalOrder']) { $args['globalOrder'] = 0; }
  if (!@$args['depth'])       { $args['depth']       = 0; }
  if (!@$args['lineage'])     { $args['lineage']     = ":"; }

  # sort branch children
  $sortedChildren = array();
  foreach ($args['childNodes'][ $args['branchParent'] ] as $childNum) {
    $sortedChildren[$childNum] = &$args['records'][$childNum];
  }
  uasort($sortedChildren, '_sortCategoriesBySiblingOrder');

  # loop over branch children
  $siblingOrder = 0;
  foreach (array_keys($sortedChildren) as $childNum) {
    $childRecord = &$args['records'][$childNum];

    $childRecord['globalOrder']  = ++$args['globalOrder'];
    $childRecord['siblingOrder'] = ++$siblingOrder;
    $childRecord['depth']        = $args['depth'];
    $childRecord['lineage']      = $args['lineage'] . "$childNum:";
    $childRecord['breadcrumb']   = @$args['breadcrumb'] ? "{$args['breadcrumb']} : {$childRecord['name']}" : $childRecord['name'];

  # if child has children, loop over them
    if (@$args['childNodes'][$childNum]) {
      _updateCategoryBranchDrag(array(
        'branchParent' => $childNum,
        'globalOrder'  => &$args['globalOrder'],
        'records'      => &$args['records'],
        'childNodes'   => $args['childNodes'],
        'depth'        => ($args['depth'] + 1),
        'lineage'      => $childRecord['lineage'],
        'breadcrumb'   => $childRecord['breadcrumb'],
      ));
    }
  }
}

// uasort($categoriesByNum, '__sortCategoriesBySiblingOrder');
function _sortCategoriesBySiblingOrder($arrayA, $arrayB) {
  if ($arrayA['siblingOrder'] < $arrayB['siblingOrder']) { return -1; }
  if ($arrayA['siblingOrder'] > $arrayB['siblingOrder']) { return 1; }
  return 0;
}

//
function categoryMove() {
  if (isset($_REQUEST['sourceNum'])) {return categoryMoveDrag();}
  global $tableName, $escapedTableName, $isMyAccountMenu;
  if ($isMyAccountMenu) { die("Access not permitted for My Account menu!"); }

  // load categoriesByNum
  $categoriesByNum = array();
  $query = "SELECT * FROM `$escapedTableName` ORDER BY globalOrder";
  $result = mysql_query($query) or die("MySQL Error: " .mysql_error(). "\n");
  while ($row = mysql_fetch_assoc($result)) {
    $categoriesByNum[ $row['num'] ] = $row;
    $categoriesByNum[ $row['num'] ]['oldSiblingOrder'] = $row['siblingOrder'];
  }
  if (is_resource($result)) { mysql_free_result($result); }

  // update order
  $parentNum = $categoriesByNum[ $_REQUEST['num'] ]['parentNum'];
  foreach (array_keys($categoriesByNum) as $num) {
    $category = &$categoriesByNum[$num];
    if ($category['parentNum'] != $parentNum) { continue; } // only modify siblings on branch
    $category['siblingOrder'] = 2 + ($category['siblingOrder'] * 2); // double space entries
    unset($category);
   }
  if ($_REQUEST['direction'] == 'up')   { $categoriesByNum[ $_REQUEST['num'] ]['siblingOrder'] -= 3; }
  if ($_REQUEST['direction'] == 'down') { $categoriesByNum[ $_REQUEST['num'] ]['siblingOrder'] += 3; }

  // save new order
  foreach ($categoriesByNum as $num => $category) {
    if ($category['oldSiblingOrder'] == $category['siblingOrder']) { continue; } // skip if order didn't change
    $query = "UPDATE `$escapedTableName` SET ";
    $query .= "`siblingOrder` = '" .mysql_escape($category['siblingOrder']). "' ";
    $query .= "WHERE num = '{$category['num']}'";
    mysql_query($query) or die("There was an error updating the category metadata:\n\n". htmlencode(mysql_error()) . "\n");
  }

  // update global order, etc
  updateCategoryMetadata();

  // refresh page
  redirectBrowserToURL("?menu=$tableName");
  exit;
}

//
function categoryMoveDrag(){
  global $tableName, $escapedTableName, $isMyAccountMenu;
  if ($isMyAccountMenu)               { die("Access not permitted for My Account menu!"); }  
  if (!isset($_REQUEST['sourceNum'])) { die('sourceNum not set.'); }
  if (!isset($_REQUEST['targetNum'])) { die('targetNum not set.'); }
  if (!isset($_REQUEST['position']))  { die('position not set.'); }
  
  $sourceNum = $_REQUEST['sourceNum'];
  $targetNum = $_REQUEST['targetNum'];
  $position  = $_REQUEST['position'];

  if (!is_numeric($sourceNum) || !is_numeric($targetNum)){
    redirectBrowserToURL("?menu=$tableName");
    exit;
  }

  // load categoriesByNum
  $categoriesByNum = array();
  $query = "SELECT * FROM `$escapedTableName` ORDER BY globalOrder";
  $result = mysql_query($query) or die("MySQL Error: " .mysql_error(). "\n");
  while ($row = mysql_fetch_assoc($result)) {
    $categoriesByNum[ $row['num'] ] = $row;
    $categoriesByNum[ $row['num'] ]['oldSiblingOrder'] = $row['siblingOrder'];
  }
  if (is_resource($result)) { mysql_free_result($result); }

  // update order
  $parentNum = $position == 'child' ? $targetNum : $categoriesByNum[$targetNum]['parentNum'];
  
  // Source cannot be made a child of its decendent.  
  $currParentNum = $categoriesByNum[$targetNum]['parentNum'];
  while ($currParentNum){
    if ($currParentNum == $sourceNum){
      redirectBrowserToURL("?menu=$tableName");
      exit;
    }
    $currParentNum = $categoriesByNum[$currParentNum]['parentNum'];  
  }  
  
  $categoriesByNum[$sourceNum]['parentNum'] = $parentNum;
  foreach (array_keys($categoriesByNum) as $num) {
    $category = &$categoriesByNum[$num];
    if ($category['parentNum'] != $parentNum) { continue; } // only modify siblings on branch
    $category['siblingOrder'] = 2 + ($category['siblingOrder'] * 2); // double space entries
    unset($category);
   }

//showme($categoriesByNum[$sourceNum]);
//showme($categoriesByNum[$targetNum]);

  if ($position == 'child'){
    $categoriesByNum[$sourceNum]['siblingOrder'] = 1; // if adding as child, default to first sibling
  }
  else if ($position == 'above'){
    $categoriesByNum[$sourceNum]['siblingOrder'] = $categoriesByNum[$targetNum]['siblingOrder'] - 1;
  }
  else if ($position == 'below'){
    $categoriesByNum[$sourceNum]['siblingOrder'] = $categoriesByNum[$targetNum]['siblingOrder'] + 1;
  }  
  
//showme($categoriesByNum[$sourceNum]);
//showme($categoriesByNum[$targetNum]);


  // save new sibling order
  foreach ($categoriesByNum as $num => $category) {
    if ($category['oldSiblingOrder'] == $category['siblingOrder']) { continue; } // skip if order didn't change
    $query = "UPDATE `$escapedTableName` SET ";
    $query .= "`siblingOrder` = '" .mysql_escape($category['siblingOrder']). "' ";
    $query .= "WHERE num = '{$category['num']}'";
//showme($query);
    mysql_query($query) or die("There was an error updating the category metadata:\n\n". htmlencode(mysql_error()) . "\n");
  }


//exit;
  // save new parent
  $query = "UPDATE `$escapedTableName` SET ";
  $query .= "`parentNum` = '" .mysql_escape($parentNum). "' ";
  $query .= "WHERE num = '{$sourceNum}'";
  mysql_query($query) or die("There was an error updating the category metadata:\n\n". htmlencode(mysql_error()) . "\n");
    
  // update global order, etc
  updateCategoryMetadataDrag();

  // refresh page
  redirectBrowserToURL("?menu=$tableName");
  exit;
}
