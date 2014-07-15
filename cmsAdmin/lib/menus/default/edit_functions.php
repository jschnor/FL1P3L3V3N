<?php

//
function showFields($record) {
  global $schema, $escapedTableName, $CURRENT_USER, $tableName, $menu, $isMyAccountMenu;

  $record = &$GLOBALS['RECORD'];

  // copy global schema state, so that if changed (i.e. by _showrelatedRecords), we can restore it
  $active_menu = $menu; $active_tableName = $tableName; $active_schema = $schema;

  // load schema columns
  _showCreatedUpdated($schema, $record);
  foreach ($active_schema as $name => $fieldHash) {
    if (!is_array($fieldHash)) { continue; } // fields are stored as arrays, other entries are table metadata
    $fieldSchema = array('name' => $name) + $fieldHash;
    $fieldSchema = applyFilters('edit_fieldSchema', $fieldSchema, $tableName);

    // special cases: skip fields if:
    if (!userHasFieldAccess($fieldHash)) { continue; }                   // skip fields that the user has no access to
    if ($tableName == 'accounts' && $name == 'isAdmin' && !$CURRENT_USER['isAdmin']) { continue; } // only admin users can set/change "isAdmin" field
    if ($isMyAccountMenu && @!$fieldSchema['myAccountField']) { continue; }                        // only show fields set as 'myAccountField' on My Accounts page

    // allow hooks to override (return false to override)
    if (!applyFilters('edit_show_field', true, $fieldSchema, $record)) { continue; }

    //
    switch (@$fieldHash['type']) {
      case '': case 'none': break;
      case 'textfield':  _showTextfield($fieldSchema, $record); break;
      case 'textbox':    _showTextbox($fieldSchema, $record);   break;
      case 'wysiwyg':    _showWysiwyg($fieldSchema, $record);   break;
      case 'date':       _showDateTime($fieldSchema, $record);  break;
      case 'list':       _showList($fieldSchema, $record);      break;
      case 'checkbox':   _showCheckbox($fieldSchema, $record);  break;
      case 'upload':     _showUpload($fieldSchema, $record);    break;
      case 'separator':  _showSeparator($fieldSchema, $record); break;

      // advanced fields
      case 'relatedRecords': _showrelatedRecords($fieldSchema, $record); break;
      case 'parentCategory': _showParentCategory($fieldSchema, $record, $schema); break;

      // custom fields
      case 'accessList':     _showAccessList($fieldSchema, $record); break;

      case 'dateCalendar':   _showDateCalendar($fieldSchema, $record); break;

      default:              echo "<tr><td colspan='2' align='center'><b>field '$name' has unknown field type '" .@$fieldHash['type']. "'</b></td></tr>";     break;
    }

    // restore global schema state in case any of the above functions (i.e. _showrelatedRecords) modified it
    $menu = $active_menu; $tableName = $active_tableName; $schema = $active_schema;
  }

}

function _showCreatedUpdated($schema, $record) {
  global $CURRENT_USER, $TABLE_PREFIX, $isSingleMenu, $tableName, $SETTINGS;

  // get date format
  if     (@$SETTINGS['dateFormat'] == 'dmy') { $dateFormat  = "jS M, Y - h:i:s A"; }
  elseif (@$SETTINGS['dateFormat'] == 'mdy') { $dateFormat  = "M jS, Y - h:i:s A"; }
  else                                       { $dateFormat  = "M jS, Y - h:i:s A"; }

  // create dates
  $currentDate = date($dateFormat);

  if      (!@$record['createdDate'])                        { $createdDate = $currentDate; } // for new unsaved records
  else if ($record['createdDate'] == '0000-00-00 00:00:00') { $createdDate = ''; } // for records with no previous value
  else                                                      { $createdDate = date($dateFormat, strtotime($record['createdDate'])); }

  if      (!@$record['updatedDate'])                        { $updatedDate = $currentDate; } // for new unsaved records
  else if ($record['updatedDate'] == '0000-00-00 00:00:00') { $updatedDate = ''; } // for records with no previous value
  else                                                      { $updatedDate = date($dateFormat, strtotime($record['updatedDate'])); }

  // get user names
  $usernameField = 'username'; // change this to 'username' to show usernames
  $createdByUsername = t('Unknown');
  $updatedByUsername = t('Unknown');

  if ($record) { // editing record
    $accountTable = $TABLE_PREFIX . "accounts";
    if (@$record['createdByUserNum']) {
      $query  = "SELECT $usernameField FROM `$accountTable` WHERE num = '".mysql_escape($record['createdByUserNum'])."'";
      $result = mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
      list($createdByUsername) = mysql_fetch_row($result);
    }
    if (@$record['updatedByUserNum']) {
      $query  = "SELECT $usernameField FROM `$accountTable` WHERE num = '".mysql_escape($record['updatedByUserNum'])."'";
      $result = mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
      list($updatedByUsername) = mysql_fetch_row($result);
    }
  }
  else { // adding record
    $createdByUsername = $CURRENT_USER[$usernameField];
    $updatedByUsername = $CURRENT_USER[$usernameField];
  }

  // show created
  $html = '';
  $showCreated = @$schema['createdDate'];
  if ($showCreated) {
    $allowChangeLink = ($CURRENT_USER['isAdmin'] || $GLOBALS['hasEditorAccess']);
    $changeLink      = $allowChangeLink ? "<a href='#' id='createdByUserNumChangeLink' onclick='showCreatedByUserPulldown(); return false;'>".t('change')."</a>" : '';
    $displayValue    = $createdDate;
    if (@$schema['createdByUserNum']) {
      $displayValue = sprintf(t("%s (by %s)"), $createdDate, "<span id='createdByUserNumHTML'>$createdByUsername</span>") . " $changeLink";
    }

    $html .= "     <tr>\n";
    $html .= "      <td>{$schema['createdDate']['label']}</td>\n";
    $html .= "      <td>$displayValue</td>\n";
    $html .= "     </tr>\n";
  }

  // show updated
  $showUpdated = @$schema['updatedDate'];
  if ($showUpdated) {
    $displayValue = $updatedDate;
    if (@$schema['updatedByUserNum']) {
      $displayValue = sprintf(t("%s (by %s)"), $updatedDate, $updatedByUsername);
    }

    $html .= "     <tr>\n";
    $html .= "       <td>{$schema['updatedDate']['label']}</td>\n";
    $html .= "       <td>$displayValue</td>\n";
    $html .= "     </tr>\n";
  }

  // add linebreak
  if ($showCreated || $showUpdated) {
    $html .= <<<__HTML__
    <tr>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
__HTML__;
  }

  print $html;

}



