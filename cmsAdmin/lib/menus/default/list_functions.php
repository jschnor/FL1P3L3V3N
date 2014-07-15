<?php

// accepted options: isRelatedRecords, tableName, where
function list_functions_init($options = array()) {
  global $CURRENT_USER;
  // set defaults
  $isRelatedRecords = @$options['isRelatedRecords'];
  $tableName      = @$options['tableName']      ? $options['tableName']              : $GLOBALS['tableName'];
  $schema         = @$options['tableName']      ? loadSchema(@$options['tableName']) : $GLOBALS['schema'];
  $accessWhere    = @$options['where']          ? $options['where']                  : 'true';
  $perPage        = @$options['perPage'];

  // Perform search

  // if the search form was submitted, we need to reset page=1
  if (@$_REQUEST['_defaultAction']) {
    $_REQUEST['page'] = 1;
  }

  // Reset Search (and clear saved editor state)
  if (@$_REQUEST['_resetSearch'] || @$_REQUEST['_resetSavedSearch']) { // clear last state and request on resetSearch.  _resetSavedSearch is for custom links where you don't want previously saved search info to interfere
    $_SESSION['lastRequest'][$tableName] = array( // don't reset these values
      'showAdvancedSearch' => @$_SESSION['lastRequest'][$tableName]['showAdvancedSearch'],
      'perPage'            => @$_SESSION['lastRequest'][$tableName]['perPage'],
      'page'               => 1,
    );
  }
  if (@$_REQUEST['_resetSearch']) { // clear last state and request on resetSearch
    $_REQUEST = array( // don't reset these values
      'menu'    => @$_REQUEST['menu'],
      'perPage' => @$_REQUEST['perPage'],
      'page'    => 1,
    );
  }

  // Load last _REQUEST from _SESSION (current _REQUEST values override old ones)
  if (@$_SESSION['lastRequest'][$tableName] && !$isRelatedRecords && !@$_REQUEST['_ignoreSavedSearch']) {
    $sortByField        = @$_SESSION['lastRequest'][$tableName]['sortBy'];
    $invalidSortByField = $sortByField && !@$schema[$sortByField];
    if ($invalidSortByField) { unset($_SESSION['lastRequest'][$tableName]['sortBy']); } // v2.52 remove invalid sort by fields
    $_REQUEST += $_SESSION['lastRequest'][$tableName];
  };

  // get user where (to limit to records user has access to)
  $showAllRecords = false;
  if     (!@$schema['createdByUserNum'])        { $showAllRecords = true; } // can't filter by user if no createdByUserNum field exists
  elseif ($GLOBALS['hasEditorAccess'])          { $showAllRecords = true; } // editors can see all records
  elseif ($GLOBALS['hasViewerAccessOnly'])      { $showAllRecords = true; } // viewers can see all records
  elseif ($GLOBALS['hasAuthorViewerAccess'])    { $showAllRecords = true; } // viewers can see all records

  if (!$showAllRecords) {
    $accessWhere = "($accessWhere) AND `createdByUserNum` = '{$CURRENT_USER['num']}'";
  }
  if ($tableName == 'accounts' && !@$CURRENT_USER['isAdmin']) { $accessWhere = "($accessWhere) AND `isAdmin` = '0'"; }

  // get ORDER BY
  $orderBy = $schema['listPageOrder'];
  if (@$_REQUEST['sortBy']) {
    if (!@$schema[$_REQUEST['sortBy']]) { die("Can't sortBy '" .htmlencode($_REQUEST['sortBy']). "'.  Not a valid field!"); }
    $orderBy = "`{$_REQUEST['sortBy']}` ";
    if (@$_REQUEST['sortDir'] == 'desc') { $orderBy .= " DESC"; }
  }

  // $accessWhere -  This is for access control, records filtered out here aren't included in the record count (Total Record: 123)
  $accessWhere = applyFilters('list_where',          $accessWhere, $tableName); // This is for searching, records filtered out here _are_ included in the record count (Total Record: 123)
  $accessWhere = applyFilters('record_access_where', $accessWhere, $tableName); // same as above, but this filter is also called in _displayRecordAccessErrors()
  $orderBy     = applyFilters('list_orderBy',        $orderBy,     $tableName); // This is for modifying the orderBy option
  $searchWhere = $accessWhere;

  // load records
  list($records, $metaData) = getRecords(array(
    'tableName'               => $tableName,
    'perPage'                 => $isRelatedRecords ? $perPage : getFirstDefinedValue( @$_REQUEST['perPage'], @$schema['_perPageDefault'], 25 ),
    'pageNum'                 => $isRelatedRecords ? 1        : @$_REQUEST['page'],
    'orderBy'                 => $orderBy,
    'where'                   => $searchWhere,

    'allowSearch'             => $isRelatedRecords ? false : true,
    'requireSearchSuffix'     => 'true',

    'ignoreHidden'            => true,
    'ignorePublishDate'       => true,
    'ignoreRemoveDate'        => true,
    'includeDisabledAccounts' => true,

    'loadPseudoFields'        => false,

    //'debugSql'          => true,
  ));
  $metaData['totalMatches'] = $metaData['totalRecords'];
  $metaData['totalRecords'] = mysql_count($tableName, $accessWhere);

  // save _REQUEST to _SESSION (this is how we maintain state when user returns to list page)
  if (!$isRelatedRecords) {
    $skipFields = array('menu');
    foreach ($_REQUEST as $key => $value) { // save all submitted values
      if (preg_match('/^_/', $key)) { continue; }    // skip program command fields: _defaultAction, _advancedAction, etc
      if (in_array($key, $skipFields)) { continue; } //
      $_SESSION['lastRequest'][$tableName][$key] = $value;
    }
    $_SESSION['lastRequest'][$tableName]['page']    = $metaData['page'];     // override page with calculated actual page from getRecords()
    $_SESSION['lastRequest'][$tableName]['perPage'] = $metaData['perPage'];  // override perPage with actual perPage from getRecords()
  }

  //
  $listFields = preg_split("/\s*,\s*/", $schema['listPageFields']);  // fields to show on list page

  return array($listFields, $records, $metaData);

}

