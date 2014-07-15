<?php

class CheckboxField extends Field {

function __construct($fieldSchema) {
  parent::__construct($fieldSchema);
}

//
function getDisplayValue($record) {
  $isChecked   = parent::getDatabaseValue($record);
  $displayText = $isChecked ? @$this->checkedValue : @$this->uncheckedValue;
  return $displayText;
}


// editFormHtml
function editFormHtml($record) {
  // set field attributes
  $checkedAttr = '';
  if      ($record && @$record{$this->name})    { $checkedAttr = 'checked="checked"'; }
  else if (!@$record['num'] && $this->checkedByDefault) { $checkedAttr = 'checked="checked"'; }
  $prefixText  = @$this->fieldPrefix;
  $description = @$this->description;

  // display field
  print <<<__HTML__
 <tr>
  <td valign="top">{$this->label}</td>
  <td>
    $prefixText
    <input type="hidden"                         name="{$this->name}" value="0" />
    <input type="checkbox"  name="{$this->name}" value="1" id="{$this->name}" $checkedAttr/>
    <label for="{$this->name}">$description</label>
  </td>
 </tr>
__HTML__;
}

} // end of class

?>