//
function _showTextfield($fieldSchema, $record) {
  global $isMyAccountMenu;

  // set field attributes
  $inputType     = @$fieldSchema['isPasswordField'] ? 'password'                                : 'text';
  $maxLengthAttr = @$fieldSchema['maxLength']       ? "maxlength='{$fieldSchema['maxLength']}'" : '';
  $styleWidth    = @$fieldSchema['fieldWidth']      ? "{$fieldSchema['fieldWidth']}px"          : "400px";
  $description   = getEvalOutput( @$fieldSchema['description'] );
  $fieldname     = $fieldSchema['name'];
  $prefixText    = @$fieldSchema['fieldPrefix'];
  $readOnly      = ''; // add option for this later

  // get field value
  if      ($record)                                 { $fieldValue = @$record[ $fieldname ]; }
  else if (array_key_exists($fieldname, $_REQUEST)) { $fieldValue = @$_REQUEST[ $fieldname ]; }
  else                                              { $fieldValue = getEvalOutput(@$fieldSchema['defaultValue']); }
  $encodedValue  = htmlencode($fieldValue);

  // My Account - old password field
  if ($isMyAccountMenu && $fieldname == 'password') {
    $encodedValue         = '';
    $fieldSchema['label'] = t('New Password');
    $oldPseudoFieldSchema = array('name' => 'password:old' , 'label' => t('Current Password')) + $fieldSchema;
    _showTextfield($oldPseudoFieldSchema, $record);
  }

  // display field
  print <<<__HTML__
   <tr>
    <td>{$fieldSchema['label']}</td>
    <td>
      <span>$prefixText<!-- --></span><input type="$inputType" name="$fieldname" value="$encodedValue" size="20" $maxLengthAttr class="text-input" style="width: $styleWidth" $readOnly/>
      <span>$description<!-- --></span>
    </td>
   </tr>
__HTML__;

  // My Account - new password (again)
  if ($isMyAccountMenu && $fieldname == 'password') {
    $againPseudoFieldSchema = array('name' => 'password:again', 'label' => t('New Password (again)')) + $fieldSchema;
    _showTextfield($againPseudoFieldSchema, $record);
  }

}


//
function _showTextbox($fieldSchema, $record) {

  // set field attributes
  $fieldname   = $fieldSchema['name'];
  $fieldHeight = @$fieldSchema['fieldHeight'] ? $fieldSchema['fieldHeight'] : 100;
  $fieldPrefix = getEvalOutput( @$fieldSchema['fieldPrefix'] );
  if ($fieldPrefix != '') { $fieldPrefix .= "<br/>\n"; }
  $description = getEvalOutput( @$fieldSchema['description'] );

  // get field value
  if      ($record)                                 { $fieldValue = @$record[ $fieldname ]; }
  else if (array_key_exists($fieldname, $_REQUEST)) { $fieldValue = @$_REQUEST[ $fieldname ]; }
  else                                              { $fieldValue = getEvalOutput(@$fieldSchema['defaultContent']); }

  //
  if ($fieldSchema['autoFormat']) { $fieldValue = preg_replace("/<br\s*\/?>\r?\n/", "\n", $fieldValue); } // remove autoformat break tags
  $encodedValue  = htmlencode($fieldValue);

  // display field
  print <<<__HTML__
   <tr>
    <td style="vertical-align: top">{$fieldSchema['label']}</td>
    <td>
      $fieldPrefix
      <textarea name="{$fieldSchema['name']}" style="width: 100%; height: {$fieldHeight}px" rows="5" cols="50">$encodedValue</textarea><br/>
      $description
    </td>
   </tr>
__HTML__;
}