//
function showListTable($listFields, $records, $options = array()) {
  global $tableName, $schema;

?>

  <table cellspacing="0" class="data sortable">
   <input type='hidden' name='_tableName' class='_tableName'  value='<?php echo htmlencode($tableName) ?>' />
   <thead>
   <tr class="nodrag nodrop">
     <?php displayColumnHeaders($listFields, @$options['isRelatedRecords']); ?>
   </tr>
   </thead>

  <?php
    foreach ($records as $record) {
      $trStyle = applyFilters('listRow_trStyle', '', $tableName, $record);
      
      $trClass = (@$trClass == "listRowEven") ? 'listRowOdd' : 'listRowEven'; # rotate bgclass
      $trClass .= ' draggable droppable';
      if (@$schema['menuType'] == 'category') {  // v2.60 add CSS classes with category data for filtering categories with jquery.  
        $trClass .= ' category_row';
        $trClass .= ' category_num_'    . $record['num'];
        $trClass .= ' category_parent_' . $record['parentNum'];
        $trClass .= ' category_depth_'  . $record['depth'];
        $trClass .= ' category_lineage' . str_replace(':','_',$record['lineage']); // eg: lineage_6_13_14_
      }
      $trClass = applyFilters('listRow_trClass', $trClass, $tableName, $record); // v2.60
      
      print "<tr class='$trClass' style='$trStyle'>\n";
      displayListColumns($listFields, $record, $options);
      print "</tr>\n";
    }
  ?>

  <?php if (count($records) == 0):
    $listFieldCount = count($listFields) + 3; // for checkbox, modify, and erase
    if (@$schema['menuType'] == 'category') { $listFieldCount++; } // for extra order field
  ?>
    <tr>
     <td class="listRowOdd listRowNoResults" colspan="<?php echo $listFieldCount ?>">
     <?php if (!@$_REQUEST['search']): ?>  <?php et('Sorry, no records were found!') ?>  <?php endif ?>
     <?php if (@$_REQUEST['search']): ?>  <?php et('Sorry, the <b>search</b> returned no results!') ?> <?php endif ?>
     </td>
    </tr>
  <?php endif ?>
  </table>

<?php
}

