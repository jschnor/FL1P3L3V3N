<?php
  require_once "lib/menus/database/editField_functions.php";
  $field = getFieldAttributes($_REQUEST['fieldname']);

  $showValidation = @$_COOKIE['showAdvancedFieldEditorOptions'];
  $showAdvanced   = @$_COOKIE['showAdvancedFieldEditorOptions'];

  $tablesAndFieldnames  = getTablesAndFieldnames();
  $optionFieldnames     = @$tablesAndFieldnames[@$field['optionsTablename']];
  if (!$optionFieldnames) { $optionFieldnames = array(); }

  $thisTablesFieldnames = $tablesAndFieldnames[ getTableNameWithoutPrefix($tableName) ];

?>
<!DOCTYPE html
          PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
          "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />

  <?php include "lib/menus/header_css.php"; ?>

  <style type="text/css">
  body  { background-color: #FFFFFF; margin: 0px; }
  .label { width: 125px; padding: 6px; float: left;  };
  </style>

  <!-- javascript -->
  <script src="//code.jquery.com/jquery-1.11.0.min.js"></script><script>window.jQuery || document.write('<script src="3rdParty/jquery-1.11.0.min.js"><\/script>')</script>
  <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script><script>jQuery.migrateWarnings || document.write('<script src="3rdParty/jquery-migrate-1.2.1.min.js"><\/script>')</script>
  <script><!--
    tablesAndFieldnames = <?php echo json_encode($tablesAndFieldnames); ?>;
  //--></script>

 </head>
<body>

<form method="post" action="?" id="editFieldForm" onsubmit="return false;">
<input type="hidden" name="menu" value="database" />
<input type="hidden" name="_defaultAction" value="editTable" />
<input type="hidden" name="tableName" id="tableName" value="<?php echo htmlencode( getTableNameWithoutPrefix($_REQUEST['tableName']) ) ?>" />
<input type="hidden" name="fieldname" id="fieldname" value="<?php echo htmlencode($_REQUEST['fieldname']) ?>" />
<input type="hidden" name="order" id="order" value="<?php echo htmlencode(@$field['order']) ?>" />
<input type="hidden" name="editField" value="1" />
<input type="hidden" name="save" value="1" />
<input type="hidden" name="saveAndCopy" id="saveAndCopy" value="0" />


<div style="padding: 10px 10px 0px 10px;">
<?php function _showFormButtons() { ?>
  <div style="float: right">
    <input class="button" type="submit" name="save" value="<?php et('Save') ?>"  /><!-- form saved via ajax on submit, see js file) -->
    <input class="button" type="button" onclick="$('#saveAndCopy').val(1); $('form').submit();" value="<?php echo eht('Save & Copy'); ?>"  />
    <input class="button" type="button" onclick="self.parent.tb_remove()" value="<?php et('Cancel') ?>"  />
  </div>
<?php } ?>
  <?php _showFormButtons() ?>
  <div><h2><?php echo t('Admin'); ?> &gt; <?php echo t('Section Editors'); ?> &gt; <?php echo htmlencode(@$schema['menuName']) ?> &gt; <?php echo t('Field Editor'); ?></h2></div>
  <div class="divider_line"></div>
</div>

<?php displayAlertsAndNotices(); ?>

<div style="margin: 10px; ">

   <table cellspacing="0" width="100%" class="spacedTable" style="float: left;">
    <tr>
     <td class="columnFieldEditorTop"><?php echo t('Field Label');?></td>
     <td><input class="text-input" name="label" id="label" size="30" value="<?php echo htmlencode($field['label']) ?>" style="width: 225px;"
          onkeyup="autoFillBlankFieldName()" onchange="autoFillBlankFieldName()" /><?php echo t('(displayed beside field in editor'); ?></td>
    </tr>
    <tr>
     <td valign="top" style="padding-top: 4px"><?php echo t('Field Name');?></td>
     <td>
      <input class="text-input setAttr-spellcheck-false" name="newFieldname" id="newFieldname" size="30" value="<?php echo htmlencode(@$field['newFieldname']) ?>" style="width: 225px;" onkeyup="showSpecialFieldDescription();"/>
      <?php echo t('(used in PHP viewer code)');?><br/>
       <div id="specialFieldDescription"></div>
     </td>
    </tr>
    <tr>
     <td><?php echo t('Field Type');?></td>
      <td>
      <select name="type" id="fieldType" onchange="displayOptionsForFieldType(0)" onkeyup="displayOptionsForFieldType(0)" style="width: 225px;">
      <optgroup label="<?php eht('Basic Field Types'); ?>">
      <option value="none"      <?php selectedIf($field['type'], 'none') ?>><?php echo t('none'); ?></option>
      <option value="textfield" <?php selectedIf($field['type'], 'textfield') ?>><?php echo t('text field');?></option>
      <option value="textbox"   <?php selectedIf($field['type'], 'textbox') ?>><?php echo t('text box');?></option>
      <option value="wysiwyg"   <?php selectedIf($field['type'], 'wysiwyg') ?>><?php echo t('wysiwyg');?></option>
      <option value="date"      <?php selectedIf($field['type'], 'date') ?>><?php echo t('date/time');?></option>
      <option value="list"      <?php selectedIf($field['type'], 'list') ?>><?php echo t('list');?></option>
      <option value="checkbox"  <?php selectedIf($field['type'], 'checkbox') ?>><?php echo t('checkbox');?></option>
      <option value="upload"    <?php selectedIf($field['type'], 'upload') ?>><?php echo t('upload');?></option>
      <option value="separator" <?php selectedIf($field['type'], 'separator') ?>><?php echo t('--- separator ---');?></option>

      <optgroup label="<?php eht('Advanced Field Types'); ?>">
      <option value="relatedRecords" <?php selectedIf($field['type'], 'relatedRecords') ?>><?php echo t('Related Records');?></option>
      <?php if ($field['type'] == 'parentCategory'): ?>
        <option value="<?php echo $field['type'] ?>" <?php selectedIf(1,1) ?>><?php echo $field['type'] ?></option>
      <?php endif; ?>