//
function _showWysiwyg($fieldSchema, $record) {

  // set field attributes
  $description = getEvalOutput( @$fieldSchema['description'] );
  $fieldHeight = @$fieldSchema['fieldHeight'] ? $fieldSchema['fieldHeight'] : 100;
  $fieldPrefix = @$fieldSchema['fieldPrefix'];
  if ($fieldPrefix != '') { $fieldPrefix .= "<br/>\n"; }

  // get field value
  $fieldname = $fieldSchema['name'];
  if      ($record)                                 { $fieldValue = @$record[ $fieldname ]; }
  else if (array_key_exists($fieldname, $_REQUEST)) { $fieldValue = @$_REQUEST[ $fieldname ]; }
  else                                              { $fieldValue = getEvalOutput(@$fieldSchema['defaultContent']); }
  $encodedValue  = htmlencode($fieldValue);

  // display field
  print <<<__HTML__
   <tr>
    <td style="vertical-align: top">{$fieldSchema['label']}</td>
    <td>
      $fieldPrefix
      <textarea name="{$fieldSchema['name']}" id="field_{$fieldSchema['name']}" rows="5" cols="40" style="width: 100%; height: {$fieldHeight}px; visibility: hidden;">$encodedValue</textarea>
      $description
    </td>
   </tr>
__HTML__;
}


//
function _showDateTime($fieldSchema, $record) {
  global $SETTINGS;
  $mysqlDateFormat = 'Y-m-d H:i:s';
  $prefixText      = @$fieldSchema['fieldPrefix'];
  $description     = getEvalOutput( @$fieldSchema['description'] );

  // get default date
  if     (@$fieldSchema['defaultDate'] == 'none')   { $defaultDateTime = ''; }
  elseif (@$fieldSchema['defaultDate'] == 'custom') { $defaultDateTime = @date($mysqlDateFormat, strtotime($fieldSchema['defaultDateString'])); }
  else                                              { $defaultDateTime = date($mysqlDateFormat); }

  // get date value(s)
  $dateValue  = @$record[$fieldSchema['name']] ? $record[$fieldSchema['name']] : $defaultDateTime;
  list($date,$time,$year,$month,$day,$hour24,$min,$sec,$amOrPm,$hour12) = array(null,null,null,null,null,null,null,null,null,null);
  if ($dateValue && $dateValue != '0000-00-00 00:00:00') { // mysql will default undefined dates to null or 0000-00-00 00:00:00
    list($date,$time)       = explode(' ', $dateValue); // expecting: YYYY-MM-DD HH:MM:SS
    list($year,$month,$day) = explode('-', $date);      // expecting: YYYY-MM-DD
    list($hour24,$min,$sec) = explode(':', $time);      // expecting: HH:MM:SS
    $amOrPm = $hour24 >= 12 ? 'PM' : 'AM';
    $hour12 = (($hour24 % 12) == 0) ? 12 : $hour24 % 12;
  }

  // get month options
  $monthOptions    = "<option value=''><!-- --></option>\n";
  $shortMonthNames = preg_split("/\s*,\s*/", t('Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'));
  foreach (range(1,12) as $num) {
    $selectedAttr   = selectedIf($num, $month, true);
    $shortMonthName = @$shortMonthNames[$num-1];
    $monthOptions .= "<option value=\"$num\" $selectedAttr>$shortMonthName</option>\n";
  }

  // get day options
  $dayOptions    = "<option value=''><!-- --></option>\n";
  foreach (range(1,31) as $num) {
    $selectedAttr  =  selectedIf($num, $day, true);
    $dayOptions   .= "<option value=\"$num\" $selectedAttr>$num</option>\n";
  }

  // get year options
  $yearRangeStart = $fieldSchema['yearRangeStart'] ? intval($fieldSchema['yearRangeStart']) : date('Y')-5; // v2.16 - default to 5 years previous if undefined
  $yearRangeEnd   = $fieldSchema['yearRangeEnd']   ? intval($fieldSchema['yearRangeEnd'])   : date('Y')+5; // v2.16 - default to 5 years ahead if undefined
  //Check if existing record field has a date outside the default year range.  If so, increase the year range to accommodate.
  if (isset($record[$fieldSchema['name']]) && $record[$fieldSchema['name']] !== '0000-00-00 00:00:00') {
    $recordTimeStamp = strtotime($record[$fieldSchema['name']]);
    if($recordTimeStamp) {
      $recordYear     = (int) date("Y", $recordTimeStamp);
      $yearRangeStart = min($yearRangeStart, $recordYear);
      $yearRangeEnd   = max($yearRangeEnd,   $recordYear);
    }
  }
  $yearOptions = "<option value=''><!-- --></option>\n";
  foreach (range($yearRangeStart, $yearRangeEnd) as $num) { // (int) for range bug in PHP < 4.23 - see docs
    $selectedAttr  = selectedIf($num, $year, true);
    $yearOptions  .= "<option value=\"$num\" $selectedAttr>$num</option>\n";
  }

  // get hour options
  $hour24Options = "<option value=''><!-- --></option>\n";
  $hour12Options = "<option value=''><!-- --></option>\n";
  foreach (range(0,23) as $num) {
    $zeroPaddedNum  = sprintf("%02d", $num);
    $selectedAttr   = selectedIf($num, $hour24, true);
    $hour24Options .= "<option value=\"$num\" $selectedAttr>$zeroPaddedNum</option>\n";
  }
  foreach (range(1,12) as $num) {
    $selectedAttr   = selectedIf($num, $hour12, true);
    $hour12Options .= "<option value=\"$num\" $selectedAttr>$num</option>\n";
  }

  // get minute options
  $minOptions = "<option value=''><!-- --></option>\n";
  foreach (range(0,59) as $num) {
    $zeroPaddedNum = sprintf("%02d", $num);
    $selectedAttr  = selectedIf($num, $min, true);
    $minOptions   .= "<option value=\"$num\" $selectedAttr>$zeroPaddedNum</option>\n";
  }

  // get second options
  $secOptions    = "<option value=''><!-- --></option>\n";
  foreach (range(0,59) as $num) {
    $zeroPaddedNum = sprintf("%02d", $num);
    $selectedAttr  = selectedIf($num, $sec, true);
    $secOptions   .= "<option value=\"$num\" $selectedAttr>$zeroPaddedNum</option>\n";
  }

  // get AmPm optins
  $amSelectedAttr = selectedIf($amOrPm, 'AM', true);
  $pmSelectedAttr = selectedIf($amOrPm, 'PM', true);

  // display date field
  print "   <tr>\n";
  print "    <td>{$fieldSchema['label']}</td>\n";
  print "    <td>$prefixText\n";

  $monthsField = "     <select name='{$fieldSchema['name']}:mon'>$monthOptions</select>\n";
  $daysField   = "     <select name='{$fieldSchema['name']}:day'>$dayOptions</select>\n";
  if ($SETTINGS['dateFormat'] == 'dmy') { print $daysField . $monthsField; }
  else                                  { print $monthsField . $daysField; }
  print "     <select name='{$fieldSchema['name']}:year'>$yearOptions</select>\n";

  // datepicker
  if (@$SETTINGS['advanced']['useDatepicker']):
    ?>
    &nbsp;<input type="hidden" name="<?php echo $fieldSchema['name'] ?>:string" id="<?php echo $fieldSchema['name'] ?>:string" value="<?php echo $date ?>" />&nbsp;
  <script type="text/javascript">
          $(function() {
            $("#<?php echo $fieldSchema['name'] ?>\\:string").datepicker({
              showOn: 'button',
          //yearRange: '<?php echo($yearRangeStart . ':' . $yearRangeEnd); ?>',
          //changeYear: true,
              buttonImage: '3rdParty/jqueryUI/calendar.gif',
              buttonImageOnly: true,
              dateFormat: 'yy-mm-dd',
              onClose: function(date) {
                var dateElements = date.split('-', 3);
            if (dateElements.length != 3) { dateElements = ['', '', '']; }
                var year  = dateElements[0];
                var month = dateElements[1].replace(/^[0]+/g, '');
                var day   = dateElements[2].replace(/^[0]+/g, '');

                $('[name=<?php echo $fieldSchema['name'] ?>\\:year]').val( year );
                $('[name=<?php echo $fieldSchema['name'] ?>\\:mon]').val( month );
                $('[name=<?php echo $fieldSchema['name'] ?>\\:day]').val( day );
              }
            });

            // update hidden date field on date change
            $('[name^=<?php echo $fieldSchema['name'] ?>\\:]').change(function() {
              setTimeout(function() { // wait 1/4 second, so updates to dropdowns can be completed before their change event firsts and updates the hidden date field again
                var date = $('[name=<?php echo $fieldSchema['name'] ?>\\:year]').val() +'-'
                         + $('[name=<?php echo $fieldSchema['name'] ?>\\:mon]').val() +'-'
                         + $('[name=<?php echo $fieldSchema['name'] ?>\\:day]').val();
                $('[name=<?php echo $fieldSchema['name'] ?>\\:string]').val(date);
              },250);
            });

          });
  </script>
  <?php
  endif;

  if ($fieldSchema['showTime']) {
    if (!@$SETTINGS['advanced']['useDatepicker']) {
      print "     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n";
    }
    if ($fieldSchema['use24HourFormat']) { // show 24 hour time
      print "     <select name='{$fieldSchema['name']}:hour24'>$hour24Options</select>\n";
      print "     <select name='{$fieldSchema['name']}:min'>$minOptions</select>\n";
      if ($fieldSchema['showSeconds']) { print "     <select name='{$fieldSchema['name']}:sec'>$secOptions</select>\n"; }
    }
    else {                                              // show 12 hour time
      print "     <select name='{$fieldSchema['name']}:hour12'>$hour12Options</select>\n";
      print "     <select name='{$fieldSchema['name']}:min'>$minOptions</select>\n";
      if ($fieldSchema['showSeconds']) { print "     <select name='{$fieldSchema['name']}:sec'>$secOptions</select>\n"; }
      print "     <select name='{$fieldSchema['name']}:isPM'>\n";
      print "     <option value=''><!-- --></option>\n";
      print "     <option value='0' $amSelectedAttr>AM</option>\n";
      print "     <option value='1' $pmSelectedAttr>PM</option>\n";
      print "     </select>\n";
    }
  }

  print "         $description</td>\n";
  print "        </tr>\n";
}