// redirect authors with single record limit to edit page
function redirectSingleRecordAuthorsToEditPage() {
  global $CURRENT_USER, $hasEditorAccess, $hasAuthorAccess, $hasAuthorViewerAccess, $schema, $tableName, $escapedTableName;

  $isAuthorOnly         = !$CURRENT_USER['isAdmin'] && !$hasEditorAccess && !$hasAuthorViewerAccess && $hasAuthorAccess;
  $onlyAllowedOneRecord = (@$schema['_maxRecordsPerUser'] == 1 || @$CURRENT_USER['accessList'][$tableName]['maxRecords'] == 1);

  if ($isAuthorOnly && $onlyAllowedOneRecord) {
    $query = "SELECT * FROM `$escapedTableName` WHERE createdByUserNum = '{$CURRENT_USER['num']}' LIMIT 1";
    $record = mysql_get_query($query);

    $_REQUEST['num'] = $record['num'];  // fake the record num being requested
    showInterface('default/edit.php', false);
  }

}

//
function getSearchFieldLabelsAndHTML() {
  global $schema, $tableName;
  $searchFieldLabelsAndHtml = array();

  // display search fields
  $searchRows = _parseSearchFieldsFormat( $schema['listPageSearchFields'] );

  foreach ($searchRows as $searchRow) {
    list($label, $fieldnames, $displayAs, $searchFieldSuffix) = $searchRow;
    
    $isMulti = false;
    if (count($fieldnames) === 1 && preg_match('/^\w+\[\]$/', $fieldnames[0])) {
      $fieldnames[0] = trim(@$fieldnames[0], '[]');
      $isMulti = true;
    }
    
    $fieldsAsCSV = join(',', $fieldnames);
    $name        = "{$fieldsAsCSV}_$searchFieldSuffix";
    $lastValue   = @$_REQUEST[$name];

    // get fieldschema for single field searches:
    $fieldSchema   = @$schema[ $fieldnames[0] ];
    if ($fieldSchema) { $fieldSchema['name'] = $fieldnames[0]; }

    // special case: add createdBy.fieldname search functionality
    if (preg_match("/^createdBy\.(.*?)$/i", $fieldsAsCSV, $matches)) {
      $name        = 'createdByUserNum_match';
      $lastValue   = @$_REQUEST[$name];
      $displayAs   = 'dropdown';
      $fieldSchema = array(
        'name'              => '_not_used_',
        'optionsType'       => 'table',
        'optionsTablename'  => 'accounts',
        'optionsValueField' => 'num',
        'optionsLabelField' => $matches[1],
      );
    }

    // generate html
    $html = '';
    if ($displayAs == 'textfield') {
      $html        .= "<input class='text-input' type='text' name='$name' value='" .htmlencode($lastValue). "' size='30' />";
    }

    else if ($displayAs == 'checkbox') {
      $checkedValue   = getFirstDefinedValue( @$fieldSchema['checkedValue'],   t('Checked') );
      $uncheckedValue = getFirstDefinedValue( @$fieldSchema['uncheckedValue'], t('Unchecked') );

      $optionValues   = array('1', '0');
      $optionLabels   = array($checkedValue, $uncheckedValue);
      $optionsHTML    = getSelectOptions($lastValue, $optionValues, $optionLabels, false);
      $html        .= "<select name='$name'>";
      $html        .= "<option value=''>" .htmlencode(t("<any>")). "</option>\n";
      $html        .= $optionsHTML;
      $html        .= "</select>";
    }
    else if ($displayAs == 'dropdown') {
      $optionsHTML  = getSelectOptionsFromSchema($lastValue, $fieldSchema, false);
      if ($isMulti) { $html .= "<select name='{$name}[]' multiple>"; }
      else          { $html .= "<select name='$name'>"; }
      $html        .= "<option value=''>" .htmlencode(t("<any>")). "</option>\n";
      $html        .= $optionsHTML;
      $html        .= "</select>";
    }
    else if ($displayAs == 'custom') {
      $functionName = $searchFieldSuffix;
      if (!function_exists($functionName)) { die("Search function '" . htmlencode($functionName). "' doesn't exist!<br/>Check: Admin &gt; Section Editors &gt; Search &gt; Search Fields"); }
      $html        .= call_user_func($functionName);
      if (!$html) { continue; } // return nothing from function to not display search field
    }
    else { die("Unknown search field type '" .htmlencode($displayAs). "'!"); }

    // add instructions for date search fields
    if (@$fieldSchema['type'] == 'date' && count($fieldnames) == 1) {
      $html .= ' ';
      $html .= t('Format:');
      $html .= ' YYYY-MM-DD ';
      if (@$fieldSchema['showTime']) { $html .= ' HH:MM:SS '; }

      // custom datepicker code - this is only called is jqueryUI datepicker is loaded
      $jsDateFormat = @$fieldSchema['showTime'] ? "yy-mm-dd 00:00:00" : "yy-mm-dd";
      $html .= <<<__HTML__
        <script type='text/javascript'><!--
          $(function() {
            if ($.datepicker != undefined) {
              $('[name={$name}]').datepicker({
                showOn: 'button',
                buttonImage: '3rdParty/jqueryUI/calendar.gif',
                buttonImageOnly: true,
                dateFormat: '$jsDateFormat'
              });
            }
          });
        //--></script>
__HTML__;
    }

    //
    $searchFieldLabelsAndHtml[] = array($label, $html);
  }

  //
  return $searchFieldLabelsAndHtml;

}

