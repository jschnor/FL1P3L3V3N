<?php

class NoneField extends Field {

function __construct($fieldSchema) {
  parent::__construct($fieldSchema);
}


//
function getDisplayValue($record) {

  // format createdBy/updatedBy dates
  require_once(SCRIPT_DIR . '/lib/fieldtypes/date.php');
  $dateFields = array('createdDate', 'updatedDate');
  if (in_array($this->name, $dateFields)) {
    return @DateField::getDisplayValue($record); // XXX: supress warning about calling a non-static method statically
  }

  // format createByUserNum/updatedByUserNum
  $value = parent::getDatabaseValue($record);
  $userNumFields = array('createdByUserNum', 'updatedByUserNum');
  if (in_array($this->name, $userNumFields)) {
    $accountsTable  = "{$GLOBALS['TABLE_PREFIX']}accounts";
    $query          = mysql_escapef("SELECT username FROM `$accountsTable` WHERE num = ?", $value);
    list($username) = mysql_get_query($query, true);
    $value          = $username;
    return $value;
  }

  return parent::getDisplayValue($record);
}


//
function getTableRow($record, $value, $formType) {

  // Don't show record number on view page
  if ($formType == 'view' && $this->name == 'num') { return ''; }

  // Don't show record number on view page
  if ($formType == 'view' && $this->name == 'dragSortOrder') { return ''; }

  //
  $html = parent::getTableRow($record, $value, $formType);

  // add linebreak after lastUpdatedBy
  if ($this->name == 'updatedByUserNum') {
    $html .= <<<__HTML__
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
__HTML__;
  }

  //
  return $html;
}


} // end of class

?>