//
function _showList($fieldSchema, $record) {

  // set field attributes
  $recordArrayWithFilterFieldOnly = array(); // on record add we want chained-selects to show subsets of data based on prepoulated data for parent fields that is passed in urls
  $recordArrayWithFilterFieldOnly[ @$fieldSchema['filterField'] ] = coalesce( @$record[@$fieldSchema['filterField']], @$_REQUEST[@$fieldSchema['filterField']] );
  
  $listOptions = getListOptionsFromSchema($fieldSchema, $recordArrayWithFilterFieldOnly);
  $valignTop   = ($fieldSchema['listType'] != 'pulldown') ? 'style="vertical-align: top;"' : '';
  $prefixText  = @$fieldSchema['fieldPrefix'];
  $description = getEvalOutput( @$fieldSchema['description'] );

  // get field value
  $fieldname   = $fieldSchema['name'];
  if      ($record)                                 { $fieldValue = @$record[ $fieldname ]; }
  else if (array_key_exists($fieldname, $_REQUEST)) { $fieldValue = join("\t", (array) @$_REQUEST[ $fieldname ]); }
  else                                              { $fieldValue = getEvalOutput(@$fieldSchema['defaultValue']); }
  $fieldValues = preg_split("/\t/", $fieldValue, -1, PREG_SPLIT_NO_EMPTY); // for multi value fields
  $encodedValue  = htmlencode($fieldValue);

  // get list of values in database that aren't in list options (happens when list values are removed or field
  // ... was a textfield than switched to a pulldown that doesn't offer all the previously entered values as options
  $fieldValuesNotInList = array();
  $listOptionValues = array();
  foreach ($listOptions as $optionArray) {
    list($value,$label) = $optionArray;
    $listOptionValues[] = $value;
  }
  $fieldValuesNotInList = array_diff($fieldValues, $listOptionValues);
  $noLongerInListText   = (count($fieldValuesNotInList) > 1) ? t('Previous selections (no longer in list)') : t('Previous selection (no longer in list)');

  //
  print "  <tr>\n";
  print "   <td $valignTop>{$fieldSchema['label']}</td>\n";
  print "   <td>\n";

  // pulldown
  if      ($fieldSchema['listType'] == 'pulldown') {
    print "$prefixText\n";
    print "  <select name='{$fieldSchema['name']}'>\n";
    print "  <option value=''>&lt;select&gt;</option>\n";
    foreach ($listOptions as $optionArray) {
      list($value,$label) = $optionArray;
      $encodedValue = htmlencode($value);
      $selectedAttr = selectedIf($value, $fieldValue, true);
      $encodedLabel = htmlencode($label);
      print "<option value=\"$encodedValue\" $selectedAttr>$encodedLabel</option>\n";
    }

    // show database values not in current list options
    if ($fieldValuesNotInList) {
      print "  <optgroup label='$noLongerInListText'>\n";
      foreach ($fieldValuesNotInList as $value) {
        print "    <option value=\"" .htmlencode($value). "\" selected='selected'>" .htmlencode($value). "</option>\n";
      }
      print "  </optgroup>\n";
    }

    print "  </select>\n";
    print "$description\n";
  }

  // multi pulldown
  else if      ($fieldSchema['listType'] == 'pulldownMulti') {
    if ($prefixText) { print "$prefixText<br/>\n"; }
    print "  <select name='{$fieldSchema['name']}[]' multiple='multiple' size='5'>\n";
    foreach ($listOptions as $optionArray) {
      list($value,$label) = $optionArray;
      $encodedValue = htmlencode($value);
      $selectedAttr = (in_array($value, $fieldValues)) ? 'selected="selected"' : '';
      $encodedLabel = htmlencode($label);
      print "<option value=\"$encodedValue\" $selectedAttr>$encodedLabel</option>\n";
    }

    // show database values not in current list options
    if ($fieldValuesNotInList) {
      print "  <optgroup label='$noLongerInListText'>\n";
      foreach ($fieldValuesNotInList as $value) {
        print "    <option value=\"" .htmlencode($value). "\" selected='selected'>" .htmlencode($value). "</option>\n";
      }
      print "  </optgroup>\n";
    }

    print "  </select>\n";
    if ($description) { print "<br/>$description\n"; }
  }

  // radios
  else if ($fieldSchema['listType'] == 'radios') {
    if ($prefixText) { print "$prefixText<br/>\n"; }
    foreach ($listOptions as $optionArray) {
      list($value,$label) = $optionArray;
      $encodedValue = htmlencode($value);
      $encodedLabel = htmlencode($label);
      $checkedAttr  = ($value == $fieldValue) ? 'checked="checked"' : '';
      $idAttr       = "{$fieldSchema['name']}.$encodedValue";

      print "<input type='radio' name='{$fieldSchema['name']}' value='$encodedValue' id='$idAttr' $checkedAttr/>\n";
      print "<label for='$idAttr'>$encodedLabel<!-- --></label><br />\n\n";
    }

    // show database values not in current list options
    if ($fieldValuesNotInList) {
      print "$noLongerInListText<br />\n";
      foreach ($fieldValuesNotInList as $value) {
        $encodedValue = htmlencode($value);
        $encodedLabel = htmlencode($value);
        $idAttr       = "{$fieldSchema['name']}.$encodedValue";
        print "<input type='radio' name='{$fieldSchema['name']}' value='$encodedValue' id='$idAttr' checked='checked'/>\n";
        print "<label for='$idAttr'>$encodedLabel<!-- --></label><br />\n\n";
      }
    }
    if ($description) { print "$description\n"; }
  }

  // checkboxes
  else if ($fieldSchema['listType'] == 'checkboxes') {
    if ($prefixText) { print "$prefixText<br/>\n"; }
    foreach ($listOptions as $optionArray) {
      list($value,$label) = $optionArray;
      $encodedValue = htmlencode($value);
      $encodedLabel = htmlencode($label);
      $checkedAttr  = in_array($value, $fieldValues) ? 'checked="checked"' : '';
      $idAttr       = "{$fieldSchema['name']}.$encodedValue";

      print "<input type='checkbox' name='{$fieldSchema['name']}[]' value='$encodedValue' id='$idAttr' $checkedAttr/>\n";
      print "<label for='$idAttr'>$encodedLabel<!-- --></label><br />\n";
    }

    // show database values not in current list options
    if ($fieldValuesNotInList) {
      print "$noLongerInListText<br />\n";
      foreach ($fieldValuesNotInList as $value) {
        $encodedValue = htmlencode($value);
        $encodedLabel = htmlencode($value);
        $idAttr       = "{$fieldSchema['name']}.$encodedValue";
        print "<input type='checkbox' name='{$fieldSchema['name']}[]' value='$encodedValue' id='$idAttr' checked='checked' />\n";
        print "<label for='$idAttr'>$encodedLabel<!-- --></label><br />\n\n";
      }
    }
    if ($description) { print "$description\n"; }
  }

  //
  else { die("Unknown listType '{$fieldSchema['listType']}'!"); }


  // list fields w/ advanced filters - add onchange event handler to local filter field
  if (@$fieldSchema['filterField']) {
    $targetListField  = $fieldSchema['name'];
    ?>
    <script type="text/javascript"><!--
      $("[name='<?php echo $fieldSchema['filterField'] ?>']").change(function () {
        var targetListField = '<?php echo $targetListField ?>';
        var newFilterValue  = this.value;
        updateListFieldOptions(targetListField, newFilterValue);
      });
    // --></script>
    <?php
  }


  //
  print "   </td>\n";
  print "  </tr>\n";
}