// $searchRows = _parseSearchFieldsFormat( $schema['listPageSearchFields'] );
// parse the format entered in $schema['listPageSearchFields'] and return as array of
// arrays with (label, fieldNames, searchFieldType)
function _parseSearchFieldsFormat($searchFieldsFormat) {
  global $schema;

  // Example search formats:

  // fieldsAsCSV                                     // search query on fieldsAsCSV fields
  // label|fieldsAsCSV                               // as above but with label displayed in front of search fields
  // label|fieldsAsCSV|searchFieldSuffix             // as above but using searchType defined by searchFieldSuffix, eg: match, query, etc (see search docs)
  // label|fieldsAsCSV|searchFieldSuffix|displayedAs // (undocumented) as above but using searchType defined by searchFieldSuffix, eg: match, query, etc (see search docs)
  // label||custom|functionName                      // (undocumented) display label and call custom function functionName() to generate search input field.

  // NOTE: If "_all_" is found in fieldsAsCSV then all fields are searched

  //
  $searchRows = array();
  $rowFormats = preg_split("/\r?\n/", $searchFieldsFormat, -1, PREG_SPLIT_NO_EMPTY); // 2.17 remove \r chars if they're specified
  foreach ($rowFormats as $rowFormat) { // format is: field, field, field _OR_ label|fieldList
    $values = preg_split("/\|/", $rowFormat);
    if (count($values) <= 1) { @list($label, $fieldsAsCSV, $searchType, $displayAs) = array( t('Search'), $values[0], 'query', ''); }
    else                     { @list($label, $fieldsAsCSV, $searchType, $displayAs) = $values; }

    if (preg_match("/\b_all_\b/i", $fieldsAsCSV)) { $fieldsAsCSV = __getAllSearchableFieldsAsCSV($schema); }
    if (!$searchType) { $searchType = 'query'; }

    $fieldsAsCSV = preg_replace('/\s*/', '', $fieldsAsCSV);
    $fieldnames  = preg_split("/,/", $fieldsAsCSV, -1, PREG_SPLIT_NO_EMPTY);

    // figure out "displayAs" search field type
    if (!$displayAs) {
      $displayAs = 'textfield'; // default search field type

      if (count($fieldnames) == 1) { // if single field
        $fieldName   = $fieldnames[0];
        $fieldSchema = @$schema[ trim($fieldName, '[]') ];
        if      ($fieldName           == 'hidden')   { $displayAs = 'checkbox'; }
        else if ($fieldSchema['type'] == 'checkbox') { $displayAs = 'checkbox'; }
        else if ($fieldSchema['type'] == 'list')     { $displayAs = 'dropdown'; }
      }
    }

    //
    $searchRows[] = array($label, $fieldnames, $displayAs, $searchType);
  }

  //
  return $searchRows;
}