<!--  -->

      </select>
     </td>
    </tr>
<?php if (@$field['customColumnType']): ?>
    <tr>
     <td valign="top" style="padding: 3px 0px;"><?php echo t('Custom Column Type');?></td>
     <td><?php echo htmlencode(@$field['customColumnType']); ?></td>
    </tr>
<?php endif; ?>

</table><br class="clear" />




  <fieldset>
  <legend><b><?php echo t('Field Options');?></b></legend>

  <div id="fieldOptionsContainer">
  <br/>

  <div style="display: none" class="fieldOption noOptions" align="center">
    <?php echo t('There are no options for this field type.');?><br/><br/>
  </div>

  <div style="display: none" class="fieldOption defaultValue">
    <div class="label"><?php echo t('Default Value');?></div>
    <div><input class="text-input" name="defaultValue" size="40" value="<?php echo htmlencode($field['defaultValue']) ?>" /></div>
  </div>

  <div style="display: none; width: 500px;" class="fieldOption defaultContent">
    <div class="label"><?php echo t('Default Value');?></div>
    <table border="0" cellspacing="0" cellpadding="0"><tr><td>
      <textarea name="defaultContent" cols="60" rows="3" onfocus="this.rows=10" onblur="this.rows=3" ><?php echo htmlencode($field['defaultContent']) ?></textarea><br/>
    </td></tr></table>
  </div>



  <div style="display: none" class="fieldOption checkboxOptions">
    <div class="label"><?php echo t('Default State');?></div>
    <div>
      <input type="radio"  id="checkedByDefault.1" name="checkedByDefault" value="1" <?php checkedIf($field['checkedByDefault'], '1') ?>/> <label for="checkedByDefault.1"><?php echo t('Checked'); ?></label>
      <input type="radio"  id="checkedByDefault.0" name="checkedByDefault" value="0" <?php checkedIf($field['checkedByDefault'], '0') ?> /> <label for="checkedByDefault.0"><?php echo t('Unchecked'); ?></label>
    </div>
  </div>

  <div style="display: none" class="fieldOption fieldPrefix clear">
    <div class="label"><?php echo t('Field Prefix'); ?></div>
    <div>
      <input class="text-input" name="fieldPrefix" size="40" value="<?php echo htmlencode($field['fieldPrefix']) ?>" />
      <?php echo t('displayed before or above field');?>
    </div>
  </div>

  <div style="display: none" class="fieldOption description clear">
    <div class="label"><?php echo t('Field Description'); ?></div>
    <div>
      <input class="text-input" name="description" size="40" value="<?php echo htmlencode($field['description']) ?>" />
      <?php echo t('displayed after or below field');?>
    </div>
  </div>

  <div style="display: none" class="fieldOption checkboxOptions">
    <div class="label"><?php echo t('Checked Value');?></div>
    <div><input class="text-input" name="checkedValue" size="40" value="<?php echo htmlencode($field['checkedValue']) ?>" /></div>
  </div>

  <div style="display: none" class="fieldOption checkboxOptions">
    <div class="label"><?php echo t('Unchecked Value');?></div>
    <div><input class="text-input" name="uncheckedValue" size="40" value="<?php echo htmlencode($field['uncheckedValue']) ?>" /></div>
  </div>


  <div style="display: none" class="fieldOption textboxHeight">
    <div class="label"><?php echo t('Field Height');?></div>
    <div><input class="text-input" type="text" name="fieldHeight" value="<?php echo htmlencode($field['fieldHeight']) ?>" size="4" /> <?php echo t('pixels (leave blank for default height)');?></div>
  </div>

  <div style="display: none" class="fieldOption fieldWidth">
    <div class="label"><?php echo t('Field Width');?></div>
    <div><input class="text-input" type="text" name="fieldWidth" value="<?php echo htmlencode($field['fieldWidth']) ?>" size="4" /> <?php echo t('pixels (leave blank for default width)');?></div>
  </div>

  <div style="display: none" class="fieldOption allowUploads"><br/>
    <div class="label"><?php echo t('Allow Uploads');?></div>
    <div>
      <input type="hidden" name="allowUploads" value="0"/>
      <input type="checkbox"  id="allowUploads" name="allowUploads" value="1" <?php checkedIf($field['allowUploads'], '1') ?> />
      <label for="allowUploads"><?php echo t('Allow uploads for this field');?></label>
    </div>
  </div>


  <div style="display: none" class="fieldOption dateOptions">


    <div class="label clear"><?php echo t('Default Value');?></div>
    <div style="float: left">
      <select name="defaultDate" id="defaultDate" onchange="updateDefaultDateFields()">
        <option value=''            <?php selectedIf($field['defaultDate'], ''); ?>><?php echo t('Current Date');?></option>
        <option value="none"       <?php selectedIf($field['defaultDate'], 'none'); ?>><?php echo t('None / Blank');?></option>
        <option value="custom"      <?php selectedIf($field['defaultDate'], 'custom'); ?>><?php echo t('Specify custom date (or strtotime value) below:');?></option>
      </select><br/>

      <span id="defaultDateStringAndLink" style="display: none">
      <input class="text-input" name="defaultDateString" id="defaultDateString"  size="40" value="<?php echo htmlencode($field['defaultDateString']) ?>" onkeyup="updateDefaultDateFields()" />
      &nbsp;<a href="http://php.net/manual/en/function.strtotime.php#function.strtotime.examples" target="_blank">strtotime() examples &gt;&gt;</a><br/>
      </span>

      <?php echo t('Preview:'); ?> <span id="defaultDatePreview"></span><br/>

    </div>
    <div class="clear"></div><br/>

    <div class="label clear"><?php echo t('Specify Time');?></div>
    <div>
      <input type="hidden" name="showTime" value="0"/>
      <input type="checkbox"  id="date_showHourMinFields" name="showTime" value="1" <?php checkedIf($field['showTime'], '1') ?> />
      <label for="date_showHourMinFields"><?php echo t('user specifies time (hour, minutes, and optionally seconds)');?></label>
    </div>

    <div class="label clear"><?php echo t('Specify Seconds');?></div>
    <div>
      <span class="indent">
      <input type="hidden" name="showSeconds" value="0"/>
      <input type="checkbox" class="inputSubfield"  id="date_showSecondsField" name="showSeconds" value="1" <?php checkedIf($field['showSeconds'], '1') ?> />
      <label for="date_showSecondsField"><?php echo t('user specifies seconds (requires &quot;Specify Time&quot; to be enabled)'); ?></label>
      </span>
    </div>

    <div class="label clear"><?php echo t('Use 24 Hour Time');?></div>
    <div>
      <span class="indent">
      <input type="hidden" name="use24HourFormat" value="0"/>
      <input type="checkbox" class="inputSubfield"  id="date_use24HourFormat" name="use24HourFormat" value="1" <?php checkedIf($field['use24HourFormat'], '1') ?> />
      <label for="date_use24HourFormat"><?php echo t('use 24 hour time when specifying hours');?></label>
      </span>
    </div><br/>

    <div class="label clear"><?php echo t('Year Range');?></div>
    <div>
      <input class="text-input" type="text" name="yearRangeStart" value="<?php echo htmlencode($field['yearRangeStart']); ?>" size="4" maxlength="4" /> to
      <input class="text-input" type="text" name="yearRangeEnd" value="<?php echo htmlencode($field['yearRangeEnd']); ?>" size="4" maxlength="4" />
      <?php echo t('Leave blank for 5 years before and after current year');?>
    </div>



  </div>

  <div style="display: none" class="fieldOption listOptions">
    <div class="label"><?php echo t('Display As');?></div>
    <table border="0" cellspacing="0" cellpadding="0"><tr><td>
      <input type="radio"  id="listType.pulldown" name="listType" value="pulldown" <?php checkedIf($field['listType'], 'pulldown') ?> />
      <label for="listType.pulldown"><?php echo t('pulldown');?></label><br />

      <input type="radio"   id="listType.radios" name="listType" value="radios" <?php checkedIf($field['listType'], 'radios') ?> />
      <label for="listType.radios"><?php echo t('radio buttons');?></label><br />


      <input type="radio"  id="listType.pulldownMulti" name="listType" value="pulldownMulti" <?php checkedIf($field['listType'], 'pulldownMulti') ?> />
      <label for="listType.pulldownMulti"><?php echo t('pulldown (multi value)');?></label><br />

      <input type="radio"   id="listType.checkboxes" name="listType" value="checkboxes" <?php checkedIf($field['listType'], 'checkboxes') ?> />
      <label for="listType.checkboxes"><?php echo t('checkboxes (multi value)');?></label><br />
    </td></tr></table>

    <br/>

    <div class="label"><?php echo t('List Options');?></div>
    <table border="0" cellspacing="0" cellpadding="0"><tr><td>

      <select name="optionsType" id="optionsType" onchange="displayListTypeOptions()">
        <option value="text"  <?php selectedIf($field['optionsType'], 'text'); ?>><?php echo t('Use options listed below');?></option>
        <option value="table" <?php selectedIf($field['optionsType'], 'table'); ?>><?php echo t('Get options from database (advanced)');?></option>
        <option value="query" <?php selectedIf($field['optionsType'], 'query'); ?>><?php echo t('Get options from MySQL query (advanced)');?></option>
      </select><br/>


      <div id="optionsTextDiv" style="display: none;">
        <textarea name="optionsText" cols="60" rows="3" onfocus="this.rows=10" onblur="this.rows=3"><?php echo htmlencode($field['optionsText']) ?></textarea><br/>
        <?php echo t('<b>Tip:</b> To save and display different values enter them like this: CD|Compact Disc');?>
      </div>

      <table border="0" cellspacing="0" cellpadding="0" id="optionsTable" style="display: none;">
       <tr>
        <td><?php echo t('Section Tablename');?> &nbsp;</td>
        <td>
          <select name="optionsTablename" id="optionsTablename" onchange="updateListOptionsFieldnames( this.value )">
          <option value=''>&lt;<?php echo t('select table');?>&gt;</option>
          <?php
            foreach ($tablesAndFieldnames as $optionTableName => $fields) {
              $selectedAttr = selectedIf($optionTableName, $field['optionsTablename'], true);
              print "<option value=\"$optionTableName\" $selectedAttr>$optionTableName</option>\n";
            }
          ?>
          </select>
        </td>
       </tr>
       <tr>
        <td><?php echo t('Use this field for option values');?> &nbsp;</td>
        <td>
          <select name="optionsValueField" id="optionsValueField">
          <option value=''>&lt;<?php echo t('select field');?>&gt;</option>
          <?php echo getSelectOptions($field['optionsValueField'], $optionFieldnames); ?>
          </select>
        </td>
       </tr>
       <tr>
        <td><?php echo t('Use this field for option labels');?> &nbsp;</td>
        <td>
          <select name="optionsLabelField" id="optionsLabelField">
          <option value=''>&lt;<?php echo t('select field');?>&gt;</option>
          <?php echo getSelectOptions($field['optionsLabelField'], $optionFieldnames); ?>
          </select>
        </td>
       </tr>
      </table>

      <div id="optionsQueryDiv" style="display: none;">
      <textarea name="optionsQuery" cols="60" rows="3" class="setAttr-spellcheck-false" onfocus="this.rows=10" onblur="this.rows=3"><?php echo htmlencode($field['optionsQuery']) ?></textarea><br/>
      <?php echo t('<b>Tip: &nbsp;</b> Insert table prefix like this: &lt;?php echo $TABLE_PREFIX ?&gt;<br/>'); ?>
      <br/>


      <?php echo t('<b>Advanced Filter:</b> Refresh list when this field changes:'); ?>

      <select name="filterField">
      <option value=''>&lt;<?php echo t('select field'); ?>&gt;</option>
      <?php echo getSelectOptions($field['filterField'], $thisTablesFieldnames); ?>
      </select><br/>
		<?php echo t('<b>Advanced Filter:</b> Insert <i>escaped</i> filter field value like this: &lt;?php echo $ESCAPED_FILTER_VALUE ?&gt;<br/>'); ?>
      </div>
    </td></tr></table>
  </div>



  <div style="display: none" class="fieldOption uploadOptions">
  </div>



  <div style="display: none" class="fieldOption separatorOptions">
    <div class="label"><?php echo t('Separator Type'); ?></div>
    <table border="0" cellspacing="0" cellpadding="0"><tr><td>
      <label><input type="radio"  id="separatorType.blankLine" name="separatorType" value="blank line" <?php checkedIf($field['separatorType'], 'blank line') ?> /> <?php echo t('Blank Line'); ?></label><br />

      <label><input type="radio"  id="separatorType.headerBar" name="separatorType" value="header bar" <?php checkedIf($field['separatorType'], 'header bar') ?> /> <?php echo t('Header Bar'); ?></label> &nbsp;<br />
      <input class="text-input inputSubfield" type="text" name="separatorHeader" value="<?php echo htmlencode($field['separatorHeader']) ?>" size="75" onfocus="$('#separatorType\\.headerBar').attr('checked', true);"/><br />

      <label><input type="radio"  id="separatorType.html" name="separatorType" value="html" <?php checkedIf($field['separatorType'], 'html') ?> /> <?php echo t('HTML'); ?></label><br />
      <textarea name="separatorHTML" cols="60" rows="3"  onfocus="$('#separatorType\\.html').attr('checked', true); this.rows=12" onblur="this.rows=3" class="inputSubfield setAttr-wrap-off"><?php echo htmlencode($field['separatorHTML']) ?></textarea>
    </td></tr></table>
  </div>


  <div style="display: none" class="fieldOption relatedRecordsOptions">

    <div class="label clear"><?php echo t('Related Table'); ?></div>
    <div>
      <select name="relatedTable">
      <option value=''>&lt;<?php echo t('select table'); ?>&gt;</option>
      <?php
        foreach ($tablesAndFieldnames as $optionTableName => $fields) {
          $selectedAttr = selectedIf($optionTableName, $field['relatedTable'], true);
          print "<option value=\"$optionTableName\" $selectedAttr>$optionTableName</option>\n";
        }
      ?>
      </select>
    </div>

    <div class="label clear"><?php echo t('Max Records'); ?></div>
    <div><?php echo t('Show the first '); ?><input class="text-input" type="text" name="relatedLimit" value="<?php echo htmlencode($field['relatedLimit']) ?>" size="3" /> <?php echo t('records only (leave blank for all)'); ?></div>

    <div class="label clear"><?php echo t('List Actions'); ?></div>
    <table border="0" cellspacing="0" cellpadding="0"><tr><td style="line-height: 150%">
      <!-- <label><input type="checkbox" name="relatedView" value="1" <?php checkedIf($field['relatedView'], '1') ?> />View</label> -->
      <label><input type="checkbox" name="relatedView"   value="1" <?php checkedIf($field['relatedView'], '1') ?> /><?php echo t('View'); ?></label>
      <label><input type="checkbox" name="relatedModify" value="1" <?php checkedIf($field['relatedModify'], '1') ?> /><?php echo t('Modify'); ?></label>
      <label><input type="checkbox" name="relatedErase"  value="1" <?php checkedIf($field['relatedErase'], '1') ?> /><?php echo t('Erase'); ?></label>
      <label><input type="checkbox" name="relatedCreate"  value="1" <?php checkedIf($field['relatedCreate'], '1') ?> /><?php echo t('Create'); ?></label>

    </td></tr></table><br/><br/>

    <div class="label clear"><?php echo t('MySQL Where'); ?></div>
    <table border="0" cellspacing="0" cellpadding="0"><tr><td style="line-height: 150%">
      <textarea name="relatedWhere" cols="60" rows="3" class="setAttr-spellcheck-false" onfocus="this.rows=10" onblur="this.rows=3"><?php echo htmlencode($field['relatedWhere']) ?></textarea><br/>
    </td></tr></table>

    <div class="label clear"><?php echo t('More "Search" Link'); ?></div>
    <table border="0" cellspacing="0" cellpadding="0"><tr><td style="line-height: 150%">
      <input class="text-input inputSubfield" type="text" name="relatedMoreLink" value="<?php echo htmlencode($field['relatedMoreLink']) ?>" size="75" /><br/>
      <?php echo t('Enter a standard url search in this field, example: fieldA_match=value1&amp;fieldB_keyword=value2<br/>
      <b>Note:</b> Field search suffixes are required.  Use field_match=, not field=.'); ?>
    </td></tr></table><br/>

    <div class="label clear"><?php echo t('PHP Reference'); ?></div>
    <table border="0" cellspacing="0" cellpadding="0"><tr><td style="line-height: 150%">
      <?php echo sprintf('<b>Tip:</b> You can use &lt;?php ?&gt; code in both of the above fields.  Available variables:'); ?><br/>

      <table border="0" cellspacing="1" cellpadding="1">
        <tr><td>$TABLE_PREFIX &nbsp;</td><td><?php echo t('Database table prefix '); ?>(<?php echo $TABLE_PREFIX ?>)</td></tr>
        <tr><td>$RECORD &nbsp;</td><td><?php echo t('Associative array of record being edited'); ?></td></tr>
      </table>
    </td></tr></table>

  </div>
  </fieldset><br/>


<fieldset>
  <legend><b><?php echo t('Input Validation'); ?></b> (
    <a href="#" class="showLink" style="<?php if ($showValidation) echo 'display:none' ?>"><?php echo t('show all'); ?></a>
    <a href="#" class="hideLink" style="<?php if (!$showValidation) echo 'display:none' ?>"><?php echo t('hide all'); ?></a>
  )</legend>

  <div style="text-align: center; padding-bottom: 10px; <?php if ($showValidation) echo 'display:none' ?>" class="sectionClosedMessage">
    <a href="#"><?php echo t('Click here to display'); ?></a><br/>
  </div>

  <div id="validationRulesContainer" class="container" style="<?php if (!$showValidation) echo 'display:none' ?>">
  <br/>

  <div style="display: none" class="fieldOption noValidationRules" align="center">
    <?php echo t('There are no validation rules for this field type.'); ?><br/><br/>
  </div>

  <div style="display: none" class="fieldOption requiredValue clear">
    <div class="label"><?php echo t('Required'); ?></div>
    <div>
      <input type="hidden" name="isRequired" value="0" />
      <input type="checkbox"  id="valueIsRequired" name="isRequired" value="1" <?php checkedIf($field['isRequired'], '1') ?> />
      <label for="valueIsRequired"><?php echo t('user may not leave field blank'); ?></label>
    </div>
  </div>

  <div class="clear"></div>

  <div style="display: none" class="fieldOption uniqueValue clear">
    <div class="label"><?php echo t('Unique'); ?></div>
    <div>
      <input type="hidden" name="isUnique" value="0"/>
      <input type="checkbox"  id="valueMustBeUnique" name="isUnique" value="1" <?php checkedIf($field['isUnique'], '1') ?>/>
      <label for="valueMustBeUnique"><?php echo t('user may not enter the same value as another record (not case-sensitive)'); ?></label>
    </div>
  </div>

  <div style="display: none" class="fieldOption minMaxLength">
    <br/>
    <div class="label"><?php echo t('Min Length'); ?></div>
    <div>
      <input class="text-input" name="minLength" size="4" value="<?php echo htmlencode(@$field['minLength']) ?>" /> <?php echo t('characters'); ?>
    </div>
    <div class="label"><?php echo t('Max Length'); ?></div>
    <div>
      <input class="text-input" name="maxLength" size="4" value="<?php echo htmlencode(@$field['maxLength']) ?>" /> <?php echo t('characters'); ?>
    </div>
  </div>

  <div style="display: none" class="fieldOption validationRule">
    <br/>
    <div class="label"><?php echo t('Allowed Content'); ?></div>

    <table border="0" cellspacing="0" cellpadding="0"><tr><td>
      <select name="charsetRule">
        <option value=''><?php eht('Allow all characters'); ?></option>
        <option value="allow"    <?php selectedIf($field['charsetRule'], 'allow') ?>><?php echo t('Only allow characters:'); ?></option>
        <option value="disallow" <?php selectedIf($field['charsetRule'], 'disallow') ?>><?php echo t('Disallow characters:'); ?></option>
      </select><br/>
      <input class="text-input" type="text" name="charset" value="<?php echo htmlencode(@$field['charset']) ?>" size="60" /><br/>
    </td></tr></table>

  </div>

  <div style="display: none" class="fieldOption uploadValidationFields"><br/>
    <div class="label"><?php echo t('Upload Settings'); ?></div>
    <table border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td><?php echo t('File extensions allowed: '); ?>&nbsp;</td>
        <td><input class="text-input medium-input" type="text" name="allowedExtensions" value="<?php echo htmlencode($field['allowedExtensions']) ?>" size="35" /><br /></td>
      </tr>
      <tr>
        <td>
          <input type="hidden"   name="checkMaxUploads" value="0" />
          <input type="checkbox" name="checkMaxUploads" id="checkMaxUploads" value="1"  <?php checkedIf(@$field['checkMaxUploads'], '1'); ?> />
          <label for="checkMaxUploads"><?php echo t('Maximum uploads:'); ?></label> &nbsp;
        </td>
        <td>
          <input class="text-input" type="text" name="maxUploads" value="<?php echo htmlencode($field['maxUploads']) ?>" size="5" />
          <?php echo t('files (uncheck for unlimited, set to 0 for none)'); ?>
        </td>
      </tr>
      <tr>
        <td>
          <input type="hidden"   name="checkMaxUploadSize" value="0" />
          <input type="checkbox" name="checkMaxUploadSize" id="checkMaxUploadSize" value="1"  <?php checkedIf(@$field['checkMaxUploadSize'], '1'); ?> />
          <label for="checkMaxUploadSize"><?php echo t('Maximum upload size:'); ?></label> &nbsp;
        </td>
        <td>
          <input class="text-input" type="text" name="maxUploadSizeKB" value="<?php echo htmlencode($field['maxUploadSizeKB']) ?>" size="5" />
          <?php echo t('Kbytes (uncheck for unlimited)'); ?>
        </td>
      </tr>
      <tr>
        <td>
          <input type="hidden"   name="resizeOversizedImages" value="0" />
          <input type="checkbox" name="resizeOversizedImages" id="resizeOversizedImages" value="1"  <?php checkedIf(@$field['resizeOversizedImages'], '1'); ?> />
          <label for="resizeOversizedImages"><?php echo t('Resize images larger than:'); ?></label> &nbsp;
        </td>
        <td>
          <?php echo t('width'); ?> <input class="text-input" size="4" name="maxImageWidth" value="<?php echo htmlencode($field['maxImageWidth']) ?>" />
          &nbsp;
          <?php echo t('height'); ?> <input class="text-input" type="text" size="4" name="maxImageHeight" value="<?php echo htmlencode($field['maxImageHeight']) ?>" />
        </td>
      </tr>

      <?php foreach(array('',2,3,4) as $num): ?>
      <tr>
        <td>
          <input type="hidden"   name="createThumbnails<?php echo $num ?>" value="0" />
          <input type="checkbox" name="createThumbnails<?php echo $num ?>" id="createThumbnails<?php echo $num ?>" value="1"  <?php checkedIf(@$field["createThumbnails$num"], '1'); ?> />
          <label for="createThumbnails<?php echo $num ?>">
          <?php echo t('Create thumbnail'); ?> <?php if ($num) { echo "($num)"; }?> :
          </label>
        </td>
        <td>
          <?php echo t('width'); ?> <input class="text-input" size="4"              name="maxThumbnailWidth<?php echo $num ?>"  id="maxThumbnailWidth<?php echo $num ?>"  value="<?php echo htmlencode($field["maxThumbnailWidth$num"]) ?>" />
          &nbsp;
          <?php echo t('height'); ?> <input class="text-input" type="text" size="4" name="maxThumbnailHeight<?php echo $num ?>" id="maxThumbnailHeight<?php echo $num ?>" value="<?php echo htmlencode($field["maxThumbnailHeight$num"]) ?>" />
          <a href="#" onclick="recreateThumbnails('<?php echo $num ?>'); return false;" id="recreateThumbnailsLink<?php echo $num ?>"><?php echo t('recreate'); ?></a>
          <span id="recreateThumbnailsStatus<?php echo $num ?>"></span>
        </td>
      </tr>
      <tr><td colspan="2" id="recreateThumbnailsErrors<?php echo $num ?>"></td></tr>

      <?php endforeach ?>
      <tr>
        <td colspan="2">
          <input type="checkbox" name="null" value='' style="visibility: hidden" />
          <i><?php echo t('Resized images maintain proportions, height and width are "maximum" values.'); ?></i>
        </td>
      </tr>
    </table>
  </div>

  </div>
  </fieldset><br/>


<fieldset>
  <legend><b><?php echo t('Advanced Options'); ?></b> (
    <a href="#" class="showLink" style="<?php if ($showAdvanced) echo 'display:none' ?>"><?php echo t('show all'); ?></a>
    <a href="#" class="hideLink" style="<?php if (!$showAdvanced) echo 'display:none' ?>"><?php echo t('hide all'); ?></a>
  )</legend>


  <div style="text-align: center; padding-bottom: 10px; <?php if ($showAdvanced) echo 'display:none' ?>" class="sectionClosedMessage">
    <a href="#"><?php echo t('Click here to display'); ?></a><br/>
  </div>


  <div id="advancedOptionsContainer" class="container" style="<?php if (!$showAdvanced) echo 'display:none' ?>">
  <br/>

   <!-- Field Attributes -->
  <div class="label clear"><?php echo t('Field Attributes'); ?></div>
  <div>
    <input type="hidden"   name="isSystemField" value="0" />
    <input type="checkbox" name="isSystemField" value="1" id="isSystemField" <?php checkedIf(@$field['isSystemField'], '1') ?>  />
    <label for="isSystemField"><?php echo t('System Field - restrict field editor access to this field'); ?></label><br/>
  </div>

  <div class="label clear">&nbsp;</div>
  <div>
    <select name="adminOnly" id="adminOnly">
      <option value='0' <?php selectedIf($field['adminOnly'], '0'); ?>> <?php echo t('Everyone'); ?> </option>
      <option value='1' <?php selectedIf($field['adminOnly'], '1'); ?>> <?php echo t('Editor Only'); ?> </option>
      <option value='2' <?php selectedIf($field['adminOnly'], '2'); ?>> <?php echo t('Admin Only'); ?> </option>
    </select>
    <label for="adminOnly"><?php echo t('Access Level - Choose if field has edit access restrictions.'); ?></label><br/>
  </div>

  <div style="display: none" class="fieldOption isPasswordField">
    <div class="label clear">&nbsp;</div>
    <div>
      <input type="hidden" name="isPasswordField" value="0"/>
      <input type="checkbox"  id="textfield_isPasswordField" name="isPasswordField" value="1" <?php checkedIf($field['isPasswordField'], '1') ?> />
      <label for="textfield_isPasswordField"><?php eht("Password Field - hide text that users enter (show values as <code>*****</code>)"); ?></label>
    </div>
  </div>

  <div style="display: none" class="fieldOption disableAutoFormat clear">
    <div class="label">&nbsp;</div>
    <div>
      <input type="hidden" name="autoFormat" value="1"/>
      <input type="checkbox"  id="textbox_autoFormat" name="autoFormat" value="0" <?php checkedIf($field['autoFormat'], '0') ?> />
      <label for="textbox_autoFormat"><?php echo t('Disable auto-formatting (don\'t add break tags to content)'); ?></label>
    </div>
  </div>

  <div style="display: none" class="fieldOption myAccountField clear">
    <div class="label">&nbsp;</div>
    <div>
      <input type="hidden" name="myAccountField" value="0"/>
      <input type="checkbox" name="myAccountField" id="myAccountField" value="1" <?php checkedIf($field['myAccountField'], '1') ?> />
      <label for="myAccountField"><?php echo t('My Account - Show this field in "My Account" section'); ?></label>
    </div>
  </div>

  <!-- advanced upload options -->
  <div style="display: none" class="fieldOption advancedUploadFields clear"><br/>

    <div class="label"><?php echo t('Upload Fields'); ?></div>
    <table border="0" cellspacing="0" cellpadding="0">
      <tr><td style="padding-bottom: 3px;"><?php echo t('These extra fields will be displayed on the upload form and available in viewers.'); ?></td></tr>
      <tr><td style="padding-left: 15px"><?php echo t('info1'); ?> &nbsp; <input class="text-input" type="text" name="infoField1" value="<?php echo htmlencode(@$field['infoField1']) ?>" size="20" /></td></tr>
      <tr><td style="padding-left: 15px"><?php echo t('info2'); ?> &nbsp; <input class="text-input" type="text" name="infoField2" value="<?php echo htmlencode(@$field['infoField2']) ?>" size="20" /></td></tr>
      <tr><td style="padding-left: 15px"><?php echo t('info3'); ?> &nbsp; <input class="text-input" type="text" name="infoField3" value="<?php echo htmlencode(@$field['infoField3']) ?>" size="20" /></td></tr>
      <tr><td style="padding-left: 15px"><?php echo t('info4'); ?> &nbsp; <input class="text-input" type="text" name="infoField4" value="<?php echo htmlencode(@$field['infoField4']) ?>" size="20" /></td></tr>
      <tr><td style="padding-left: 15px"><?php echo t('info5'); ?> &nbsp; <input class="text-input" type="text" name="infoField5" value="<?php echo htmlencode(@$field['infoField5']) ?>" size="20" /></td></tr>
    </table>
  </div>

  <div style="display: none" class="fieldOption advancedUploadDir"><br/>
    <div class="label"><?php echo t('Upload Directory'); ?></div>
    <table border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td rowspan="99" valign="top">
          <input type="hidden"   name="useCustomUploadDir" value="0" />
          <input type="checkbox" name="useCustomUploadDir" id="useCustomUploadDir" value="1"  <?php checkedIf(@$field['useCustomUploadDir'], '1'); ?>
                 onclick="if (this.checked) { $('.customUploadRow').show(); } else { $('.customUploadRow').hide(); }" />
        </td>
        <td colspan="2" style="padding: 4px 0px">&nbsp;<label for="useCustomUploadDir"><?php et('Use custom upload directory') ?></label></td>
      </tr>

      <?php $customUploadRowDisplay = (@$field['useCustomUploadDir']) ? "inherit" : "none"; ?>

      <tr class="customUploadRow" style="display: <?php echo $customUploadRowDisplay ?>">

      <tr class="customUploadRow" style="display: <?php echo $customUploadRowDisplay ?>">
        <td><?php echo t('Directory Path'); ?>&nbsp;</td>
        <td>
          <input class="text-input" type="text" name="customUploadDir" id="customUploadDir" value="<?php echo htmlencode(@$field['customUploadDir']) ?>" size="50" /><br/>
          <small>Example: custom/ &nbsp; (relative to <a href="?menu=admin&action=general" target="_top">Upload Dir</a> in General Settings)</small><br/>
          <small>Example: <?php echo $SETTINGS['uploadDir'] ?>custom/</small><br/>

        </td>
      </tr>

      <tr class="customUploadRow" style="display: <?php echo $customUploadRowDisplay ?>">
        <td colspan="2">&nbsp;</td>
      </tr>

      <tr class="customUploadRow" style="display: <?php echo $customUploadRowDisplay ?>">
        <td>Folder Url</td>
        <td>
          <input class="text-input" type="text" name="customUploadUrl" id="customUploadUrl" value="<?php echo htmlencode(@$field['customUploadUrl']) ?>" size="50" /><br/>
          <small>Example: custom/ &nbsp; (relative to <a href="?menu=admin&action=general" target="_top">Upload URL</a> in General Settings)</small><br/>
          <small>Example: <?php echo $SETTINGS['uploadUrl'] ?>custom/</small>

        </td>
      </tr>
    </table>
  </div>

  <div style="display: none" class="fieldOption customColumnType clear"><br/>
    <div class="label"><?php echo t('MySQL Column Type'); ?></div>
    <table><tr><td>
      <?php
        $columnTypesAuto = array(
          ''                   => t("Auto"),
        );
        $columnTypesNumeric = array(        
          'INT'                => t("INT (max: +/- 2 billion, doesn't support decimals)"),
          'BIGINT'             => t("BIGINT (max: +/- 9 billion billion, doesn't support decimals)"),
          'DECIMAL(14,2)'      => t("DECIMAL(14,2) (max: +/- 999 billion, supports 2 decimal places)"),
        );
        $columnTypesString = array(        
          'VARCHAR(255)'       => t("VARCHAR(255) (max: 255 chars)"),
          'MEDIUMTEXT'         => t("MEDIUMTEXT (max: 16 megs)"),
        );
        $columnTypesCustom = array(        
          '_customColumnType_' => t("Other/Custom (enter MySQL column type below)"),
        );
        $columnTypes = $columnTypesAuto + $columnTypesNumeric + $columnTypesString + $columnTypesCustom;
        $selectedOption = $field['customColumnType'];
        $textfieldValue = '';
        if (!@$columnTypes[$selectedOption]) {
          $selectedOption = '_customColumnType_';
          $textfieldValue = $field['customColumnType'];
        }
        
        function showCustomColumnTypeOption() {
        }
        
      ?>
      <select name="customColumnType-select" onchange="$('.customColumnRow').toggle( $(this).val() === '_customColumnType_' );">

        <?php echo getSelectOptions($selectedOption, array_keys($columnTypesAuto), array_values($columnTypesAuto)) ?>
        
        <optgroup label="Numberic Types">
          <?php echo getSelectOptions($selectedOption, array_keys($columnTypesNumeric), array_values($columnTypesNumeric)) ?>        
        </optgroup>

        <optgroup label="Text/String Types">
          <?php echo getSelectOptions($selectedOption, array_keys($columnTypesString), array_values($columnTypesString)) ?>        
        </optgroup>
        
        <optgroup label="Custom Types">
          <?php echo getSelectOptions($selectedOption, array_keys($columnTypesCustom), array_values($columnTypesCustom)) ?>        
        </optgroup>
        
      </select>
      <div class="customColumnRow" <?php echo $textfieldValue ? '' : 'style="display: none;"' ?>>
        <input class="text-input" name="customColumnType" size="60" value="<?php echo htmlencode($textfieldValue) ?>" />
        <a href="http://dev.mysql.com/doc/refman/5.0/en/data-type-overview.html" target="_blank">MySQL Data Types &gt;&gt;</a>
      </div>
    </td></tr></table>
  </div>

  <div style="display: none" class="fieldOption indexed clear"><br/>
    <div class="label"><?php echo t('MySQL Indexing'); ?></div>
    <div>
      <input type="hidden" name="indexed" value="0"/>
      <label>
        <input type="checkbox" name="indexed" value="1" <?php checkedIf(@$field['indexed'], '1') ?> />
        <?php
          $format = t('Create %scolumn index%s - speeds up sorting and some searches but slows down adding and saving records.');
          echo sprintf($format, '<a href="http://dev.mysql.com/doc/refman/5.0/en/column-indexes.html" target="_blank">', '</a>');
        ?>
      </label>
    </div>
  </div>

  </div>
  </fieldset>

<div style="padding: 10px 0px 10px 0px">
  <div class="divider_line"></div>
  <?php _showFormButtons() ?>
</div>
  <div class="clear"></div>

</div>

</form>

<script src="lib/admin_functions.js?<?php echo filemtime('lib/admin_functions.js'); // on file change browsers should no longer use cached versions ?>"></script>
<script src="3rdParty/jqueryPlugins/jqueryForm.js"></script>
<script src="lib/menus/database/editField_functions.js"></script>

</body>
</html>