//
function _showCheckbox($fieldSchema, $record) {

  // set field attributes
  $checkedAttr = '';
  if      (array_key_exists($fieldSchema['name'], $_REQUEST))    { $checkedAttr = (@$_REQUEST[$fieldSchema['name']]) ? 'checked="checked"' : ''; } // v2.60
  else if ($record && @$record{$fieldSchema['name']})            { $checkedAttr = 'checked="checked"'; }
  else if (!@$record['num'] && $fieldSchema['checkedByDefault']) { $checkedAttr = 'checked="checked"'; }
  $prefixText  = @$fieldSchema['fieldPrefix'];
  $description = getEvalOutput( @$fieldSchema['description'] ); // v2.52

  // display field
  print <<<__HTML__
   <tr>
    <td valign="top">{$fieldSchema['label']}</td>
    <td>
      $prefixText
      <input type="hidden"                         name="{$fieldSchema['name']}" value="0" />
      <input type="checkbox"  name="{$fieldSchema['name']}" value="1" id="{$fieldSchema['name']}" $checkedAttr/>
      <label for="{$fieldSchema['name']}">$description<!-- --></label>
    </td>
   </tr>
__HTML__;
}


//
function _showUpload($fieldSchema, $record) {
  global $preSaveTempId, $SETTINGS, $menu;

  $prefixText  = @$fieldSchema['fieldPrefix'];
  $description = @$fieldSchema['description'];
  if ($prefixText) { $prefixText .= "<br/>"; }

  // create uploadList url
  $uploadList = "?"
              . "menu=" . urlencode($menu)
              . "&amp;action=uploadList"
              . "&amp;fieldName=" . urlencode($fieldSchema['name'])
              . "&amp;num=" . urlencode(@$_REQUEST['num'])
              . "&amp;preSaveTempId=" . urlencode($preSaveTempId);

  // create uploadLink url
  $uploadLink = "?menu=" . urlencode($menu)
              . "&amp;action=uploadForm"
              . "&amp;fieldName=" . urlencode($fieldSchema['name'])
              . "&amp;num=" . urlencode(@$_REQUEST['num'])
              . "&amp;preSaveTempId=" . urlencode($preSaveTempId)
              . "&amp;TB_iframe=true&amp;height=350&amp;width=700&amp;modal=true";

  // error checking
  $errors = '';
  list($uploadDir, $uploadUrl) = getUploadDirAndUrl( $fieldSchema );
  if     (!file_exists($uploadDir)) { mkdir_recursive($uploadDir, 0755); }  // create upload dir (if not possible, dir not exists error will show below)
  if     (!file_exists($uploadDir)) { $errors .= "Upload directory '" .htmlencode($uploadDir). "' doesn't exist!.<br/>\n"; }
  elseif (!is_writable($uploadDir)) { $errors .= "Upload directory '" .htmlencode($uploadDir). "' isn't writable!.<br/>\n"; }

  // display errors
  if ($errors) { print <<<__HTML__
  <tr>
   <td valign="top"><br/>{$fieldSchema['label']}<br/></td>
   <td><div id='alert'><span>$errors</span></div></td>
  </tr>
__HTML__;
  return;
  }

  // display field
  ?>
   <tr>
    <td style="vertical-align: top"><?php echo $fieldSchema['label'] ?></td>
    <td>
      <?php echo $prefixText ?>
      <iframe id="<?php echo $fieldSchema['name'] ?>_iframe" src="<?php echo $uploadList ?>" height="100" width="100%" frameborder="0" class="uploadIframe"></iframe><br/>

      <?php $displayDefaultLink = applyFilters('edit_show_upload_link', true, $fieldSchema, $record); ?>
      <?php if ($displayDefaultLink): ?>

        <div style="position: relative; height: 24px;">
          <div style="position: absolute; top: 6px; width: 100%; text-align: center;">
            <?php if (inDemoMode()): ?>
              <a href="javascript:alert('<?php echo jsEncode(t('This feature is disabled in demo mode.')) ?>')"><b><?php echo t('Add or Upload File(s)') ?></b></a>
            <?php else: ?>
              <a href="<?php echo $uploadLink ?>" class="thickbox"><b><?php echo t('Add or Upload File(s)') ?></b></a>
            <?php endif ?>
          </div>
          <div style="position: absolute; z-index: 1; width: 100%; text-align: center;">
            <div id="<?php echo $fieldSchema['name'] ?>_uploadButton"></div>
          </div>
        </div>

        <?php $useFlashUploader = !@$SETTINGS['advanced']['disableFlashUploader']; ?>

        <?php if ($useFlashUploader && !inDemoMode()): ?>
          <?php $fileExtCSV = implode(',', preg_split("/\s*\,\s*/", strtolower($fieldSchema['allowedExtensions']))); ?>
          <div id="<?php echo $fieldSchema['name'] ?>_uploadTips" style="display: none; text-align: center; font-size: xx-small; margin-top: 2px;">
            <?php
              $isMac = (preg_match('/macintosh|mac os x/i', @$_SERVER['HTTP_USER_AGENT']));
              $key   = $isMac ? '<Command>' : '<Ctrl>';

              if (@$fieldSchema['maxUploads'] != 1) {
                echo htmlencode( t("Tip: hold $key to select multiple files") );
              }
            ?><br/>
            <?php echo $description ?>
          </div>
          <div class="uploadifyQueue" id="<?php echo $fieldSchema['name'] ?>_uploadQueue"></div>
          <script type="text/javascript">// <![CDATA[
            $(document).ready(function() {
              $('#<?php echo $fieldSchema['name'] ?>_uploadButton').uploadify(generateUploadifyOptions({
                'script'           : <?php echo json_encode( basename(@$_SERVER['SCRIPT_NAME'] ) ); ?>,
                'modifyAfterSave'  : <?php echo count(getUploadInfoFields($fieldSchema['name'])); ?>,
                'menu'             : <?php echo json_encode($menu); ?>,
                'fieldName'        : <?php echo json_encode($fieldSchema['name']) ?>,
                'num'              : <?php echo json_encode(@$_REQUEST['num'] ? $_REQUEST['num'] : '') ?>,
                'preSaveTempId'    : <?php echo json_encode($preSaveTempId) ?>,
                'buttonText'       : <?php echo json_encode(t('Upload File(s)'));?>,
                'fileExtCSV'       : <?php echo json_encode($fileExtCSV) ?>,
                'maxUploadSizeKB'  : <?php echo json_encode($fieldSchema['checkMaxUploadSize'] ? $fieldSchema['maxUploadSizeKB'] : 0) ?>,
                'loginDataEncoded' : <?php echo json_encode( @$_COOKIE[loginCookie_name(true)] ) ?>,
                'queueID'          : <?php echo json_encode($fieldSchema['name'] . "_uploadQueue") ?>
              }));
            });
          // ]]></script>
        <?php endif ?>
      <?php endif ?>

    </td>
   </tr>
  <?php
}