// get schema fieldlist for _all_ fields wildcard
function __getAllSearchableFieldsAsCSV(&$schema) {

  $allSearchableFieldsAsCSV = '';
  $skippedFieldTypes        = array('','upload','separator','relatedRecords','none','accessList');

  foreach ($schema as $name => $fieldSchema) {
    if (!is_array($fieldSchema)) { continue; }  // only fields have arrays as values, other values are table metadata
    if (in_array(@$fieldSchema['type'], $skippedFieldTypes)) { continue; }
    $allSearchableFieldsAsCSV .= "$name,";
  }
  $allSearchableFieldsAsCSV = chop($allSearchableFieldsAsCSV, ',');

  //
  return $allSearchableFieldsAsCSV;
}


//
function displayColumnHeaders($listFields, $isRelatedRecords = false) {
  global $schema, $ACCOUNT_SCHEMA, $tableName;

  // checkboxes - for "Advanced Commands" pulldown
  if (!$isRelatedRecords) {
    print "<th width='1' style='padding: 0; text-align:center'>";
    if (@$schema['num']) {
      $html = "<input type='checkbox' name='null' value='1' onclick='toggleCheckboxes(this.checked)'/>";
      $html = applyFilters('listHeader_checkAll', $html, $tableName);
      print $html;
    }
    print "</th>\n";
  }

  // category sections - add up/down sorting links and drag column
  if (!$isRelatedRecords) {
    $showCategorySort = (@$schema['menuType'] == 'category');
    if ($showCategorySort) {
      print "<th style='text-align:center' width='40'>" .t('Drag'). "</th>\n";
    }
  }

  // show column headers
  foreach ($listFields as $fieldnameWithSuffix) {
    @list($fieldname,$suffix) = explode(":", $fieldnameWithSuffix); // to support fieldname:label
    if (empty($fieldname)) { continue; }

    $thAttrs = '';
    $label   = _getFieldLabel($fieldname);

    // drag sort fields
    if ($fieldname == 'dragSortOrder') {
      $hasViewerAccessOnly = (userSectionAccess($tableName) == 3);
      if ($isRelatedRecords && !@$GLOBALS['SETTINGS']['advanced']['allowRelatedRecordsDragSorting']) { continue; }
      if (!userHasFieldAccess($schema[$fieldname])) { continue; } // skip fields that the user has no access to
      if ($hasViewerAccessOnly) { continue; }
      $thAttrs = "width='40' style='text-align:center'";
      $label = t('Drag');
    }

    else {

      // create sort links
      $sortingArrow    = '';
      $isSortableField = @$schema[$fieldname] && @$schema[$fieldname]['type'] != 'upload'; // don't allow sorting on upload or createBy.* fields
      if ($isSortableField && !$isRelatedRecords) {
        $nextDir   = 'asc';
        $sortField = $fieldname;
        if (@$_REQUEST['sortBy'] == $fieldname) { // if sorting by field

          if      (@$_REQUEST['sortDir'] == 'asc')  { $nextDir = 'desc'; $sortImage = 'sortUp.gif';   }
          else if (@$_REQUEST['sortDir'] == 'desc') { $nextDir = '';     $sortImage = 'sortDown.gif'; $sortField = ''; }

          $sortingArrow = "<div style='float:right; border:0px; padding: 0px;'><img src='lib/images/$sortImage' width='17' height='11' border='0'></div>";
        }
        $thAttrs = "onclick='window.location=\"?menu=$tableName&amp;sortBy=$sortField&amp;sortDir=$nextDir\"'";
        $label   = "$sortingArrow<u style='cursor: pointer'>$label<!-- --></u>";
      }

    }

    $label   = applyFilters('listHeader_displayLabel', $label, $tableName, $fieldname);
    $thAttrs = applyFilters('listHeader_thAttributes', $thAttrs, $tableName, $fieldname);

    // display all other fields
    print "<th $thAttrs>$label</th>\n";
  }

  //
  print "<th style='padding: 0px; text-align: center'>" .t('Action'). "</th>\n";

}