//
function _showSeparator($fieldSchema, $record) {
  $field = createFieldObject_fromSchema($fieldSchema);
  $html  = $field->getTableRow($record, '', 'edit');
  print $html;
}


//
function _showAccessList($fieldSchema, $record) {
  $field = createFieldObject_fromSchema($fieldSchema);
  $value = '';
  print $field->getTableRow($record, $value, 'edit');
}


//
function _showrelatedRecords($fieldSchema, $record) {
  $field = createFieldObject_fromSchema($fieldSchema);
  $value = @$record[$fieldSchema['name']];
  print $field->getTableRow($record, $value, 'edit');
}

//
function _showParentCategory($fieldSchema, $record, $schema) {
  global $escapedTableName, $CURRENT_USER;

  // set field attributes
  $fieldValue  = $record ? @$record[$fieldSchema['name']] : '';

  // load categories
  $categoriesByNum = array();
  $query = "SELECT * FROM `$escapedTableName` ORDER BY globalOrder";
  $result = mysql_query($query) or die("MySQL Error: " .mysql_error(). "\n");
  while ($row = mysql_fetch_assoc($result)) {
    $isOwner = @$row['createdByUserNum'] == $CURRENT_USER['num'];
    if (@$row['createdByUserNum'] && (!$isOwner && !$GLOBALS['hasEditorAccess'])) { continue; }
    $categoriesByNum[ $row['num'] ] = $row;
  }
  if (is_resource($result)) { mysql_free_result($result); }

  //
  print "  <tr>\n";
  print "   <td>{$fieldSchema['label']}</td>\n";
  print "   <td>\n";

  print "  <select name='{$fieldSchema['name']}'>\n";
  print "  <option value='0'>" . t('None (top level category)') . "</option>\n";

  $maxDepth = (int) @$schema['_maxDepth']; // if the user specifies 1, that should mean no subcategories
  foreach ($categoriesByNum as $num => $category) {
    $value           = $category['num'];
    $selectedAttr    = selectedIf($value, $fieldValue, true);
    $encodedLabel    = htmlencode($category['breadcrumb']);
    $exceedsMaxDepth = $maxDepth && $category['depth'] >= ($maxDepth - 1);
    $isUnavailable   = $exceedsMaxDepth || preg_match("/:" .@$record['num']. ":/", $category['lineage']);
    $extraAttr       = $isUnavailable ? "style='color: #AAA' disabled='disabled' " : '';

    print "<option value=\"$value\" $extraAttr $selectedAttr>$encodedLabel</option>\n";
  }
  print "  </select>\n";



  //
  print "   </td>\n";
  print "  </tr>\n";
}


//
function _showDateCalendar($fieldSchema, $record) {
  global $TABLE_PREFIX, $tableName;
  $calendarTable = $TABLE_PREFIX . "_datecalendar";

  // get dates
  $dates      = array();
  $date       = getdate();
  $monthNum   = $date['mon'];
  $year       = $date['year'];
  $firstMonth = sprintf("%04d%02d%02d", $year, $monthNum, '01');
  for ($i=1; $i<=12; $i++) {
    $dates[] = array('year' => $year, 'monthNum' => $monthNum);
    if (++$monthNum > 12) { $year++; $monthNum = 1; }
  }
  $lastMonth  = sprintf("%04d%02d%02d", $year, $monthNum, '01');

  // load dates from database
  $selectedDates = array();
  $query  = "SELECT DATE_FORMAT(date, '%Y%m%d') as date FROM `$calendarTable` ";
  $query .= "WHERE `tablename` = '$tableName' ";
  $query .= "  AND `fieldname` = '{$fieldSchema['name']}' ";
  $query .= "  AND `recordNum` = '".mysql_escape($_REQUEST['num'])."' ";
  $query .= "  AND '$firstMonth' <= `date` AND `date` <= '$lastMonth'";
  $result = mysql_query($query) or die("MySQL Error: ". htmlencode(mysql_error()) . "\n");
  while ($row = mysql_fetch_assoc($result)) {
    $selectedDates[ $row['date'] ] = 1;
  }
  if (is_resource($result)) { mysql_free_result($result); }

  // get calendar HTML
  $calendarHtml = '';
  foreach ($dates as $date) {
    $calendarHtml .= _createEditCalendar($fieldSchema['name'], $date['monthNum'], $date['year'], $selectedDates);
  }

  // display field
  print <<<__HTML__
   <tr>
    <td valign="top">{$fieldSchema['label']}</td>
    <td>$calendarHtml</td>
   </tr>
__HTML__;

}