// return field label for fieldname in format: articles.title, title, createdBy.username
function _getFieldLabel($fullFieldname) {
  @list($fieldname, $tableName) = array_reverse(explode('.', $fullFieldname));



  // get schema
  $schema = array();
  if  (!$tableName && $GLOBALS['schema']) {
    $schema = &$GLOBALS['schema'];
  }
  else {
    if ($tableName == 'createdBy') { $tableName = 'accounts'; } // workaround for legacy 'createdBy.fieldname' fieldnames
    $schema = loadSchema($tableName);
  }

  // get label
  $label = @$schema[$fieldname]['label'];
  return $label;
}

//
function displayListColumns($listFields, $record, $options = array()) {
  global $CURRENT_USER, $tableName, $schema;

  $showView   = @$options['isRelatedRecords'] ? @$options['showView']   : !@$schema['_disableView'];
  $showModify = @$options['isRelatedRecords'] ? @$options['showModify'] : !@$schema['_disableModify'];
  $showErase  = @$options['isRelatedRecords'] ? @$options['showErase']  : !@$schema['_disableErase'];

  $hasAuthorViewerAccessOnly = (userSectionAccess($tableName) == 7);
  $hasViewerAccessOnly       = (userSectionAccess($tableName) == 3);

  // remove modify/erase for users with view only access -OR- with Author/Viewer access who don't own the record
  if ($hasViewerAccessOnly)       { $showModify = false; $showErase = false; }
  if ($hasAuthorViewerAccessOnly) {
    $showModify = $showModify && ($record['createdByUserNum'] && $record['createdByUserNum'] == $CURRENT_USER['num']);
    $showErase  = $showErase  && ($record['createdByUserNum'] && $record['createdByUserNum'] == $CURRENT_USER['num']);
  }

  // checkboxes - for "Advanced Commands" pulldown
  if (!@$options['isRelatedRecords']) {
    print "<td>";
    if (@$schema['num']) {
      print "<input type='checkbox' name='selectedRecords[]' value='{$record['num']}' class='selectRecordCheckbox' />";
    }
    print "</td>\n";
  }

  // category sections - add up/down sorting links and drag field
  if (@$schema['menuType'] == 'category' && !@$options['isRelatedRecords']) {
    $upLink = "?menu=" .htmlencode($tableName). "&amp;_action=categoryMove&amp;direction=up&amp;num={$record['num']}";
    $dnLink = "?menu=" .htmlencode($tableName). "&amp;_action=categoryMove&amp;direction=down&amp;num={$record['num']}";

    //
    print "<td class='dragger'>";
    print   "<img src='lib/images/drag.gif' height='6' width='19' title='" .t('Click and drag to change order.'). "' alt='' />";
    print   "<a href='$upLink'><!-- ".t('UP').' --></a>';
    print   "<a href='$dnLink'><!-- ".t('DN').' --></a>';
    print "</td>";
  }

  // display all other fields
  foreach ($listFields as $fieldnameWithSuffix) {
    @list($fieldname,$suffix) = explode(":", $fieldnameWithSuffix); // to support fieldname:label

    if ($fieldnameWithSuffix == 'dragSortOrder') {
      if (@$options['isRelatedRecords'] && !@$GLOBALS['SETTINGS']['advanced']['allowRelatedRecordsDragSorting']) { continue; }
      if ($hasViewerAccessOnly) { continue; }
      if (!userHasFieldAccess($schema[$fieldname])) { continue; } // skip fields that the user has no access to
    }

    list($displayValue, $tdAttributes) = _getColumnDisplayValueAndAttributes($fieldname, $record);
    $displayValue = applyFilters('listRow_displayValue', $displayValue, $tableName, $fieldname, $record);
    $tdAttributes = applyFilters('listRow_tdAttributes', $tdAttributes, $tableName, $fieldname, $record);
    print "<td $tdAttributes>$displayValue</td>\n";
  }

  ### display actions
  $actionLinks = '';

  // view
  if ($showView) {
    $viewLink     = '?menu=' .htmlencode($tableName). "&amp;action=view&amp;num=" . @$record['num'];
    if (@$options['isRelatedRecords']) { $viewLink .= "&amp;returnUrl=". urlencode('?'.$_SERVER['QUERY_STRING']); }
    $actionLinks .= "<a href='$viewLink'>" .t('view'). "</a>\n";
  }

  // modify
  if ($showModify) {
    $modifyLink   = '?menu=' .htmlencode($tableName). "&amp;action=edit&amp;num=" . @$record['num'];
    if (@$options['isRelatedRecords']) { $modifyLink .= "&amp;returnUrl=". urlencode('?'.$_SERVER['QUERY_STRING']); }
    $actionLinks .= "<a href='$modifyLink'>" .t('modify'). "</a>\n";
  }

  // erase
  if ($showErase) {
    $returnArg = @$options['isRelatedRecords'] ? (',' . htmlencode(json_encode('?'.urlencode($_SERVER['QUERY_STRING'])))) : '';
    $disableErase = ($tableName == 'accounts' && $CURRENT_USER['num'] == $record['num']);
    $eraseLink    = "javascript:confirmEraseRecord('" .htmlencode($tableName). "','" .@$record['num']. "'$returnArg);";
    if ($disableErase)    { $actionLinks .= "<span class='disabled'>" .t('erase'). "</span>\n"; }
    else                  { $actionLinks .= "<a href=\"$eraseLink\">"   .t('erase'). "</a>\n"; }
  }

  //
  $actionLinks = applyFilters('listRow_actionLinks', $actionLinks, $tableName, $record);

  // show erase link
  print "<td class='listActions'>$actionLinks</td>";

}