//
function _createEditCalendar($fieldname, $monthNum, $year, $selectedDates) {
  global $TABLE_PREFIX;
  $html = '';

  // display header
  static $monthNames = array('null','January','February','March','April','May','June','July','August','September','October','November','December');
  $monthName = $monthNames[$monthNum];
  $html .= "<table border='1' cellspacing='0' cellpadding='2' style='float: left; margin: 10px'>\n";
  $html .= "<tr><th colspan='7' class='mo'>$monthName $year</th></tr>\n";
  $html .= "<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>\n";
  $html .= "\n<tr>\n";

  // display leading blank days
  $dayOfWeekCount = 1;
  $firstDayTime   = mktime(0, 0, 0, $monthNum, 1, $year);
  $firstDayOffset = date('w', $firstDayTime);
  for ($i=1; $i <= $firstDayOffset; $i++) {
    $html .= "<td><span class='dte0'>&nbsp;</span></td>\n";
    $dayOfWeekCount++;
  }

  // print days of month
  $rows = 1;
  $daysInMonth = cal_days_in_month(0, $monthNum, $year);
  foreach (range(1,$daysInMonth) as $dayNum) {
    $dateString  = sprintf("%04d%02d%02d", $year, $monthNum, $dayNum);
    $checkedAttr = @$selectedDates[$dateString] ? 'checked="checked"' : '';

    $html .= "<td>";
    $html .= "<label for='$fieldname:$dateString'>&nbsp;$dayNum&nbsp;</label>";
    $html .= "<input type='hidden'   name='$fieldname:$dateString' value='0' />";
    $html .= "<input type='checkbox' name='$fieldname:$dateString' id='$fieldname:$dateString' value='1' $checkedAttr style='margin: 0px' />";

    $html .= "</td>\n";
    if ($dayOfWeekCount == 7) {
      $html .= "</tr>\n\n<tr>\n";
      $dayOfWeekCount = 0;
      $rows++;
    }
    $dayOfWeekCount++;
  }

  // display trailing blank days
  while ($dayOfWeekCount <= 7) {
    $html .= "<td><span class='dte0'>&nbsp;</span></td>\n";
    $dayOfWeekCount++;
  }
  $html .= "</tr>\n";

  // display 6 rows (even if last row is all blank)
  while ($rows < 6) {
    $html .= "<tr>\n";
    foreach (range(1,7) as $n) {
      $html .= "<td><span class='dte0'>&nbsp;</span></td>\n";
    }
    $html .= "</tr>\n";
    $rows++;
  }

  // display footer
  $html .= "</table>\n\n";

  //
  return $html;
}

//
function showWysiwygGeneratorCode() {
  global $schema, $SETTINGS;

  // get wysiwyg list
  $wysiwygListAsCSV = '';

  foreach ($schema as $name => $fieldHash) {
    if (!is_array($fieldHash))            { continue; } // fields are stored as arrays, other entries are table metadata
    if (@$fieldHash['type'] != 'wysiwyg') { continue; } // skip all but wysiwyg fields

    $fieldSchema           = array('name' => $name) + $fieldHash;
    $fieldname             = $fieldSchema['name'];
    $uploadBrowserCallback = @$fieldSchema['allowUploads'] ? "wysiwygUploadBrowser" : '';
    initWysiwyg("field_$fieldname", $uploadBrowserCallback);
  }
}

?>