//
function _getColumnDisplayValueAndAttributes($fieldname, &$record) {
  global $schema, $tableName;
  $fieldValue  = @$record[$fieldname];
  $fieldSchema = @$schema[ $fieldname ];
  if ($fieldSchema) { $fieldSchema['name'] = $fieldname; }

  // default display value and attribute
  if (!is_array($fieldValue)) { $fieldValue = htmlencode($fieldValue); }
  $displayValue = $fieldValue;

  $tdAttributes = "style='text-align:left'";

  // date fields
  $isSpecialDatefield = in_array($fieldname, array('createdDate', 'updatedDate'));
  if (@$fieldSchema['type'] == 'date' || $isSpecialDatefield) {
    
    $showSeconds = @$fieldSchema['showSeconds'];
    $showTime    = @$fieldSchema['showTime'];
    $use24Hour   = @$fieldSchema['use24HourFormat'];
    
    // settings for createdDate and updatedDate
    if ($isSpecialDatefield) {
      $showSeconds = true;
      $showTime    = true;
      $use24Hour   = true;
    }
    
    $secondsFormat = '';
    if ($showSeconds) { $secondsFormat = ':s'; }
    
    $timeFormat = '';
    if ($showTime) {
      if ($use24Hour) { $timeFormat = " - H:i$secondsFormat"; }
      else            { $timeFormat = " - h:i$secondsFormat A"; }
    }
    
    $dateFormat    = '';
    $dayMonthOrder = @$GLOBALS['SETTINGS']['dateFormat'];
    if     ($dayMonthOrder == 'dmy') { $dateFormat = "jS M, Y" . $timeFormat; }
    elseif ($dayMonthOrder == 'mdy') { $dateFormat = "M jS, Y" . $timeFormat; }
    else                             { $dateFormat = "Y-m-d"   . $timeFormat; }
    
    $displayValue = date($dateFormat, strtotime($fieldValue));
    if (!$fieldValue || $fieldValue == '0000-00-00 00:00:00') { $displayValue = ''; }
  }

  // dragSortOrder fields
  if ($fieldname == 'dragSortOrder') {
    if (!userHasFieldAccess($schema[$fieldname])) { return; } // skip fields that the user has no access to

    $tdAttributes  = "class='dragger'";
    $displayValue  = "<input type='hidden' name='_recordNum' value='{$record['num']}' class='_recordNum' />";
    $displayValue .= "<img src='lib/images/drag.gif' height='6' width='19' class='dragger' title='" .t('Click and drag to change order.'). "' alt='' /><br/>";
  }

  // Category Section: name fields - pad category names to their depth
  $isCategorySection = @$schema['menuType'] == 'category' && $fieldname == 'name';
  if ($isCategorySection) {
    $depth = @$record["depth"];
    $parentNum = @$record["parentNum"];
    //$displayValue  = "<input type='hidden' name='_recordNum' value='{$record['num']}' class='_recordNum' />";
    //$displayValue .= "<input type='hidden' value='$fieldValue' class='_categoryName' />";
    //$displayValue .= "<input type='hidden' value='$depth' class='_categoryDepth' />";
      $displayValue = "<input type='hidden' value='$parentNum' class='_categoryParent' />";
    //$displayValue .= "<img style='float:left' src='lib/images/drag.gif' height='6' width='19' class='dragHandle' title='" .
    //                t('Click and drag to change order.').
    //                "' alt='' />";
    if (@$record['depth']){
      $padding      = str_repeat("&nbsp; &nbsp; &nbsp;", @$record['depth']);
      $displayValue .= $padding . ' - ';
    }
    $displayValue .= $fieldValue;
  }

  // display first thumbnail for upload fields
  if (@$fieldSchema['type'] == 'upload') {
    $displayValue  = '';
    $upload = @$record[$fieldname][0];
    if ($upload) {
      ob_start();
      showUploadPreview($upload, 50);
      $displayValue = ob_get_clean();
    }
  }

  // display labels for list fields
  #if (@$fieldSchema['type'] == 'list' && $suffix == 'label') { // require ":label" field suffix in future to show labels, just do it automatic for now though.
  if (@$fieldSchema['type'] == 'list') {
    $displayValue = _getListOptionLabelByValue($fieldSchema, $record);
  }

  // display labels for checkboxes
  if (@$fieldSchema['type'] == 'checkbox') {
    if (@$fieldSchema['checkedValue'] || @$fieldSchema['uncheckedValue']) {
      $displayValue = $fieldValue ? @$fieldSchema['checkedValue'] : @$fieldSchema['uncheckedValue'];
    }
  }

  // v2.50 - display formatted textbox content
  if (@$fieldSchema['type'] == 'textbox') {
    if ($fieldSchema['autoFormat']) {
      $displayValue = @$record[$fieldname]; // overwrite previous htmlencoded value
      $displayValue = preg_replace("/<br\s*\/?>\r?\n/", "\n", $displayValue);  // remove autoformat break tags
      $displayValue = htmlencode($displayValue); // html encode content
    }
    $displayValue = nl2br($displayValue); // re-add break tags after nextlines
  }

  // return display value
  return array($displayValue, $tdAttributes);
}

//
function _getListOptionLabelByValue($fieldSchema, $record) {
  global $TABLE_PREFIX, $tableName;

  $fieldname  = $fieldSchema['name'];
  $fieldValue = @$record[ @$fieldname ];
  $output     = '';

  // build value to label map
  $listOptions = getListOptionsFromSchema($fieldSchema, $record);
  $valuesToLabels = array();
  foreach ($listOptions as $valueAndLabel) {
    list($value, $label) = $valueAndLabel;
    $valuesToLabels[$value] = $label;
  }

  // if this is a multi-value list field, look up each value and comma separate them
  if (@$fieldSchema['listType'] == 'checkboxes' || @$fieldSchema['listType'] == 'pulldownMulti') {
    $labels = array();
    foreach ( preg_split('/\t/', trim($fieldValue)) as $value ) {
      $labels[] = @$valuesToLabels[$value] ? $valuesToLabels[$value] : $value; // if lookup fails, use value
    }
    return join(', ', $labels);
  }
  // if this is a single-value list field, look up our single value
  else {
    return array_key_exists($fieldValue, $valuesToLabels) ? $valuesToLabels[$fieldValue] : $fieldValue; // if lookup fails, use value
  }
}



?>
